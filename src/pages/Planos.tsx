// src/pages/Planos.tsx
// --- CORREÇÃO FINAL (O map agora passa 'oldPrice' e 'isBlackFriday') ---

import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout'; 
import PricingCard from '@/components/PricingCard'; 
import type { PlanData as PricingCardPlan } from '@/components/PricingCard'; 
import { useNavigate } from 'react-router-dom';
import api from '@/services/api'; 
import { useToast } from '@/components/ui/use-toast'; 
import { Loader2 } from 'lucide-react'; 

// --- ★★★ 1. CORREÇÃO DA INTERFACE ★★★ ---
// Avisa ao TypeScript que a API vai enviar esses campos
interface ApiPlan {
  id: number;
  name: string;
  priceInCents: number;
  features: string[];
  isRecommended: boolean;
  durationInDays: number;
  oldPrice?: string; // <-- ADICIONADO
  isBlackFriday?: boolean; // <-- ADICIONADO
}

type PlanParaPagina = PricingCardPlan & {
  id: number;
};

const Planos: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [plans, setPlans] = useState<PlanParaPagina[]>([]); 
  const [isLoading, setIsLoading] = useState(true); 
  const [isRedirecting, setIsRedirecting] = useState<number | null>(null); // (Correção do spinner)

  useEffect(() => {
    const fetchPlans = async () => {
      setIsLoading(true);
      try {
        // --- ★★★ 2. CORREÇÃO DO CACHE (MODO HARD) ★★★ ---
        // Adiciona um timestamp para forçar o navegador a pegar dados novos
        const response = await api.get(`/payments/subscription-plans?timestamp=${Date.now()}`);
        const apiPlans: ApiPlan[] = response.data;

        // --- ★★★ 3. CORREÇÃO DO MAP ★★★ ---
        // Agora passamos TODOS os dados para o 'formattedPlans'
        const formattedPlans: PlanParaPagina[] = apiPlans.map(apiPlan => ({
          id: apiPlan.id,
          name: apiPlan.name,
          price: (apiPlan.priceInCents / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 }),
          frequency: apiPlan.durationInDays === 7 ? "/semana" :
                     apiPlan.durationInDays === 30 ? "/mês" :
                     apiPlan.durationInDays === 90 ? "/trimestre" : "/ano",
          features: apiPlan.features,
          isRecommended: apiPlan.isRecommended,
          isBlackFriday: apiPlan.isBlackFriday, // <-- ADICIONADO
          oldPrice: apiPlan.oldPrice, // <-- ADICIONADO
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
  }, [toast]);

  const handleSelectPlan = async (plan: PlanParaPagina) => {
    console.log("Plano selecionado:", plan.name, "com ID:", plan.id);
    setIsRedirecting(plan.id); 

    try {
      const response = await api.post('/payments/create-subscription-checkout', { 
        planId: plan.id 
      });

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
      setIsRedirecting(null);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen bg-background">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-background text-white min-h-screen">
        <div className="container mx-auto px-4 py-16 sm:py-24">
          
          {/* Título e Subtítulo */}
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white">
              Escolha o plano ideal para você
section:             </h1>
            <p className="mt-4 text-lg text-gray-400">
              Tenha acesso ilimitado à nossa comunidade e a benefícios exclusivos para apimentar suas experiências.
            </p>
  	     </div>

          {/* Grid dos Planos */}
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <PricingCard 
    	           key={plan.id} 
  	             plan={plan} // (Agora o 'plan' tem 'isBlackFriday' e 'oldPrice')
    	           onSelectPlan={() => handleSelectPlan(plan)} 
  	         	 isRedirecting={isRedirecting === plan.id} 
          	   />
      	     ))}
      	   </div>

  	     </div>
  	   </div>
  	 </Layout>
  );
};

export default Planos;