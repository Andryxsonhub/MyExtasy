// src/components/PricingCard.tsx
// --- CORRIGIDO (Aceita a prop 'isRedirecting' e mostra o spinner) ---

import React from 'react';
import { Button } from "@/components/ui/button";
// ★★★ 1. Importa o ícone de 'loading' ★★★
import { CheckCircle2, Loader2 } from 'lucide-react'; 

export interface PlanData {
  name: string;
  price: string;
  oldPrice?: string;
  frequency: string;
  features: string[];
  isRecommended?: boolean;
  isBlackFriday?: boolean;
}

interface PricingCardProps {
  plan: PlanData;
  onSelectPlan: () => void;
  // ★★★ 2. "Avisa" ao componente que ele pode receber o 'isRedirecting' ★★★
  isRedirecting?: boolean; 
}

// ★★★ 3. Pega a nova prop 'isRedirecting' ★★★
const PricingCard: React.FC<PricingCardProps> = ({ plan, onSelectPlan, isRedirecting }) => {
  const cardClasses = [
    "bg-card", "p-6", "rounded-lg", "shadow-lg", "flex", "flex-col", "h-full", "border", "relative",
    plan.isRecommended ? "border-primary" : "border-gray-700"
  ].join(" ");

  const buttonVariant = plan.isRecommended ? "default" : "secondary";
  const buttonClasses = plan.isRecommended ? "bg-primary hover:bg-primary/90 text-white" : "bg-gray-600 hover:bg-gray-700 text-white";

  return (
    <div className={cardClasses}>
      {/* --- Tags (Recomendado, BlackFriday) --- */}
      {plan.isRecommended && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
          Recomendado
        </div>
      )}
      {plan.isBlackFriday && (
        <div className="absolute top-0 right-0 overflow-hidden w-24 h-24">
          <div className="absolute top-7 right-[-28px] bg-black text-white text-xs font-bold px-8 py-1 transform rotate-45 z-10">
            BLACKFRIDAY
          </div>
        </div>
      )}
      
      {/* --- Conteúdo do Card --- */}
      <div className="flex-grow">
        <h3 className="text-2xl font-bold text-white text-center mb-4">{plan.name}</h3>
        
        {/* Preços */}
        <div className="text-center mb-6">
          {plan.oldPrice && (
            <span className="text-xl font-medium text-gray-500 line-through">
              R$ {plan.oldPrice}
            </span>
          )}
          <div className="flex items-end justify-center">
            <span className={`text-5xl font-extrabold ${plan.isBlackFriday ? 'text-green-400' : 'text-white'}`}>
              R$ {plan.price}
            </span>
            <span className="text-gray-400 ml-1 mb-1">{plan.frequency}</span>
          </div>
        </div>

        {/* Lista de Benefícios */}
        <ul className="space-y-3">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-center text-gray-300">
              <CheckCircle2 className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* --- ★★★ 4. Botão CORRIGIDO ★★★ --- */}
      <Button 
        onClick={onSelectPlan}
        variant={buttonVariant} 
        className={`w-full mt-8 font-bold py-3 text-base ${buttonClasses}`}
        // Desabilita o botão enquanto está redirecionando
        disabled={isRedirecting} 
      >
        {isRedirecting ? (
          // Mostra o spinner
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          // Mostra o texto normal
          'Escolher Plano'
        )}
      </Button>
    </div>
  );
};

export default PricingCard;