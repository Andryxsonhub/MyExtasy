// src/components/registration/ProfileTypeStep.tsx (VERSÃO CENTRALIZADA)

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { User, Users, UserCog } from 'lucide-react';
import type { FormData } from './RegistrationFlow';

interface ProfileTypeStepProps {
  onNext: (data: Partial<FormData>) => void;
}

const options = [
  { id: 'homen', label: 'Solteiro', icon: <User className="w-10 h-10" /> },
  { id: 'mulher', label: 'Solteira', icon: <UserCog className="w-10 h-10" /> },
  { id: 'casal', label: 'Casal', icon: <Users className="w-10 h-10" /> },
];

const ProfileTypeStep: React.FC<ProfileTypeStepProps> = ({ onNext }) => {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (profileType: string) => {
    setSelected(profileType);
  };

  const handleSubmit = () => {
    if (selected) {
      onNext({ profileType: selected });
    }
  };

  return (
    // --- MUDANÇA AQUI: Adicionado 'mx-auto' para centralizar o container ---
    <div className="w-full max-w-lg text-center mx-auto">
      <h2 className="text-3xl font-bold text-white mb-2">Quem é você?</h2>
      <p className="text-gray-400 mb-8">Selecione o tipo de perfil que deseja criar.</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {options.map((option) => (
          <Card
            key={option.id}
            onClick={() => handleSelect(option.id)}
            className={`cursor-pointer transition-all duration-200 ${
              selected === option.id
                ? 'bg-primary border-primary text-white'
                : 'bg-card text-gray-300 hover:bg-card/80'
            }`}
          >
            <CardContent className="flex flex-col items-center justify-center p-6 space-y-2">
              {option.icon}
              <span className="font-semibold">{option.label}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button onClick={handleSubmit} disabled={!selected} size="lg" className="w-full">
        Avançar
      </Button>
    </div>
  );
};

export default ProfileTypeStep;