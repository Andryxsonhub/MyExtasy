// src/components/PricingCard.tsx

import React from 'react';
import { Check } from 'lucide-react';

interface PricingCardProps {
  title: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  buttonText: string;
  isPopular?: boolean;
}

const PricingCard: React.FC<PricingCardProps> = ({
  title,
  price,
  period,
  description,
  features,
  buttonText,
  isPopular = false,
}) => {
  return (
    <div
      className={`relative rounded-lg p-6 text-center border transition-all duration-300 ${
        isPopular ? 'border-primary-foreground scale-105' : 'border-border hover:border-primary'
      }`}
    >
      {isPopular && (
        <span className="absolute top-0 right-0 -mt-3 -mr-3 px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full transform rotate-3">
          Mais Popular
        </span>
      )}
      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      <div className="text-4xl font-bold text-primary mb-2">
        {price}
        <span className="text-base font-normal">{period}</span>
      </div>
      <ul className="text-left my-6 space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center space-x-2 text-foreground">
            <Check className="h-4 w-4 text-primary" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <button className="w-full py-2 px-4 rounded-lg font-semibold transition-colors duration-300 bg-primary text-primary-foreground hover:bg-primary/90">
        {buttonText}
      </button>
    </div>
  );
};

export default PricingCard;