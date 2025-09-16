// src/components/registration/UsernameStep.tsx

import React, { useState } from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import type { FormData } from './RegistrationFlow';

interface Props {
  onNext: (data: Partial<FormData>) => void;
  onBack: () => void;
}

const UsernameStep: React.FC<Props> = ({ onNext, onBack }) => {
  const [username, setUsername] = useState('');

  const handleNextClick = () => {
    onNext({ username });
  };

  return (
    <div className="w-full max-w-md mx-auto text-center">
        <button onClick={onBack} className="absolute top-12 left-4 text-white hover:text-gray-300">
            <ArrowLeft size={24} />
        </button>
        <div className="mb-8">
            <p className="text-sm font-semibold text-gray-400 uppercase">A PREPARAR O SEU PERFIL</p>
            <h1 className="text-2xl font-bold text-white mt-1">Como prefere ser chamado?</h1>
            <p className="text-gray-300 mt-2">Preencha um nome que mostre o melhor de você!</p>
        </div>
        <div className="relative mb-4">
            <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Digite o seu nome de usuário"
            className="w-full px-4 py-3 bg-gray-800 text-white border-2 border-gray-600 rounded-lg focus:outline-none focus:border-pink-500 transition-colors"
            />
            {username.length > 3 && (
            <Check className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500" />
            )}
        </div>
        {/* A mensagem "Muito prazer" foi removida para uma interface mais limpa */}
        <div className="mt-8">
            <button onClick={handleNextClick} disabled={username.length <= 3} className="w-full bg-pink-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 hover:bg-pink-700 disabled:bg-gray-500 disabled:cursor-not-allowed">
            Avançar
            </button>
        </div>
    </div>
  );
};

export default UsernameStep;

