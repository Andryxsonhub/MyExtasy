// src/components/PimentaShopModal.tsx
// --- VERSÃO ATUALIZADA PARA MERCADOPAGO (CHECKOUT PRO) ---

import React, { useEffect, useState } from 'react';
import api from '@/services/api';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Loader2, X } from 'lucide-react';

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

/* =========================
   Helpers
========================= */
const formatPrice = (priceInCents: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
    priceInCents / 100
  );

/* =========================
   Componente principal
========================= */
const PimentaShopModal: React.FC<PimentaShopModalProps> = ({ isOpen, onClose }) => {
  const [packages, setPackages] = useState<PimentaPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Para carregar os pacotes
  const [isProcessing, setIsProcessing] = useState(false); // Para criar o checkout
  
  // Usado para saber qual botão deve mostrar o spinner
  const [selectedPackageId, setSelectedPackageId] = useState<number | null>(null);

  const resetModalState = () => {
    setIsLoading(true);
    setIsProcessing(false);
    setSelectedPackageId(null);
  };

  useEffect(() => {
    if (!isOpen) {
      resetModalState();
      return;
    }

    const fetchPackages = async () => {
      setIsLoading(true);
      try {
        // A rota /payments/packages continua a mesma
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

  /* =========================
     MERCADOPAGO
   ========================= */

  /**
   * Chamado quando o usuário clica em "Comprar pacote".
   * 1. Chama o backend para criar a preferência de pagamento.
   * 2. Redireciona o usuário para o checkout do MercadoPago.
   */
  const handleCreateCheckout = async (pkg: PimentaPackage) => {
    setIsProcessing(true);
    setSelectedPackageId(pkg.id);

    try {
      // 1. Chamar a NOVA ROTA do backend
      const { data } = await api.post('/payments/create-pimenta-checkout', {
        packageId: pkg.id,
      });

      // 2. O backend responde com a { checkoutUrl }
      if (data && data.checkoutUrl) {
        // 3. Redireciona o usuário para a página do MercadoPago
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error('URL de checkout não recebida.');
      }
    } catch (error) {
      console.error('Erro ao criar checkout MercadoPago:', error);
      toast.error('Ops! Algo deu errado.', {
        description: 'Não foi possível iniciar o pagamento. Tente novamente.',
      });
      setIsProcessing(false);
      setSelectedPackageId(null);
    }
    // Se o redirecionamento funcionar, o isProcessing não precisa ser false.
    // O usuário já terá saído da página.
  };

  /* =========================
     Render
   ========================= */
  const renderContent = () => {
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
                  onClick={() => handleCreateCheckout(pkg)}
                  size="lg"
                  className="bg-green-800 hover:bg-green-700 w-full mt-4"
                  disabled={isProcessing} // Desativa todos os botões se um estiver processando
                >
                  {isProcessing && selectedPackageId === pkg.id ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    'Comprar pacote'
                  )}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
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

// O componente PaymentForm (formulário de cartão) foi removido
// pois não é mais necessário com o MercadoPago Checkout Pro.

export default PimentaShopModal;