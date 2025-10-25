// src/pages/Planos.tsx
// --- ATUALIZADO PARA BUSCAR PLANOS DA API E USAR MERCADOPAGO ---

import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { CheckCircle2, Loader2 } from 'lucide-react'; // Adicionado Loader2
import { Button } from '@/components/ui/button';
// import CreditCardForm from '@/components/CreditCardForm'; // REMOVIDO - Não precisamos mais
import api from '@/services/api';
import { toast } from 'sonner'; // Para feedback visual

// Interfaces para os tipos de dados (ajustada para corresponder ao backend)
interface Plan {
  id: number; // Agora é number (do DB)
  name: string;
  priceInCents: number;
  durationInDays: number; // Vem do backend agora
  features: string[];
  isRecommended: boolean; // Vem do backend agora
}

const Planos = () => {
  const [plans, setPlans] = useState<Plan[]>([]); // Estado renomeado para 'plans'
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- NOVO ESTADO: para o loading do botão específico ---
  const [isSubscribingId, setIsSubscribingId] = useState<number | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      setIsPageLoading(true);
      setError(null);
      try {
        // --- ALTERADO: Busca da nova rota ---
        const response = await api.get('/payments/subscription-plans');
        setPlans(response.data); // Os dados já vêm formatados do backend
      } catch (err) {
        setError('Não foi possível carregar os planos. Tente recarregar a página.');
        console.error("Erro ao buscar planos:", err);
      } finally {
        setIsPageLoading(false);
      }
    };
    fetchPlans();
  }, []);

  // --- NOVA FUNÇÃO: Chamada ao clicar em "Escolher Plano" ---
  const handleSubscribe = async (planId: number) => {
    setIsSubscribingId(planId); // Mostra o spinner no botão clicado
    try {
      // Chama a nova rota do backend para criar o checkout de assinatura
      const { data } = await api.post('/payments/create-subscription-checkout', { planId });

      if (data && data.checkoutUrl) {
        // Redireciona o usuário para a página de pagamento do MercadoPago
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error('URL de checkout não recebida.');
      }
      // Se redirecionar, o setIsSubscribingId(null) não é necessário aqui
    } catch (err: any) {
      console.error("Erro ao iniciar assinatura:", err);
      toast.error('Ops! Algo deu errado.', {
        description: err?.response?.data?.message || 'Não foi possível iniciar a assinatura. Tente novamente mais tarde.',
      });
      setIsSubscribingId(null); // Para o spinner se der erro
    }
  };


  if (isPageLoading) {
    return (
        <Layout>
            <div className="flex justify-center items-center h-screen bg-background text-white">
                Carregando planos...
            </div>
        </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-background text-white min-h-screen">
        <div className="container mx-auto px-4 py-10 pt-24"> {/* Adicionado padding-top */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-3">
              Escolha o plano ideal para você
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Tenha acesso ilimitado à nossa comunidade e a benefícios exclusivos para apimentar suas experiências.
            </p>
          </div>

          {error && <p className="text-center text-red-500 mb-4">{error}</p>}

          {/* --- Renderiza a lista de planos --- */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative border-2 rounded-lg p-8 flex flex-col text-center transition-transform duration-300 hover:scale-105 ${
                  plan.isRecommended ? 'border-pink-500 bg-zinc-900' : 'border-gray-700'
                }`}
              >
                {plan.isRecommended && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                    Recomendado
                  </div>
                )}
                <h2 className="text-2xl font-bold mb-4">{plan.name}</h2>
                <p className="text-4xl font-bold mb-2">
                  R$ {(plan.priceInCents / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  {/* Ajustar a unidade (mês/trimestre/ano) com base na 'durationInDays' ou 'name' */}
                  <span className="text-lg font-normal text-gray-400">/{plan.durationInDays === 30 ? 'mês' : plan.durationInDays === 90 ? 'trimestre' : 'ano'}</span>
                </p>
                <ul className="text-left my-8 space-y-3 flex-grow">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <CheckCircle2 className="w-5 h-5 text-pink-500 mr-3" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  // --- ALTERADO: Chama handleSubscribe ---
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={isSubscribingId === plan.id} // Desativa o botão se estiver carregando
                  className={`w-full font-bold py-3 px-6 rounded-lg transition-colors duration-300 ${
                    plan.isRecommended
                      ? 'bg-pink-600 text-white hover:bg-pink-700'
                      : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                  } ${isSubscribingId === plan.id ? 'opacity-50 cursor-wait' : ''}`}
                >
                  {/* --- ALTERADO: Mostra loading --- */}
                  {isSubscribingId === plan.id ? (
                    <Loader2 className="animate-spin mr-2 h-5 w-5" />
                  ) : null}
                  Escolher Plano
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Planos;