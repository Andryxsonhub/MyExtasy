// src/components/PricingCard.tsx
// --- NOVO FICHEIRO (Componente para o "Card de Plano") ---

import React from 'react';
import { Button } from "@/components/ui/button"; // (Assumindo que o seu 'Button' está aqui)
import { CheckCircle2 } from 'lucide-react';

// Define a "interface" (o formato) dos dados que o nosso card espera
export interface PlanData {
  name: string;
  price: string;
  oldPrice?: string; // Preço antigo (ex: R$ 39,90)
  frequency: string; // ex: /semana, /mês
  features: string[];
  isRecommended?: boolean; // Para o plano "Anual" (borda rosa)
  isBlackFriday?: boolean; // Para o plano "Mensal" (tag preta)
}

interface PricingCardProps {
  plan: PlanData;
  onSelectPlan: () => void; // Função a ser chamada ao clicar em "Escolher Plano"
}

const PricingCard: React.FC<PricingCardProps> = ({ plan, onSelectPlan }) => {
  // Define as classes (CSS) com base nas props
  const cardClasses = [
    "bg-card", // (Cor de fundo escura do seu print)
    "p-6",
    "rounded-lg",
    "shadow-lg",
    "flex",
    "flex-col",
    "h-full", // Garante que todos os cards tenham a mesma altura
    "border",
    "relative", // Necessário para as tags
    plan.isRecommended ? "border-primary" : "border-gray-700" // Borda rosa se for recomendado
  ].join(" ");

  const buttonVariant = plan.isRecommended ? "default" : "secondary";
  const buttonClasses = plan.isRecommended ? "bg-primary hover:bg-primary/90 text-white" : "bg-gray-600 hover:bg-gray-700 text-white";

  return (
    <div className={cardClasses}>
      {/* --- TAG "RECOMENDADO" (Para o plano Anual) --- */}
      {plan.isRecommended && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
          Recomendado
        </div>
      )}

      {/* --- TAG "BLACKFRIDAY" (Para o plano Mensal) --- */}
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

      {/* Botão (no final) */}
      <Button 
        onClick={onSelectPlan}
        variant={buttonVariant} 
        className={`w-full mt-8 font-bold py-3 text-base ${buttonClasses}`}
      >
        Escolher Plano
      </Button>
    </div>
  );
};

export default PricingCard;
