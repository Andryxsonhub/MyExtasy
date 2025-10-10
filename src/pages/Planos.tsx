// src/pages/Planos.tsx

import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CreditCardForm from '@/components/CreditCardForm'; // Importamos nosso formulário de cartão
import api from '@/services/api';

// Interfaces para os tipos de dados
interface Plan {
  id: string;
  name: string;
  priceInCents: number;
  durationInDays: number;
  features: string[]; 
  isRecommended: boolean;
}

const Planos = () => {
  const [products, setProducts] = useState<{ plans: Plan[] }>({ plans: [] });
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- NOVO ESTADO: para controlar se devemos mostrar os planos ou o formulário de pagamento ---
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        const enhancedPlans = response.data.plans.map((plan: any) => ({
          ...plan,
          features: plan.id === 'semanal' ? [ 'Ver perfis completos', 'Enviar 3 mensagens por dia', 'Acesso a galerias públicas', 'Suporte via e-mail' ] 
                  : plan.id === 'mensal' ? [ 'Todos os benefícios do Bronze', 'Mensagens ilimitadas', 'Selo de membro Vip', 'Ver quem visitou seu perfil', 'Participar de lives exclusivas' ]
                  : [ 'Todos os benefícios do Prata', 'Destaque nas buscas', 'Selo de membro Premium', 'Acesso antecipado a eventos', 'Suporte prioritário 24/7' ],
          isRecommended: plan.id === 'anual',
        }));
        setProducts({ ...response.data, plans: enhancedPlans });
      } catch (err) {
        setError('Não foi possível carregar os planos. Tente recarregar a página.');
        console.error(err);
      } finally {
        setIsPageLoading(false);
      }
    };
    fetchProducts();
  }, []);

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
        <div className="container mx-auto px-4 py-10">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-3">
              {/* O título muda dependendo do que está na tela */}
              {selectedPlanId ? 'Finalize seu Pagamento' : 'Escolha o plano ideal para você'}
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Tenha acesso ilimitado à nossa comunidade e a benefícios exclusivos para apimentar suas experiências.
            </p>
          </div>

          {error && <p className="text-center text-red-500 mb-4">{error}</p>}

          {/* --- RENDERIZAÇÃO CONDICIONAL --- */}
          {/* Se um plano foi selecionado, mostra o formulário de cartão. Senão, mostra a lista de planos. */}
          {selectedPlanId ? (
            <div className="flex justify-center">
              <CreditCardForm
                planId={selectedPlanId}
                productType="SUBSCRIPTION"
                onBack={() => setSelectedPlanId(null)} // O botão 'Voltar' do form nos traz de volta para a lista
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {products.plans.map((plan) => (
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
                    <span className="text-lg font-normal text-gray-400">/{plan.id === 'semanal' ? 'semana' : plan.id === 'mensal' ? 'mês' : 'ano'}</span>
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
                    onClick={() => setSelectedPlanId(plan.id)} // Ação do botão agora é apenas mostrar o form
                    className={`w-full font-bold py-3 px-6 rounded-lg transition-colors duration-300 ${
                      plan.isRecommended
                        ? 'bg-pink-600 text-white hover:bg-pink-700'
                        : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                    }`}
                  >
                    Escolher Plano
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Planos;