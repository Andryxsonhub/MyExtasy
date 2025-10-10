// src/components/CreditCardForm.tsx

import React, { useState } from 'react';
import api from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from "sonner";

// Declaração para o TypeScript saber que o objeto PagSeguro existe no 'window'
declare global {
  interface Window {
    PagSeguro: any;
  }
}

interface CreditCardFormProps {
  planId: string;
  productType: 'SUBSCRIPTION' | 'PIMENTA';
  onBack: () => void; // Função para voltar à seleção de planos
}

const CreditCardForm: React.FC<CreditCardFormProps> = ({ planId, productType, onBack }) => {
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState(''); // Formato MM/AA
  const [cardCvv, setCardCvv] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Lembre-se de substituir pela sua Chave Pública real do Sandbox
  const PAGBANK_PUBLIC_KEY = 'PUB7D1531F20A724542858C31E1DE94DD52';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // 1. Validar e formatar os dados do formulário
    const [expMonth, expYear] = cardExpiry.split('/');
    if (!expMonth || !expYear || !PAGBANK_PUBLIC_KEY.startsWith('PUB')) {
      setError('Dados do formulário ou Chave Pública inválidos.');
      setIsLoading(false);
      return;
    }

    // 2. Usar a SDK do PagBank para criptografar o cartão
    const card = window.PagSeguro.encryptCard({
      publicKey: PAGBANK_PUBLIC_KEY,
      holder: cardHolder,
      number: cardNumber.replace(/\s/g, ''), // Remove espaços do número
      expMonth: expMonth,
      expYear: `20${expYear}`, // Converte AA para AAAA
      cvv: cardCvv,
    });

    if (card.hasErrors) {
      const errorMsg = card.errors.map((err: any) => `Erro ${err.code}: ${err.message}`).join('\n');
      setError(errorMsg);
      setIsLoading(false);
      return;
    }

    const encryptedCard = card.encryptedCard;

    // 3. Enviar os dados criptografados para o nosso backend
    try {
      const payload = {
        productId: planId,
        productType: productType,
        method: 'CREDIT_CARD',
        card: {
          encryptedCard: encryptedCard,
          holderName: cardHolder,
        },
      };
      
      const response = await api.post('/payments/create-order', payload);

      if (response.data.charges[0].status === 'PAID') {
        toast.success("Pagamento Aprovado!", {
          description: "Sua compra foi realizada com sucesso.",
        });
        // Você pode adicionar um redirecionamento aqui, se desejar
        setTimeout(() => onBack(), 3000); // Volta para a tela de planos após 3s
      } else {
        const status = response.data.charges[0].status;
        const reason = response.data.charges[0].payment_response.message;
        setError(`Pagamento não aprovado. Status: ${status}. Motivo: ${reason}`);
      }
    } catch (err: any) {
      const apiError = err.response?.data?.details?.error_messages?.[0]?.description || 'Erro ao processar o pagamento.';
      setError(apiError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto text-center border-2 border-pink-500 rounded-lg p-8 bg-zinc-900">
      <h2 className="text-2xl font-bold mb-4 text-white">Pagamento com Cartão</h2>
      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        <div>
          <Label htmlFor="cardHolder" className="text-gray-300">Nome no Cartão</Label>
          <Input id="cardHolder" value={cardHolder} onChange={(e) => setCardHolder(e.target.value)} className="bg-zinc-800 border-gray-600 text-white" required />
        </div>
        <div>
          <Label htmlFor="cardNumber" className="text-gray-300">Número do Cartão</Label>
          <Input id="cardNumber" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} placeholder="0000 0000 0000 0000" className="bg-zinc-800 border-gray-600 text-white" required />
        </div>
        <div className="flex gap-4">
          <div className="w-1/2">
            <Label htmlFor="cardExpiry" className="text-gray-300">Validade (MM/AA)</Label>
            <Input id="cardExpiry" value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} placeholder="MM/AA" className="bg-zinc-800 border-gray-600 text-white" required />
          </div>
          <div className="w-1/2">
            <Label htmlFor="cardCvv" className="text-gray-300">CVV</Label>
            <Input id="cardCvv" value={cardCvv} onChange={(e) => setCardCvv(e.target.value)} placeholder="123" className="bg-zinc-800 border-gray-600 text-white" required />
          </div>
        </div>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <div className="flex gap-4 pt-4">
          <Button type="button" variant="outline" onClick={onBack} disabled={isLoading} className="w-1/2">Voltar</Button>
          <Button type="submit" disabled={isLoading} className="w-1/2 bg-pink-600 hover:bg-pink-700">
            {isLoading ? 'Processando...' : 'Pagar'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreditCardForm;