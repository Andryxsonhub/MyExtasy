// src/components/registration/AuthStep.tsx

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormData } from './RegistrationFlow';

// A interface volta a esperar 'onConclude'
interface AuthStepProps {
  onConclude: (data: Partial<FormData>) => void;
  onBack: () => void;
  isLoading?: boolean;
  apiError?: string | null;
}

const AuthStep: React.FC<AuthStepProps> = ({ onConclude, onBack, isLoading, apiError }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      // A função agora chama 'onConclude' para finalizar o cadastro
      onConclude({ email, password });
    }
  };

  return (
    <div className="w-full max-w-lg text-center">
      <h2 className="text-3xl font-bold text-white mb-2">Crie sua Conta</h2>
      <p className="text-gray-400 mb-8">Último passo! Crie seus dados de acesso.</p>
      
      <form onSubmit={handleSubmit} className="space-y-6 text-left">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-300">E-mail</Label>
          <Input id="email" type="email" placeholder="seuemail@exemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-input" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="text-gray-300">Senha</Label>
          <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required className="bg-input" />
        </div>

        {apiError && <p className="text-sm text-red-500 text-center">{apiError}</p>}

        <div className="flex flex-col sm:flex-row gap-4 w-full pt-4">
          <Button onClick={onBack} type="button" variant="outline" size="lg" className="w-full">
            Voltar
          </Button>
          {/* O botão agora mostra "Concluir Cadastro" */}
          <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
            {isLoading ? "Finalizando..." : "Concluir Cadastro"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AuthStep;