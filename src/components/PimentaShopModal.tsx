// src/components/PimentaShopModal.tsx
// VERSÃO FINAL — PIX via qr_codes + Cartão de Crédito (PagBank)

import React, { useEffect, useState } from 'react';
import api from '@/services/api';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthProvider';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Loader2, X, Copy, CreditCard, QrCode, AlertTriangle } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import usePagSeguroScript from '@/hooks/usePagSeguroScript';

// A lib do PagBank injeta um global. Mantemos como any para não brigar com o TS.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const PagSeguro: any;

/* =========================
   Tipagens
========================= */
interface PimentaPackage {
  id: number;
  name: string;
  priceInCents: number;
  pimentaAmount: number;
}
interface PimentaShopModalProps {
  isOpen: boolean;
  onClose: () => void;
}
interface PaymentFormData {
  holderName: string;
  holderDocument: string; // CPF/CNPJ do titular
  cardNumber: string;
  expiry: string; // MM/AA
  cvv: string;
}
interface PaymentFormProps {
  selectedPackage: PimentaPackage;
  onSubmit: (cardData: PaymentFormData) => void;
  onBack: () => void;
  isProcessing: boolean;
  error: string | null;
  isScriptReady: boolean;
}
interface PagBankLink {
  rel?: string;
  href: string;
  media?: string;
  type?: string;
}
interface PagBankQr {
  id?: string;
  text?: string;
  emv?: string;
  qr_code?: string;
  links?: PagBankLink[];
  expiration_date?: string;
  expires_at?: string;
}

/* =========================
   Helpers
========================= */
const formatPrice = (priceInCents: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
    priceInCents / 100
  );

type Step = 'select_package' | 'select_method' | 'show_card_form' | 'show_pix_qr';

