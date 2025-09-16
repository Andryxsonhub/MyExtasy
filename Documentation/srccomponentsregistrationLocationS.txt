// src/components/registration/LocationStep.tsx

import React, { useState } from 'react';
import { ArrowLeft, MapPin } from 'lucide-react';
import type { FormData } from './RegistrationFlow';

interface Props {
  onNext: (data: Partial<FormData>) => void;
  onBack: () => void;
}

const LocationStep: React.FC<Props> = ({ onNext, onBack }) => {
  const [location, setLocation] = useState('');

  const handleNextClick = () => {
    onNext({ location });
  };

  return (
    <div className="w-full max-w-md mx-auto text-center">
        <button onClick={onBack} className="absolute top-12 left-4 text-white hover:text-gray-300">
            <ArrowLeft size={24} />
        </button>
        <div className="mb-8">
            <p className="text-sm font-semibold text-gray-400 uppercase">A PREPARAR O SEU PERFIL</p>
            <h1 className="text-2xl font-bold text-white mt-1">Você está em...</h1>
            <p className="text-gray-300 mt-2">Usaremos a sua localidade para sugerir pessoas interessantes na sua região.</p>
        </div>
        <div className="relative mb-4">
            <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Cidade"
            className="w-full px-10 py-3 bg-gray-800 text-white border-2 border-gray-600 rounded-lg focus:outline-none focus:border-pink-500 transition-colors"
            />
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
        <button className="text-pink-500 font-semibold hover:underline">
            Preencher depois
        </button>
        <div className="mt-8">
            <button onClick={handleNextClick} disabled={location.length < 3} className="w-full bg-pink-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 hover:bg-pink-700 disabled:bg-gray-500 disabled:cursor-not-allowed">
            Avançar
            </button>
        </div>
    </div>
  );
};

export default LocationStep;

