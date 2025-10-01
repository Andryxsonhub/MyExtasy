// src/components/PimentaShopModal.tsx (VERSÃO COM CAMINHO CORRIGIDO)

import React, { useState, useEffect } from 'react';
import { fetchPimentaPackages } from '@/services/pimentasApi'; // <-- CORREÇÃO AQUI

// Interface para definir o formato de um pacote de pimentas
interface PimentaPackage {
  id: number;
  name: string;
  priceInCents: number;
  pimentaAmount: number;
  createdAt: string;
}

// Interface para as props do nosso componente
interface PimentaShopModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Função para formatar centavos para Reais (R$)
const formatPrice = (priceInCents: number) => {
  const priceInReais = priceInCents / 100;
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(priceInReais);
};

const PimentaShopModal: React.FC<PimentaShopModalProps> = ({ isOpen, onClose }) => {
  const [packages, setPackages] = useState<PimentaPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    (async () => {
      setIsLoading(true);
      const data = await fetchPimentaPackages();
      setPackages(data);
      setIsLoading(false);
    })();
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    // Fundo semi-transparente
    <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
      {/* Container do Modal */}
      <div className="bg-card rounded-lg shadow-2xl p-8 w-full max-w-4xl text-card-foreground relative transform transition-all duration-300 scale-100">
        {/* Botão de Fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {/* Cabeçalho */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-primary">Muito mais prazer!</h2>
          <p className="text-lg text-muted-foreground mt-2">Impulsione seu perfil no explorar ou destaque suas mensagens</p>
        </div>

        {/* Corpo com os Pacotes */}
        {isLoading ? (
          <div className="text-center p-10 text-foreground">Carregando pacotes...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Pacote 1 (MELHOR OFERTA) */}
            <div className="border-2 border-primary rounded-lg p-6 flex flex-col items-center shadow-lg relative bg-background">
              <span className="absolute -top-4 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-bold">MELHOR OFERTA</span>
              <p className="text-2xl font-bold">{packages[0]?.pimentaAmount || 1000} 🌶️</p>
              <p className="text-lg font-semibold text-foreground">Pimentas</p>
              <p className="text-muted-foreground line-through mt-4">de R$ 19,90 por</p>
              <p className="text-4xl font-extrabold text-primary my-2">{formatPrice(packages[0]?.priceInCents || 990)}</p>
              <button className="bg-green-800 text-white w-full py-3 rounded-lg font-bold text-lg hover:bg-green-700 transition-colors mt-4">
                Comprar pacote
              </button>
            </div>
            
            {/* Pacote 2 */}
            <div className="border border-border rounded-lg p-6 flex flex-col items-center shadow-md bg-background">
              <p className="text-2xl font-bold">{packages[1]?.pimentaAmount || 7500} 🌶️</p>
              <p className="text-lg font-semibold text-foreground">Pimentas</p>
              <p className="text-muted-foreground line-through mt-4">de R$ 59,99 por</p>
              <p className="text-4xl font-extrabold text-foreground my-2">{formatPrice(packages[1]?.priceInCents || 4999)}</p>
              <button className="bg-green-800 text-white w-full py-3 rounded-lg font-bold text-lg hover:bg-green-700 transition-colors mt-4">
                Comprar pacote
              </button>
            </div>

            {/* Pacote 3 */}
            <div className="border border-border rounded-lg p-6 flex flex-col items-center shadow-md bg-background">
              <p className="text-2xl font-bold">{packages[2]?.pimentaAmount || 15000} 🌶️</p>
              <p className="text-lg font-semibold text-foreground">Pimentas</p>
              <p className="text-muted-foreground line-through mt-4">de R$ 119,90 por</p>
              <p className="text-4xl font-extrabold text-foreground my-2">{formatPrice(packages[2]?.priceInCents || 9990)}</p>
              <button className="bg-green-800 text-white w-full py-3 rounded-lg font-bold text-lg hover:bg-green-700 transition-colors mt-4">
                Comprar pacote
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PimentaShopModal;