// src/components/PimentaShopModal.tsx (VERSÃO COMPLETA COM CORREÇÃO DO CPF)

import React, { useState, useEffect } from 'react';
import api from '@/services/api';
import { toast } from "sonner";
import { useAuth } from '@/contexts/AuthProvider';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Loader2 } from 'lucide-react';

declare const PagSeguro: any;

interface PimentaPackage {
  id: string;
  name: string;
  priceInCents: number;
  pimentaAmount: number;
}

interface PimentaShopModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const formatPrice = (priceInCents: number) => {
  const priceInReais = priceInCents / 100;
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(priceInReais);
};

const PimentaShopModal: React.FC<PimentaShopModalProps> = ({ isOpen, onClose }) => {
  const [packages, setPackages] = useState<PimentaPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<PimentaPackage | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const { user, setUser } = useAuth();

  useEffect(() => {
    if (!isOpen) {
      setSelectedPackage(null);
      setPaymentError(null);
      return;
    };

    const hardcodedPackages: PimentaPackage[] = [
      { id: '1000_PIMENTAS', name: 'Pacote 1000 Pimentas', pimentaAmount: 1000, priceInCents: 990 },
      { id: '7500_PIMENTAS', name: 'Pacote 7500 Pimentas', pimentaAmount: 7500, priceInCents: 4999 },
      { id: '15000_PIMENTAS', name: 'Pacote 15000 Pimentas', pimentaAmount: 15000, priceInCents: 9990 },
    ];
    setPackages(hardcodedPackages);
    setIsLoading(false);

  }, [isOpen]);

  const handleSelectPackage = (pkg: PimentaPackage) => {
    setSelectedPackage(pkg);
  };

  const handleGoBackToPackages = () => {
    setSelectedPackage(null);
    setPaymentError(null);
  };

  const handleSubmitPayment = async (cardData: any) => {
    if (!selectedPackage) return;
    setIsProcessing(true);
    setPaymentError(null);

    const card = {
      publicKey: import.meta.env.VITE_PAGBANK_PUBLIC_KEY,
      holder: cardData.holderName,
      number: cardData.cardNumber.replace(/\s/g, ''),
      expMonth: cardData.expiry.split('/')[0],
      expYear: '20' + cardData.expiry.split('/')[1],
      securityCode: cardData.cvv,
    };

    const result = PagSeguro.encryptCard(card);

    if (result.hasErrors) {
      const errorCode = result.errors[0].code;
      console.error("Erro de encriptação:", result.errors[0]);
      setPaymentError(`Erro nos dados do cartão (código: ${errorCode}). Verifique e tente novamente.`);
      setIsProcessing(false);
      return;
    }

    const encryptedCard = result.encryptedCard;

    try {
      const response = await api.post('/api/payments/process-card', {
        packageId: selectedPackage.id,
        encryptedCard: encryptedCard,
        holderName: cardData.holderName,
        holderDocument: cardData.holderDocument.replace(/\D/g, ''),
      });

      toast.success('Compra realizada!', { description: 'Suas pimentas foram adicionadas com sucesso.' });

      if (user) {
        const updatedUser = { ...user, pimentaBalance: response.data.newPimentaBalance };
        setUser(updatedUser);
      }

      onClose();

    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Não foi possível processar seu pagamento.';
      console.error("Erro no backend:", errorMessage);
      setPaymentError(errorMessage);
      toast.error('Ops! Algo deu errado.', { description: errorMessage });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-2xl p-8 w-full max-w-4xl text-card-foreground relative transform transition-all duration-300">
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {!selectedPackage ? (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-primary">Muito mais prazer!</h2>
              <p className="text-lg text-muted-foreground mt-2">Impulsione seu perfil ou destaque suas mensagens</p>
            </div>
            {isLoading ? (
              <div className="text-center p-10">Carregando...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {packages.map((pkg, index) => (
                  <div key={pkg.id} className={`rounded-lg p-6 flex flex-col items-center shadow-lg bg-background relative ${index === 0 ? 'border-2 border-primary' : 'border border-border'}`}>
                    {index === 0 && <span className="absolute -top-4 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-bold">MELHOR OFERTA</span>}
                    <p className="text-2xl font-bold">{pkg.pimentaAmount} 🌶️</p>
                    <p className="text-lg font-semibold text-foreground">Pimentas</p>
                    <p className={`text-4xl font-extrabold my-2 ${index === 0 ? 'text-primary' : 'text-foreground'}`}>{formatPrice(pkg.priceInCents)}</p>
                    <Button onClick={() => handleSelectPackage(pkg)} size="lg" className="bg-green-800 hover:bg-green-700 w-full mt-4">
                      Comprar pacote
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <PaymentForm
            selectedPackage={selectedPackage}
            onSubmit={handleSubmitPayment}
            onBack={handleGoBackToPackages}
            isProcessing={isProcessing}
            error={paymentError}
          />
        )}
      </div>
    </div>
  );
};

const PaymentForm: React.FC<any> = ({ selectedPackage, onSubmit, onBack, isProcessing, error }) => {
  const [formData, setFormData] = useState({ holderName: '', holderDocument: '', cardNumber: '', expiry: '', cvv: '' });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  }

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-primary">Pagamento</h2>
        <p className="text-lg text-muted-foreground mt-2">Você está comprando: <span className="font-bold text-foreground">{selectedPackage.name}</span></p>
        <p className="text-2xl font-bold text-foreground">{formatPrice(selectedPackage.priceInCents)}</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
        <Input name="holderName" placeholder="Nome do Titular (como no cartão)" value={formData.holderName} onChange={handleInputChange} required />
        {/* --- CORREÇÃO DO BUG DO CPF --- */}
        <Input name="holderDocument" placeholder="CPF do Titular" value={formData.holderDocument} onChange={handleInputChange} required />
        <Input name="cardNumber" placeholder="Número do Cartão" value={formData.cardNumber} onChange={handleInputChange} required />
        <div className="flex gap-4">
          <Input name="expiry" placeholder="Validade (MM/AA)" className="w-1/2" value={formData.expiry} onChange={handleInputChange} required />
          <Input name="cvv" placeholder="CVV" className="w-1/2" value={formData.cvv} onChange={handleInputChange} required />
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button type="button" onClick={onBack} variant="outline" className="w-full" disabled={isProcessing}>
            Voltar
          </Button>
          <Button type="submit" className="w-full" disabled={isProcessing}>
            {isProcessing ? <Loader2 className="animate-spin" /> : `Pagar ${formatPrice(selectedPackage.priceInCents)}`}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default PimentaShopModal;