/* =========================
   Componente principal
========================= */
const PimentaShopModal: React.FC<PimentaShopModalProps> = ({ isOpen, onClose }) => {
  const scriptStatus = usePagSeguroScript(); // 'loading' | 'ready' | 'error'
  const { user, setUser } = useAuth();

  const [packages, setPackages] = useState<PimentaPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<PimentaPackage | null>(null);

  const [step, setStep] = useState<Step>('select_package');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const [qrCodeData, setQrCodeData] = useState<{
    text?: string;
    link?: string;
    expiresAt?: string;
  } | null>(null);

  const resetModalState = () => {
    setIsLoading(true);
    setSelectedPackage(null);
    setPaymentError(null);
    setQrCodeData(null);
    setStep('select_package');
  };

  useEffect(() => {
    if (!isOpen) {
      resetModalState();
      return;
    }
    const fetchPackages = async () => {
      setIsLoading(true);
      try {
        // nossa API já tem baseURL com /api — aqui usamos caminho relativo de payments
        const { data } = await api.get('/payments/packages');
        setPackages(data);
      } catch (err) {
        console.error('Erro ao buscar pacotes:', err);
        toast.error('Erro ao carregar pacotes', {
          description: 'Não foi possível buscar os pacotes. Tente novamente.',
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchPackages();
  }, [isOpen]);

  const handleSelectPackage = (pkg: PimentaPackage) => {
    setSelectedPackage(pkg);
    setStep('select_method');
  };

  /* =========================
     PIX
  ========================= */
  const handlePayWithPix = async () => {
    if (!selectedPackage) return;
    setIsProcessing(true);
    setPaymentError(null);

    // em produção, PagBank exige CPF/CNPJ do pagador
    const taxFromUser =
      (user as unknown as { cpf?: string; taxId?: string })?.cpf ||
      (user as unknown as { taxId?: string })?.taxId ||
      '';
    const customerTaxId = String(taxFromUser || '').replace(/\D/g, '') || undefined;

    try {
      const { data } = await api.post('/payments/checkout', {
        packageId: selectedPackage.id,
        method: 'PIX',
        customerTaxId, // se vier vazio no dev não tem problema; em prod é obrigatório
      });

      // A resposta do backend é a própria resposta /orders do PagBank
      // Procuramos o primeiro QR:
      const qr: PagBankQr | undefined =
        data?.qr_codes?.[0] ||
        data?.order?.qr_codes?.[0] ||
        data?.data?.order?.qr_codes?.[0];

      if (!qr) {
        throw new Error('QR Code não retornado pelo provedor.');
      }

      const emvText = qr.text || qr.emv || qr.qr_code || '';
      const qrImg = qr.links?.find((l) =>
        /qrcode|image|png/i.test(`${l.rel ?? ''}${l.media ?? ''}${l.type ?? ''}`)
      )?.href;

      if (!emvText && !qrImg) {
        throw new Error('Não foi possível identificar o conteúdo do QR.');
      }

      setQrCodeData({
        text: emvText || undefined,
        link: qrImg || undefined,
        expiresAt: qr.expiration_date || qr.expires_at,
      });
      setStep('show_pix_qr');
    } catch (error) {
      console.error('Erro ao criar ordem Pix:', error);
      toast.error('Não foi possível gerar a cobrança Pix.');
      setPaymentError('Ocorreu um erro ao gerar o PIX. Tente novamente.');
      setStep('select_method');
    } finally {
      setIsProcessing(false);
    }
  };

  /* =========================
     CRÉDITO
  ========================= */
  const handleSubmitCardPayment = async (cardData: PaymentFormData) => {
    if (!selectedPackage || scriptStatus !== 'ready') {
      setPaymentError('Serviço de pagamento indisponível. Tente novamente em instantes.');
      return;
    }
    setIsProcessing(true);
    setPaymentError(null);

    // 1) criptografa o cartão com a PUBLIC KEY
    const card = {
      publicKey: import.meta.env.VITE_PAGBANK_PUBLIC_KEY,
      holder: cardData.holderName,
      number: cardData.cardNumber.replace(/\s/g, ''),
      expMonth: cardData.expiry.split('/')[0],
      expYear: '20' + cardData.expiry.split('/')[1],
      securityCode: cardData.cvv,
    };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const result = PagSeguro.encryptCard(card);
    if (result.hasErrors) {
      const errorCode = result.errors[0].code;
      const errorMessage = `Erro nos dados do cartão (código: ${errorCode}). Verifique e tente novamente.`;
      setPaymentError(errorMessage);
      toast.error('Erro de Validação', { description: errorMessage });
      setIsProcessing(false);
      return;
    }

    const encryptedCard: string = result.encryptedCard;
    const customerTaxId =
      cardData.holderDocument?.replace(/\D/g, '') ||
      (user as unknown as { cpf?: string })?.cpf?.replace(/\D/g, '');

    try {
      const { data } = await api.post('/payments/checkout', {
        packageId: selectedPackage.id,
        method: 'CREDIT_CARD',
        card: {
          encryptedCard,
          holderName: cardData.holderName,
        },
        customerTaxId: customerTaxId || undefined,
      });

      toast.success('Pagamento enviado!', { description: 'Aguarde a confirmação.' });

      // se o backend devolver novo saldo imediato (ex.: approved instantly)
      if (user && typeof data?.newPimentaBalance === 'number') {
        setUser({ ...user, pimentaBalance: data.newPimentaBalance });
      }

      onClose();
    } catch (error) {
      let errorMessage = 'Não foi possível processar seu pagamento.';
      if (typeof error === 'object' && error !== null && 'response' in error) {
        const responseError = error as { response?: { data?: { message?: string } } };
        if (responseError.response?.data?.message) errorMessage = responseError.response.data.message;
      }
      setPaymentError(errorMessage);
      toast.error('Ops! Algo deu errado.', { description: errorMessage });
    } finally {
      setIsProcessing(false);
    }
  };

  /* =========================
     Render
  ========================= */
  const renderContent = () => {
    switch (step) {
      case 'select_method':
        if (!selectedPackage) return null;
        return (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-primary">Escolha como pagar</h2>
              <p className="text-lg text-muted-foreground mt-2">
                Você está comprando: <span className="font-bold text-foreground">{selectedPackage.name}</span>
              </p>
              <p className="text-2xl font-bold text-foreground">{formatPrice(selectedPackage.priceInCents)}</p>
            </div>

            <div className="max-w-md mx-auto space-y-4">
              <Button onClick={handlePayWithPix} size="lg" className="w-full" disabled={isProcessing}>
                {isProcessing ? <Loader2 className="animate-spin" /> : (<><QrCode className="mr-2 h-5 w-5" /> Pagar com PIX</>)}
              </Button>

              <Button
                onClick={() => setStep('show_card_form')}
                size="lg"
                className="w-full"
                variant="outline"
                disabled={scriptStatus !== 'ready'}
              >
                {scriptStatus === 'loading' && (<><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Carregando...</>)}
                {scriptStatus === 'ready' && (<><CreditCard className="mr-2 h-5 w-5" /> Pagar com Cartão</>)}
                {scriptStatus === 'error' && (<><AlertTriangle className="mr-2 h-5 w-5 text-red-500" /> Erro no Serviço</>)}
              </Button>

              <Button onClick={() => setStep('select_package')} variant="ghost" className="w-full">
                Voltar
              </Button>
            </div>
          </div>
        );

      case 'show_pix_qr':
        if (!qrCodeData) return null;
        return (
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-4 text-center">Pague com Pix</h2>
            <p className="text-gray-400 mb-6 text-center">
              Escaneie o QR Code abaixo com o app do seu banco.
            </p>

            {qrCodeData.text ? (
              <div className="bg-white p-4 rounded-lg inline-block">
                <QRCodeSVG value={qrCodeData.text} size={256} />
              </div>
            ) : (
              qrCodeData.link && (
                <div className="bg-white p-4 rounded-lg inline-block">
                  <img src={qrCodeData.link} alt="QR Code PIX" width={256} height={256} />
                </div>
              )
            )}

            {qrCodeData.text && (
              <div className="bg-gray-800 p-2 rounded-lg flex items-center mt-4 w-full max-w-sm">
                <p className="text-xs text-gray-300 break-all truncate mr-2">{qrCodeData.text}</p>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    navigator.clipboard.writeText(qrCodeData.text!);
                    toast.success('Código Pix copiado!');
                  }}
                >
                  <Copy className="h-5 w-5" />
                </Button>
              </div>
            )}

            {qrCodeData.expiresAt && (
              <p className="text-xs text-muted-foreground mt-2">
                Expira em: {new Date(qrCodeData.expiresAt).toLocaleString()}
              </p>
            )}

            <Button onClick={() => setStep('select_method')} variant="ghost" className="w-full max-w-sm mt-6">
              Voltar
            </Button>
          </div>
        );

      case 'show_card_form':
        return (
          <PaymentForm
            selectedPackage={selectedPackage!}
            onSubmit={handleSubmitCardPayment}
            onBack={() => setStep('select_method')}
            isProcessing={isProcessing}
            error={paymentError}
            isScriptReady={scriptStatus === 'ready'}
          />
        );

      default:
        return (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-primary">Muito mais prazer!</h2>
              <p className="text-lg text-muted-foreground mt-2">
                Impulsione seu perfil ou destaque suas mensagens
              </p>
            </div>

            {isLoading ? (
              <div className="text-center p-10 flex justify-center items-center">
                <Loader2 className="animate-spin h-10 w-10" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {packages.map((pkg, idx) => (
                  <div
                    key={pkg.id}
                    className={`rounded-lg p-6 flex flex-col items-center shadow-lg bg-background relative ${
                      idx === 1 ? 'border-2 border-primary' : 'border border-border'
                    }`}
                  >
                    {idx === 1 && (
                      <span className="absolute -top-4 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-bold">
                        MAIS POPULAR
                      </span>
                    )}
                    <p className="text-2xl font-bold">{pkg.pimentaAmount.toLocaleString('pt-BR')} 🌶️</p>
                    <p className="text-lg font-semibold text-foreground">Pimentas</p>
                    <p className={`text-4xl font-extrabold my-2 ${idx === 1 ? 'text-primary' : 'text-foreground'}`}>
                      {formatPrice(pkg.priceInCents)}
                    </p>
                    <Button
                      onClick={() => handleSelectPackage(pkg)}
                      size="lg"
                      className="bg-green-800 hover:bg-green-700 w-full mt-4"
                    >
                      Comprar pacote
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-2xl p-8 w-full max-w-4xl text-card-foreground relative transition-all duration-300">
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
          <X size={24} />
        </button>
        {renderContent()}
      </div>
    </div>
  );
};

/* =========================
   Formulário de cartão
========================= */
const PaymentForm: React.FC<PaymentFormProps> = ({
  selectedPackage,
  onSubmit,
  onBack,
  isProcessing,
  error,
  isScriptReady,
}) => {
  const [formData, setFormData] = useState<PaymentFormData>({
    holderName: '',
    holderDocument: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-primary">Pagamento com Cartão</h2>
        <p className="text-lg text-muted-foreground mt-2">
          Você está comprando: <span className="font-bold text-foreground">{selectedPackage.name}</span>
        </p>
        <p className="text-2xl font-bold text-foreground">{formatPrice(selectedPackage.priceInCents)}</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
        <Input
          name="holderName"
          placeholder="Nome do Titular (como no cartão)"
          value={formData.holderName}
          onChange={handleInputChange}
          required
        />
        <Input
          name="holderDocument"
          placeholder="CPF/CNPJ do Titular"
          value={formData.holderDocument}
          onChange={handleInputChange}
          required
        />
        <Input
          name="cardNumber"
          placeholder="Número do Cartão"
          value={formData.cardNumber}
          onChange={handleInputChange}
          required
        />
        <div className="flex gap-4">
          <Input
            name="expiry"
            placeholder="Validade (MM/AA)"
            className="w-1/2"
            value={formData.expiry}
            onChange={handleInputChange}
            required
          />
          <Input
            name="cvv"
            placeholder="CVV"
            className="w-1/2"
            value={formData.cvv}
            onChange={handleInputChange}
            required
          />
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button type="button" onClick={onBack} variant="outline" className="w-full" disabled={isProcessing}>
            Voltar
          </Button>
          <Button type="submit" className="w-full" disabled={!isScriptReady || isProcessing}>
            {!isScriptReady ? (
              <>
                <Loader2 className="animate-spin mr-2" />
                Aguarde...
              </>
            ) : (
              `Pagar ${formatPrice(selectedPackage.priceInCents)}`
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PimentaShopModal;
