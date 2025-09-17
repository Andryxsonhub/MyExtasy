// src/components/registration/SuggestionStep.tsx

import React, { useState } from 'react';
import { ArrowLeft, Star } from 'lucide-react';
import type { FormData } from './RegistrationFlow';

interface Props {
  onNext: (data: Partial<FormData>) => void;
  onBack: () => void;
}

const mockSuggestions = [
    {id: 1, username: 'sexymachine8', type: 'Solteiro', avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100'},
    {id: 2, username: 'lustfullcasal', type: 'Solteira', avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100'},
    {id: 3, username: 'nacasa_da_pri', type: 'Casal Ele/Ela', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'},
    {id: 4, username: 'casalnordeste45', type: 'Casal Ele/Ela', avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100'},
];


const SuggestionStep: React.FC<Props> = ({ onNext, onBack }) => {
  const [favorited, setFavorited] = useState<number[]>([]);

  const toggleFavorite = (id: number) => {
    setFavorited(prev => prev.includes(id) ? prev.filter(favId => favId !== id) : [...prev, id]);
  };

  const handleNextClick = () => {
    onNext({ favoritedSuggestions: favorited });
  };

  return (
    <div className="w-full max-w-lg mx-auto text-center">
      <button onClick={onBack} className="absolute top-12 left-4 text-white hover:text-gray-300">
        <ArrowLeft size={24} />
      </button>

      <div className="mb-8">
        <p className="text-sm font-semibold text-gray-400 uppercase">A PREPARAR O SEU PERFIL</p>
        <h1 className="text-2xl font-bold text-white mt-1">Conheça novas pessoas!</h1>
        <p className="text-gray-300 mt-2">Com base nas suas preferências, encontrámos os melhores perfis para si:</p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {mockSuggestions.map(user => (
          <div key={user.id} className="bg-gray-800 border-2 border-gray-700 rounded-lg p-4 flex flex-col items-center">
            <img src={user.avatarUrl} alt={user.username} className="w-20 h-20 rounded-full object-cover mb-2"/>
            <p className="font-bold text-white flex items-center gap-1">
                <Star size={16} className="text-yellow-400" fill="currentColor"/> 
                {user.username}
            </p>
            <p className="text-sm text-gray-400 mb-4">{user.type}</p>
            <button 
                onClick={() => toggleFavorite(user.id)}
                className={`w-full py-2 rounded-lg font-semibold transition-colors ${favorited.includes(user.id) ? 'bg-pink-600 text-white' : 'bg-gray-700 text-white border-2 border-gray-600 hover:bg-gray-600'}`}
            >
                {favorited.includes(user.id) ? 'Favoritado' : 'Favoritar'}
            </button>
          </div>
        ))}
      </div>
      
      <div className="mt-8">
        <button
          onClick={handleNextClick}
          className="w-full bg-pink-600 text-white font-bold py-3 px-4 rounded-lg"
        >
          Adicionar e avançar
        </button>
      </div>
    </div>
  );
};

export default SuggestionStep;

