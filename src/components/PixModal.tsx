// frontend/src/components/PixModal.tsx

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Button } from './ui/button';
import { CheckCircle, Copy, Hourglass } from 'lucide-react';

// --- INTERFACE ATUALIZADA PARA O FORMATO CORRETO DOS DADOS ---
interface PixModalProps {
  isOpen: boolean;
  onClose: () => void;
  pixData: {
    transactionId: string;   // Antes era paymentId: number
    qrCodeImageUrl: string; // Antes era qrCodeBase64: string
    qrCodeText: string;     // Antes era qrCode: string
  } | null;
}

const PixModal: React.FC<PixModalProps> = ({ isOpen, onClose, pixData }) => {
  const navigate = useNavigate();
  const [isCopied, setIsCopied] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'approved' | 'failed'>('pending');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleCopy = () => {
    if (pixData) {
      navigator.clipboard.writeText(pixData.qrCodeText); // Corrigido para qrCodeText
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };
  
  useEffect(() => {
    const clearPolling = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    // --- LÓGICA DE POLLING ATUALIZADA ---
    if (isOpen && pixData?.transactionId) { // Usa transactionId
      setPaymentStatus('pending');
      
      const checkStatus = async () => {
        try {
          // Chama a nova rota que criamos no backend
          const response = await api.get(`/payments/payment-status/${pixData.transactionId}`);
          if (response.data.status === 'approved') {
            setPaymentStatus('approved');
            clearPolling();
            
            setTimeout(() => {
              onClose();
              navigate('/meu-perfil');
            }, 3000);
          }
        } catch (error) {
          console.error("Erro ao verificar status do pagamento:", error);
        }
      };

      intervalRef.current = setInterval(checkStatus, 5000);
    }

    return () => {
      clearPolling();
    };
  }, [isOpen, pixData, navigate, onClose]);


  if (!isOpen || !pixData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4">
      <div className="bg-card text-white p-8 rounded-lg shadow-xl w-full max-w-md relative text-center">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white" disabled={paymentStatus === 'approved'}>✕</button>
        
        {paymentStatus === 'approved' && (
          <div className="flex flex-col items-center justify-center animate-pulse">
            <CheckCircle className="w-20 h-20 text-green-500 mb-6" />
            <h2 className="text-2xl font-bold mb-3">Pagamento Aprovado!</h2>
            <p className="text-gray-300">Você será redirecionado em breve...</p>
          </div>
        )}

        {paymentStatus === 'pending' && (
          <>
            <h2 className="text-2xl font-bold mb-2">Pague com PIX</h2>
            <p className="text-gray-400 mb-6">Aponte a câmera do seu celular ou use o código abaixo.</p>
            <div className="flex justify-center mb-6">
              {/* --- EXIBIÇÃO DA IMAGEM ATUALIZADA (USA URL) --- */}
              <img src={pixData.qrCodeImageUrl} alt="QR Code PIX" className="rounded-lg border-4 border-white" />
            </div>
            <div className="relative">
              <input
                type="text"
                value={pixData.qrCodeText} // Corrigido para qrCodeText
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