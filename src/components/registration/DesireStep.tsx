// src/components/registration/DesireStep.tsx

import React, { useState } from 'react';
import type { FormData } from './RegistrationFlow';

interface Props {
  onNext: (data: Partial<FormData>) => void;
  onBack: () => void;
}

const desireOptions = [
  { id: 'menage_masculino_sem_bi', label: 'Ménage Masculino sem bi' },
  { id: 'menage_masculino_com_bi', label: 'Ménage Masculino com bi' },
  { id: 'sexo_casual', label: 'Sexo Casual' },
  { id: 'sexo_a_dois', label: 'Sexo a dois' },
  { id: 'sexo_a_tres', label: 'Sexo a Três' },
  { id: 'sexo_em_grupo', label: 'Sexo em grupo' },
  { id: 'menage_feminino_sem_bi', label: 'Ménage feminino sem bi' },
  { id: 'menage_feminino_com_bi', label: 'Ménage feminino com bi' },
  { id: 'troca_de_casal', label: 'Troca de Casal' },
  { id: 'sexo_no_mesmo_ambiente', label: 'Sexo no mesmo ambiente' },
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
    <div className="w-full max-w-2xl mx-auto text-center">
        {/* ALTERAÇÃO 1: Botão de seta que ficava aqui foi REMOVIDO */}
        <div className="mb-8">
            <p className="text-sm font-semibold text-gray-400 uppercase">A PREPARAR O SEU PERFIL</p>
            <h1 className="text-2xl font-bold text-white mt-1">Você deseja:</h1>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {desireOptions.map((option) => (
            <label key={option.id} className="flex items-center justify-between w-full p-4 bg-gray-800 border-2 border-gray-700 rounded-lg cursor-pointer hover:border-pink-500 transition-colors">
                <span className="font-semibold text-white text-left">{option.label}</span>
                <input
                type="checkbox"
                checked={selectedDesires.includes(option.id)}
                onChange={() => handleSelect(option.id)}
                className="h-6 w-6 rounded text-pink-500 focus:ring-pink-500 border-gray-600 bg-gray-700 flex-shrink-0 ml-4"
                />
            </label>
            ))}
        </div>

        {/* ALTERAÇÃO 2: Adicionado o botão 'Voltar' e o container flex para os dois botões */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button onClick={onBack} className="w-full bg-gray-700 text-white font-bold py-3 px-4 rounded-lg transition-colors hover:bg-gray-600">
                Voltar
            </button>
            <button onClick={handleNextClick} disabled={selectedDesires.length === 0} className="w-full bg-pink-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 hover:bg-pink-700 disabled:bg-gray-500 disabled:cursor-not-allowed">
                Avançar
            </button>
        </div>
    </div>
  );
};

export default DesireStep;