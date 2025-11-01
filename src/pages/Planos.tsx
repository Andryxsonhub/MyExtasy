// src/pages/Planos.tsx
// --- ATUALIZADO (Corrige os caminhos de importação para usar o alias '@/') ---

import React from 'react';
// --- ★★★ CORREÇÃO DO CAMINHO ★★★ ---
import Layout from '@/components/Layout'; 
import PricingCard from '@/components/PricingCard'; 
import type { PlanData } from '@/components/PricingCard'; 
// --- ★★★ FIM DA CORREÇÃO ★★★ ---
import { useNavigate } from 'react-router-dom';

// --- 2. DADOS "HARDCODED" (baseados nos seus screenshots) ---
// (No futuro, isto virá da sua API)
const subscriptionPlans: PlanData[] = [
  {
    name: "Semanal",
    price: "8,90",
    frequency: "/semana",
    features: [
      "Ver perfis completos",
      "Fotos Ilimitadas",
      "Enviar 10 mensagens por dia",
      "Acesso a galerias públicas",
      "Suporte via e-mail"
    ],
  },
  {
    name: "Mensal",
    oldPrice: "39,90",
    price: "9,90",
    frequency: "/mês",
    features: [
      "Todos os benefícios do Bronze",
      "Mensagens ilimitadas",
      "Selo de membro Vip",
      "Ver quem visitou seu perfil",
      "Participar de lives exclusivas"
    ],
    isBlackFriday: true,
    isRecommended: true,
  },
  {
    name: "Anual",
    price: "298,90",
    frequency: "/ano",
    features: [
      "Todos os benefícios do Prata",
      "Destaque nas buscas",
      "Selo de membro Premium",
      "Acesso antecipado a eventos",
      "Suporte prioritário 24/7"
    ],
    
  }
];

const Planos: React.FC = () => {
  const navigate = useNavigate();

  // (No futuro, esta função chamará a API do Mercado Pago)
  const handleSelectPlan = (planName: string) => {
    console.log("Plano selecionado:", planName);
    // (Lógica para o checkout aqui)
    // Ex: navigate('/pagamento/checkout?plano=' + planName);
  };

  return (
    <Layout>
      {/* --- 3. LAYOUT DA PÁGINA (baseado nos screenshots) --- */}
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

          {/* Grid dos Planos */}
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {subscriptionPlans.map((plan) => (
              <PricingCard 
                key={plan.name} 
                plan={plan} 
                onSelectPlan={() => handleSelectPlan(plan.name)}
              />
            ))}
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default Planos;

