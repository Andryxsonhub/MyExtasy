// src/components/registration/FetishStep.tsx

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

interface FetishStepProps {
  onNext: (data: { fetishes: string[] }) => void;
  onBack: () => void;
}

// Lista de fetiches baseada na sua imagem
const fetishOptions = [
  'Sexo anal', 'Dotado', 'Cuckold', 'Voyerismo', 'Orgia', 'Gang Bang',
  'Sexting', 'Podolatria', 'Inversão', 'Dogging', 'Dupla penetração',
  'Fisting', 'Sexo virtual', 'Dominação', 'Submissão', 'Bondage',
  'Sadismo', 'Masoquismo', 'BBW', 'Pregnofilia', 'Bukkake',
  'Beijo grego', 'Golden shower'
];

const FetishStep: React.FC<FetishStepProps> = ({ onNext, onBack }) => {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleSelection = (fetish: string) => {
    setSelected(prev => 
      prev.includes(fetish) 
        ? prev.filter(f => f !== fetish) // Remove se já estiver selecionado
        : [...prev, fetish] // Adiciona se não estiver
    );
  };

  const handleSubmit = () => {
    onNext({ fetishes: selected });
  };

  return (
    <div className="w-full max-w-2xl text-center">
      <h2 className="text-3xl font-bold text-white mb-2">Com fetiches em:</h2>
      <p className="text-gray-400 mb-8">Selecione um ou mais fetiches que te interessam. Isso ajudará a encontrar pessoas compatíveis.</p>
      
      {/* Grid com os botões de fetiche */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {fetishOptions.map((fetish) => (
          <Button
            key={fetish}
            variant={selected.includes(fetish) ? 'default' : 'outline'}
            onClick={() => toggleSelection(fetish)}
            className="rounded-full"
          >
            {fetish}
          </Button>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full">
        <Button onClick={onBack} variant="outline" size="lg" className="w-full">
          Voltar
        </Button>
        <Button onClick={handleSubmit} size="lg" className="w-full">
          Avançar
        </Button>
      </div>
    </div>
  );
};

export default FetishStep;