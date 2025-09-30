// src/components/PimentaShopModal.tsx

import React, { useState, useEffect } from 'react';
import { fetchPimentaPackages } from '../services/pimentasApi';

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
    // Se o modal não estiver aberto, não faz nada
    if (!isOpen) return;

    // Função auto-executável para buscar os pacotes
    (async () => {
      setIsLoading(true);
      const data = await fetchPimentaPackages();
      setPackages(data);
      setIsLoading(false);
    })();
  }, [isOpen]); // Roda o efeito toda vez que o modal abre

  // Se não estiver aberto, não renderiza nada
  if (!isOpen) {
    return null;
  }

  return (
    // Fundo semi-transparente
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      {/* Container do Modal */}
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-4xl text-gray-800 relative transform transition-all duration-300 scale-100">
        {/* Botão de Fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {/* Cabeçalho */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-pink-600">Muito mais prazer!</h2>
          <p className="text-lg text-gray-500 mt-2">Impulsione seu perfil no explorar ou destaque suas mensagens</p>
        </div>

        {/* Corpo com os Pacotes */}
        {isLoading ? (
          <div className="text-center p-10">Carregando pacotes...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pacote 1 */}
            <div className="border-2 border-green-400 rounded-lg p-6 flex flex-col items-center shadow-lg relative">
              <span className="absolute -top-4 bg-pink-600 text-white px-4 py-1 rounded-full text-sm font-bold">MELHOR OFERTA</span>
              <p className="text-2xl font-bold">{packages[0]?.pimentaAmount || 1000} 🌶️</p>
              <p className="text-lg font-semibold">Pimentas</p>
              <p className="text-gray-500 line-through mt-4">de R$ 19,90 por</p>
              <p className="text-4xl font-extrabold text-green-500 my-2">{formatPrice(packages[0]?.priceInCents || 990)}</p>
              <button className="bg-green-400 text-white w-full py-3 rounded-lg font-bold text-lg hover:bg-green-500 transition-colors mt-4">
                Comprar pacote
              </button>
            </div>
            
            {/* Pacote 2 */}
            <div className="border border-gray-200 rounded-lg p-6 flex flex-col items-center shadow-md">
              <p className="text-2xl font-bold">{packages[1]?.pimentaAmount || 5500} 🌶️</p>
              <p className="text-lg font-semibold">Pimentas</p>
              <p className="text-gray-500 line-through mt-4">de R$ 59,99 por</p>
              <p className="text-4xl font-extrabold text-gray-800 my-2">{formatPrice(packages[1]?.priceInCents || 4999)}</p>
              <button className="bg-green-400 text-white w-full py-3 rounded-lg font-bold text-lg hover:bg-green-500 transition-colors mt-4">
                Comprar pacote
              </button>
            </div>

            {/* Pacote 3 */}
            <div className="border border-gray-200 rounded-lg p-6 flex flex-col items-center shadow-md">
              <p className="text-2xl font-bold">{packages[2]?.pimentaAmount || 10000} 🌶️</p>
              <p className="text-lg font-semibold">Pimentas</p>
              <p className="text-gray-500 line-through mt-4">de R$ 119,90 por</p>
              <p className="text-4xl font-extrabold text-gray-800 my-2">{formatPrice(packages[2]?.priceInCents || 9990)}</p>
              <button className="bg-green-400 text-white w-full py-3 rounded-lg font-bold text-lg hover:bg-green-500 transition-colors mt-4">
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