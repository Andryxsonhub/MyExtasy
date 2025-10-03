// src/components/registration/AuthStep.tsx (COM BOTÃO VOLTAR)

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import type { FormData } from './RegistrationFlow';
import { Button } from '@/components/ui/button'; // Importando o componente Button

interface Props {
  onConclude: (data: Partial<FormData>) => void;
  onBack: () => void;
  isLoading: boolean;
  apiError: string | null;
  successMessage: string | null;
}

const AuthStep: React.FC<Props> = ({ onConclude, onBack, isLoading, apiError, successMessage }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleConcludeClick = () => {
    onConclude({ email, password });
  };
  
  const isButtonDisabled = !email || password.length < 6 || !agreedToTerms || isLoading;

  return (
    <div className="w-full max-w-md mx-auto text-center">
      {/* --- MUDANÇA 1: O botão de seta foi REMOVIDO daqui --- */}

      <div className="mb-8">
        <p className="text-sm font-semibold text-gray-400 uppercase">A PREPARAR O SEU PERFIL</p>
        <h1 className="text-2xl font-bold text-white mt-1">Só falta o seu email e uma senha</h1>
      </div>
      
      <div className="space-y-4 text-left">
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="seuemail@email.com" 
          className="w-full px-4 py-3 bg-gray-800 text-white border-2 border-gray-600 rounded-lg focus:outline-none focus:border-pink-500"
          disabled={isLoading}
        />
        <div className="relative">
          <input 
            type={showPassword ? 'text' : 'password'} 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Senha (mínimo 6 caracteres)" 
            className="w-full px-4 py-3 bg-gray-800 text-white border-2 border-gray-600 rounded-lg focus:outline-none focus:border-pink-500"
            disabled={isLoading}
          />
          <button 
            onClick={() => setShowPassword(!showPassword)} 
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
            disabled={isLoading}
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>
      </div>

      <div className="flex items-center my-4">
        <div className="flex-grow border-t border-gray-700"></div>
        <span className="flex-shrink mx-4 text-gray-400">OU</span>
        <div className="flex-grow border-t border-gray-700"></div>
      </div>

      <button className="w-full flex items-center justify-center gap-2 bg-white border-2 border-gray-300 text-gray-700 font-bold py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50" disabled={isLoading}>
        <img src="https://www.google.com/favicon.ico" alt="Ícone do Google" className="w-5 h-5"/>
        Continuar com o Google
      </button>
      
      <div className="space-y-4 mt-6 text-left text-sm">
        <label className="flex items-center">
          <input type="checkbox" className="h-5 w-5 rounded text-pink-500 focus:ring-pink-500 bg-gray-700 border-gray-600" disabled={isLoading}/>
          <span className="ml-2 text-gray-300">Quero receber dicas, conteúdos e promoções.</span>
        </label>
        <label className="flex items-center">
          <input 
            type="checkbox" 
            checked={agreedToTerms} 
            onChange={(e) => setAgreedToTerms(e.target.checked)} 
            className="h-5 w-5 rounded text-pink-500 focus:ring-pink-500 bg-gray-700 border-gray-600"
            disabled={isLoading}
          />
          <span className="ml-2 text-gray-300">Eu confirmo ter mais de 18 anos e aceito os <a href="#" className="text-pink-500 underline">Termos de uso</a> e a <a href="#" className="text-pink-500 underline">Política de privacidade</a>.</span>
        </label>
      </div>
      
      <div className="mt-8">
        {/* --- MUDANÇA 2: Adicionado um container flex e o novo botão "Voltar" --- */}
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <Button onClick={onBack} variant="outline" size="lg" className="w-full" disabled={isLoading}>
            Voltar
          </Button>
          <Button
            onClick={handleConcludeClick}
            disabled={isButtonDisabled}
            size="lg"
            className="w-full"
          >
            {isLoading ? 'Aguarde...' : 'Concluir cadastro'}
          </Button>
        </div>
        
        {apiError && !successMessage && (
          <p className="text-red-500 text-sm mt-2">{apiError}</p>
        )}
      </div>
    </div>
  );
};

export default AuthStep;