// src/components/registration/InterestStep.tsx

import React, { useState } from 'react';
import type { FormData } from './RegistrationFlow';

interface Props {
  onNext: (data: Partial<FormData>) => void;
}

const interestOptions = [
    { id: 'homem', label: 'Homem', imageUrl: 'https://images.unsplash.com/photo-1581023473111-a75b2a59a7a8?w=500' },
    { id: 'mulher', label: 'Mulher', imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500' },
    { id: 'casal_he', label: 'Casal (Ele/Ela)', imageUrl: 'https://images.unsplash.com/photo-1590422229560-6d4c4b5f9f9e?w=500' },
    { id: 'casal_hh', label: 'Casal (Ele/Ele)', imageUrl: 'https://images.unsplash.com/photo-1542451361-b5c658796114?w=500' },
    { id: 'casal_mm', label: 'Casal (Ela/Ela)', imageUrl: 'https://images.unsplash.com/photo-1526413232644-8a40f03cc03b?w=500' },
    { id: 'transexual', label: 'Transexual', imageUrl: 'https://images.unsplash.com/photo-1620321023374-1a2d14a1a3b1?w=500' },
    { id: 'crossdresser', label: 'Crossdresser (CD)', imageUrl: 'https://images.unsplash.com/photo-1593106578502-27fa83a5c1a1?w=500' },
    { id: 'travesti', label: 'Travesti', imageUrl: 'https://images.unsplash.com/photo-1587844204-624389a3a31c?w=500' },
];


const InterestStep: React.FC<Props> = ({ onNext }) => {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const handleSelect = (id: string) => {
    setSelectedInterests(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const handleNextClick = () => {
    onNext({ interests: selectedInterests });
  };

  return (
    <div className="w-full max-w-lg mx-auto">
        <div className="text-center mb-8">
            <p className="text-sm font-semibold text-gray-400 uppercase">A PREPARAR O SEU PERFIL</p>
            <h1 className="text-2xl font-bold text-white mt-1">Você tem interesse em:</h1>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {interestOptions.map((option) => (
            <div
                key={option.id}
                onClick={() => handleSelect(option.id)}
                className={`relative rounded-lg overflow-hidden cursor-pointer border-4 transition-all duration-300 ${selectedInterests.includes(option.id) ? 'border-pink-500' : 'border-transparent'}`}
            >
                <img src={option.imageUrl} alt={option.label} className="w-full h-40 object-cover" />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end p-2">
                <h3 className="text-white font-bold">{option.label}</h3>
                </div>
                {selectedInterests.includes(option.id) && (
                <div className="absolute top-2 right-2 bg-pink-500 rounded-full w-6 h-6 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                </div>
                )}
            </div>
            ))}
        </div>
        <div className="mt-8">
            <button onClick={handleNextClick} disabled={selectedInterests.length === 0} className="w-full bg-pink-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 hover:bg-pink-700 disabled:bg-gray-500 disabled:cursor-not-allowed">
            Avançar
            </button>
        </div>
    </div>
  );
};

export default InterestStep;

