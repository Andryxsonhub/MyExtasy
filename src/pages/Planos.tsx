// src/pages/Planos.tsx
// --- CORRIGIDO (Busca planos da API e implementa o handleSelectPlan) ---

import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout'; 
import PricingCard from '@/components/PricingCard'; 
import type { PlanData as PricingCardPlan } from '@/components/PricingCard'; 
import { useNavigate } from 'react-router-dom';
import api from '@/services/api'; // Precisamos da API
import { useToast } from '@/components/ui/use-toast'; // Para mostrar erros
import { Loader2 } from 'lucide-react'; // Para o feedback de loading

// Este é o TIPO que a sua API (backend) envia
// (Ele tem 'id' e 'priceInCents', que são cruciais)
interface ApiPlan {
  id: number;
  name: string;
  priceInCents: number;
  features: string[];
  isRecommended: boolean;
  durationInDays: number;
}

// Este é o TIPO que o seu componente PricingCard espera
// (Ele precisa do 'id' que veio da API)
type PlanParaPagina = PricingCardPlan & {
  id: number;
};

const Planos: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [plans, setPlans] = useState<PlanParaPagina[]>([]); // Estado para os planos da API
  const [isLoading, setIsLoading] = useState(true); // Estado de loading da página
  const [isRedirecting, setIsRedirecting] = useState(false); // Estado de loading do botão

  // 1. BUSCA OS PLANOS DA API QUANDO A PÁGINA CARREGA
  useEffect(() => {
    const fetchPlans = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/payments/subscription-plans');
        const apiPlans: ApiPlan[] = response.data;

        // 2. Transforma os dados da API (ex: priceInCents)
        // para o formato que o PricingCard espera (ex: price: "9,90")
        const formattedPlans: PlanParaPagina[] = apiPlans.map(apiPlan => ({
          id: apiPlan.id,
          name: apiPlan.name,
          price: (apiPlan.priceInCents / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 }),
          frequency: apiPlan.durationInDays === 7 ? "/semana" :
                     apiPlan.durationInDays === 30 ? "/mês" :
                     apiPlan.durationInDays === 90 ? "/trimestre" : "/ano",
          features: apiPlan.features,
          isRecommended: apiPlan.isRecommended,
          // (Campos 'oldPrice' e 'isBlackFriday' não vêm da API, então serão omitidos)
        }));
        
        setPlans(formattedPlans);
      } catch (error) {
        console.error("Erro ao buscar planos:", error);
        toast({
          title: "Erro ao carregar planos",
          description: "Não foi possível buscar os planos. Tente novamente.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlans();
  }, [toast]); // Dependência do toast

  // 3. FUNÇÃO DE COMPRA (AGORA CORRIGIDA)
  const handleSelectPlan = async (plan: PlanParaPagina) => {
    console.log("Plano selecionado:", plan.name, "com ID:", plan.id);
    setIsRedirecting(true); // Ativa o spinner

    try {
      // Chama a API de backend para criar o checkout
      const response = await api.post('/payments/create-subscription-checkout', { 
        planId: plan.id 
      });

      // Se der certo, redireciona o usuário para o MercadoPago
      const checkoutUrl = response.data.checkoutUrl;
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        throw new Error("URL de checkout não recebida.");
      }

    } catch (error: any) {
      console.error("Erro ao criar checkout:", error);
      const errorMsg = error.response?.data?.message || "Não foi possível iniciar o pagamento.";
      toast({
        title: "Erro no Pagamento",
        description: errorMsg,
        variant: "destructive",
      });
      setIsRedirecting(false); // Desativa o spinner se der erro
    }
  };

  // 4. RENDERIZAÇÃO (com loading)
  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen bg-background">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
      </Layout>
    );
  }

  // 5. RENDERIZAÇÃO (com os planos da API)
  return (
    <Layout>
      <div className="bg-background text-white min-h-screen">
        <div className="container mx-auto px-4 py-16 sm:py-24">
          
          {/* Título e Subtítulo */}
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white">
              Escolha o plano ideal para você
            </h1>
            <p className="mt-4 text-lg text-gray-400">
              Tenha acesso ilimitado à nossa comunidade e a benefícios exclusivos para apimentar suas experiências.
            </p>
          </div>

          {/* Grid dos Planos (agora vindo do estado 'plans') */}
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <PricingCard 
                key={plan.id} 
                plan={plan} 
// Passa o objeto 'plan' inteiro, que agora tem o ID
                onSelectPlan={() => handleSelectPlan(plan)} 
                // 'isRedirecting' é uma prop nova que você pode adicionar
                // ao seu PricingCard.tsx para desabilitar o botão
                isRedirecting={isRedirecting} 
              />
            ))}
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default Planos;