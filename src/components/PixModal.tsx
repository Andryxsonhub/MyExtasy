// frontend/src/components/PixModal.tsx (COM VERIFICAÇÃO DE PAGAMENTO)

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; // Usamos nosso serviço de API
import { Button } from './ui/button';
import { CheckCircle, Copy, Hourglass } from 'lucide-react';

interface PixModalProps {
  isOpen: boolean;
  onClose: () => void;
  pixData: {
    paymentId: number;
    qrCodeBase64: string;
    qrCode: string;
  } | null;
}

const PixModal: React.FC<PixModalProps> = ({ isOpen, onClose, pixData }) => {
  const navigate = useNavigate();
  const [isCopied, setIsCopied] = useState(false);
  
  // 1. NOVOS ESTADOS para controlar o fluxo de pagamento
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'approved' | 'failed'>('pending');
  
  // Usamos useRef para guardar o ID do intervalo e limpá-lo corretamente
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleCopy = () => {
    if (pixData) {
      navigator.clipboard.writeText(pixData.qrCode);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };
  
  // 2. useEffect para INICIAR e PARAR a verificação de pagamento
  useEffect(() => {
    // Função que limpa o intervalo
    const clearPolling = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    // Só começa a verificar se o modal estiver aberto e tiver um ID de pagamento
    if (isOpen && pixData?.paymentId) {
      setPaymentStatus('pending'); // Reseta o status sempre que o modal abre
      
      // Define a função que verifica o status
      const checkStatus = async () => {
        try {
          const response = await api.get(`/payments/payment-status/${pixData.paymentId}`);
          if (response.data.status === 'approved') {
            setPaymentStatus('approved');
            clearPolling(); // Para de verificar
            
            // Espera 3 segundos para o usuário ver a mensagem de sucesso e redireciona
            setTimeout(() => {
              onClose(); // Fecha o modal
              navigate('/meu-perfil'); // Leva para a página de perfil
            }, 3000);
          }
        } catch (error) {
          console.error("Erro ao verificar status do pagamento:", error);
          // Opcional: poderia mudar o status para 'failed' aqui
        }
      };

      // Começa a verificar a cada 5 segundos
      intervalRef.current = setInterval(checkStatus, 5000);
    }

    // 3. FUNÇÃO DE LIMPEZA: é executada quando o modal fecha
    return () => {
      clearPolling();
    };
  }, [isOpen, pixData, navigate, onClose]);


  if (!isOpen || !pixData) return null;

  // 4. Renderização condicional baseada no status do pagamento
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4">
      <div className="bg-card text-white p-8 rounded-lg shadow-xl w-full max-w-md relative text-center">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white" disabled={paymentStatus === 'approved'}>✕</button>
        
        {/* TELA DE PAGAMENTO APROVADO */}
        {paymentStatus === 'approved' && (
          <div className="flex flex-col items-center justify-center animate-pulse">
            <CheckCircle className="w-20 h-20 text-green-500 mb-6" />
            <h2 className="text-2xl font-bold mb-3">Pagamento Aprovado!</h2>
            <p className="text-gray-300">Você será redirecionado em breve...</p>
          </div>
        )}

        {/* TELA DE PENDENTE DE PAGAMENTO */}
        {paymentStatus === 'pending' && (
          <>
            <h2 className="text-2xl font-bold mb-2">Pague com PIX</h2>
            <p className="text-gray-400 mb-6">Aponte a câmera do seu celular ou use o código abaixo.</p>
            <div className="flex justify-center mb-6">
              <img src={`data:image/jpeg;base64,${pixData.qrCodeBase64}`} alt="QR Code PIX" className="rounded-lg border-4 border-white" />
            </div>
            <div className="relative">
              <input
                type="text"
                value={pixData.qrCode}
                readOnly
                className="w-full bg-background border border-border rounded-md px-3 py-2 pr-12 text-sm text-gray-300"
              />
              <Button size="sm" variant="ghost" className="absolute right-1 top-1/2 -translate-y-1/2" onClick={handleCopy}>
                {isCopied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            <div className="flex items-center justify-center text-yellow-500 mt-4 text-sm">
                <Hourglass className="w-4 h-4 mr-2 animate-spin"/>
                Aguardando pagamento...
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PixModal;

