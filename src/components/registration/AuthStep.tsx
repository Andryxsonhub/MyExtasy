// src/components/registration/AuthStep.tsx

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormData } from './RegistrationFlow';

interface AuthStepProps {
  onConclude: (data: Partial<FormData>) => void;
  onBack: () => void;
  isLoading?: boolean;
  apiError?: string | null;
}

const AuthStep: React.FC<AuthStepProps> = ({ onConclude, onBack, isLoading, apiError }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Estados para guardar as mensagens de erro de validação
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validate = (): boolean => {
    let isValid = true;
    
    // Validação do E-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Por favor, insira um e-mail válido.');
      isValid = false;
    } else {
      setEmailError('');
    }

    // Validação da Senha
    if (password.length < 8) {
      setPasswordError('A senha deve ter no mínimo 8 caracteres.');
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Roda a validação antes de enviar
    if (validate()) {
      onConclude({ email, password });
    }
  };

  return (
    <div className="w-full max-w-lg text-center">
      <h2 className="text-3xl font-bold text-white mb-2">Crie sua Conta</h2>
      <p className="text-gray-400 mb-8">Último passo! Crie seus dados de acesso.</p>
      
      {/* Botão do Google (deixamos aqui para o futuro) */}
      {/* ... */}
      
      <form onSubmit={handleSubmit} className="space-y-6 text-left">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-300">E-mail</Label>
          <Input id="email" type="email" placeholder="seuemail@exemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-input" />
          {/* Exibe a mensagem de erro do e-mail */}
          {emailError && <p className="text-sm text-red-500 mt-1">{emailError}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="text-gray-300">Senha</Label>
          <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required className="bg-input" />
          {/* Exibe a mensagem de erro da senha */}
          {passwordError && <p className="text-sm text-red-500 mt-1">{passwordError}</p>}
        </div>

        {/* Exibe o erro vindo da API (back-end) */}
        {apiError && <p className="text-sm text-red-500 text-center">{apiError}</p>}

        <div className="flex flex-col sm:flex-row gap-4 w-full pt-4">
          <Button onClick={onBack} type="button" variant="outline" size="lg" className="w-full">
            Voltar
          </Button>
          <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
            {isLoading ? "Finalizando..." : "Concluir Cadastro"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AuthStep;