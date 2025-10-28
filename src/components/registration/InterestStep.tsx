import React, { useState } from 'react';
import type { FormData } from './RegistrationFlow';

interface Props {
  onNext: (data: Partial<FormData>) => void;
  onBack: () => void;
}

// CORREÇÃO: Substituindo URLs do Unsplash por placeholders do placehold.co
const interestOptions = [
    { id: 'homem', label: 'Homem', imageUrl: 'https://myextasyclub-14102025.s3.sa-east-1.amazonaws.com/cadastro-interesses/Homem.png' },
    { id: 'mulher', label: 'Mulher', imageUrl: 'https://myextasyclub-14102025.s3.sa-east-1.amazonaws.com/cadastro-interesses/Mulher.png' }, // Mantive a da mulher se estiver boa, senão troque
    { id: 'casal_he', label: 'Casal (Ele/Ela)', imageUrl: 'https://myextasyclub-14102025.s3.sa-east-1.amazonaws.com/cadastro-interesses/Ele-Ela.png' },
    { id: 'casal_hh', label: 'Casal (Ele/Ele)', imageUrl: 'https://myextasyclub-14102025.s3.sa-east-1.amazonaws.com/cadastro-interesses/Ele-Ele.png' },
    { id: 'casal_mm', label: 'Casal (Ela/Ela)', imageUrl: 'https://myextasyclub-14102025.s3.sa-east-1.amazonaws.com/cadastro-interesses/Ela-Ela.png' }, // Mantive esta se estiver boa, senão troque
    { id: 'transexual', label: 'Transexual', imageUrl: 'https://myextasyclub-14102025.s3.sa-east-1.amazonaws.com/cadastro-interesses/Transexual.jfif' },
    { id: 'crossdresser', label: 'Crossdresser (CD)', imageUrl: 'https://myextasyclub-14102025.s3.sa-east-1.amazonaws.com/cadastro-interesses/Crossdresser.jpg' },
    { id: 'travesti', label: 'Travesti', imageUrl: 'https://myextasyclub-14102025.s3.sa-east-1.amazonaws.com/cadastro-interesses/Travesti.png' },
];

const InterestStep: React.FC<Props> = ({ onNext, onBack }) => {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const handleSelect = (id: string) => {
    setSelectedInterests(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const handleNextClick = () => {
    onNext({ interests: selectedInterests });
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4"> {/* Adicionado padding horizontal */}
        <div className="text-center mb-8">
            <p className="text-sm font-semibold text-gray-400 uppercase">A PREPARAR O SEU PERFIL</p>
            <h1 className="text-2xl font-bold text-white mt-1">Você tem interesse em:</h1>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {interestOptions.map((option) => (
            <div
                key={option.id}
                onClick={() => handleSelect(option.id)}
                className={`relative rounded-lg overflow-hidden cursor-pointer border-4 transition-all duration-300 ${selectedInterests.includes(option.id) ? 'border-pink-500 ring-2 ring-pink-500' : 'border-transparent hover:border-gray-500'}`} // Melhor feedback visual
            >
                {/* Adicionado onError para fallback */}
                <img
                    src={option.imageUrl}
                    alt={option.label}
                    className="w-full h-40 object-cover bg-zinc-700" // Adicionado bg-zinc-700 como fallback
                    // Fallback caso a imagem principal falhe
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null; // Previne loop infinito
                        target.src = `https://placehold.co/500x750/1f2937/ffffff?text=${encodeURIComponent(option.label)}`;
                    }}
                 />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end p-2"> {/* Gradiente para melhor legibilidade */}
                    <h3 className="text-white font-bold text-sm">{option.label}</h3> {/* Tamanho de fonte ajustado */}
                </div>
                {selectedInterests.includes(option.id) && (
                <div className="absolute top-2 right-2 bg-pink-500 rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path> {/* Linha mais grossa */}
                    </svg>
                </div>
                )}
            </div>
            ))}
        </div>
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button onClick={onBack} className="w-full bg-gray-700 text-white font-bold py-3 px-4 rounded-lg transition-colors hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500">
                Voltar
            </button>
            <button onClick={handleNextClick} disabled={selectedInterests.length === 0} className="w-full bg-pink-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 hover:bg-pink-700 disabled:bg-gray-500 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-pink-500">
                Avançar
            </button>
        </div>
    </div>
  );
};

export default InterestStep;
