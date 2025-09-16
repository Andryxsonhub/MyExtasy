// src/components/registration/RegistrationFlow.tsx

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // 1. IMPORTAMOS O useNavigate
import InterestStep from '@/components/registration/InterestStep';
import DesireStep from '@/components/registration/DesireStep';
import UsernameStep from '@/components/registration/UsernameStep';
import LocationStep from '@/components/registration/LocationStep';
import AuthStep from '@/components/registration/AuthStep';
import SuggestionStep from '@/components/registration/SuggestionStep';

export type FormData = {
  interests?: string[];
  desires?: string[];
  username?: string;
  location?: string;
  email?: string;
  password?: string;
  favoritedSuggestions?: number[];
};

const RegistrationFlow = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({});
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate(); // 2. INICIAMOS O HOOK

  const handleNext = (data: Partial<FormData>) => {
    const updatedData = { ...formData, ...data };
    setFormData(updatedData);
    setStep(prev => prev + 1);
  };
  
  const prevStep = () => {
    setError(null);
    setStep(prev => prev - 1);
  }
  
  const handleConclude = async (authData: Partial<FormData>) => {
    setIsLoading(true);
    setError(null);
    
    const finalFormData = { ...formData, ...authData };
    
    if (!finalFormData.username || !finalFormData.email || !finalFormData.password) {
      setError("Dados de cadastro incompletos. Por favor, tente novamente do início.");
      setIsLoading(false);
      return;
    }

    const userData = {
      name: finalFormData.username,
      email: finalFormData.email,
      password: finalFormData.password,
    };

    try {
      const response = await axios.post('https://myextasyclub-backend.onrender.com/api/register', userData);
      
      console.log('Resposta do servidor:', response.data.message);
      alert('Cadastro concluído com sucesso! Você será redirecionado para a página de login.');
      
      // 3. USAMOS A FUNÇÃO navigate PARA REDIRECIONAR
      navigate('/entrar'); // <-- A MÁGICA ACONTECE AQUI

    } catch (caughtError: unknown) {
      let errorMessage = "Ocorreu um erro desconhecido. Tente novamente.";
      if (axios.isAxiosError(caughtError)) {
        errorMessage = caughtError.response?.data?.message || "Erro ao conectar com o servidor.";
      } else if (caughtError instanceof Error) {
        errorMessage = caughtError.message;
      }
      
      console.error('Erro ao cadastrar:', errorMessage);
      setError(errorMessage);

    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <InterestStep onNext={handleNext} />;
      case 2:
        return <DesireStep onNext={handleNext} onBack={prevStep} />;
      case 3:
        return <UsernameStep onNext={handleNext} onBack={prevStep} />;
      case 4:
        return <LocationStep onNext={handleNext} onBack={prevStep} />;
      case 5:
        return <SuggestionStep onNext={handleNext} onBack={prevStep} />;
      case 6:
        return (
          <AuthStep 
            onConclude={handleConclude} 
            onBack={prevStep} 
            isLoading={isLoading}
            apiError={error}
          />
        );
      default:
        return <InterestStep onNext={handleNext} />;
    }
  };

  const showProgressDots = step <= 6;

  return (
    <>
      {renderStep()}
      {showProgressDots && (
        <div className="flex justify-center space-x-2 mt-8">
            {[1, 2, 3, 4, 5, 6].map((s) => (
            <div
                key={s}
                className={`w-2 h-2 rounded-full transition-colors duration-300 ${step === s ? 'bg-pink-500' : 'bg-gray-300'}`}
            ></div>
            ))}
        </div>
      )}
    </>
  );
};

export default RegistrationFlow;