// src/components/registration/DesireStep.tsx

import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import type { FormData } from './RegistrationFlow';

interface Props {
  onNext: (data: Partial<FormData>) => void;
  onBack: () => void;
}

const desireOptions = [
  { id: 'menage_masculino', label: 'Ménage masculino' },
  { id: 'sexo_a_dois', label: 'Sexo a dois' },
  { id: 'sexo_em_grupo', label: 'Sexo em grupo' },
  { id: 'menage_feminino', label: 'Ménage feminino' },
  { id: 'exibicionismo', label: 'Exibicionismo' },
];

const DesireStep: React.FC<Props> = ({ onNext, onBack }) => {
  const [selectedDesires, setSelectedDesires] = useState<string[]>([]);

  const handleSelect = (id: string) => {
    setSelectedDesires(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };
  
  const handleNextClick = () => {
    onNext({ desires: selectedDesires });
  };

  return (
    <div className="w-full max-w-md mx-auto text-center">
        <button onClick={onBack} className="absolute top-12 left-4 text-white hover:text-gray-300">
            <ArrowLeft size={24} />
        </button>
        <div className="mb-8">
            <p className="text-sm font-semibold text-gray-400 uppercase">A PREPARAR O SEU PERFIL</p>
            <h1 className="text-2xl font-bold text-white mt-1">Você deseja:</h1>
        </div>
        <div className="space-y-4">
            {desireOptions.map((option) => (
            <label key={option.id} className="flex items-center justify-between w-full p-4 bg-gray-800 border-2 border-gray-700 rounded-lg cursor-pointer hover:border-pink-500 transition-colors">
                <span className="font-semibold text-white">{option.label}</span>
                <input
                type="checkbox"
                checked={selectedDesires.includes(option.id)}
                onChange={() => handleSelect(option.id)}
                className="h-6 w-6 rounded text-pink-500 focus:ring-pink-500 border-gray-600 bg-gray-700"
                />
            </label>
            ))}
        </div>
        <div className="mt-8">
            <button onClick={handleNextClick} disabled={selectedDesires.length === 0} className="w-full bg-pink-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 hover:bg-pink-700 disabled:bg-gray-500 disabled:cursor-not-allowed">
            Avançar
            </button>
        </div>
    </div>
  );
};

export default DesireStep;

