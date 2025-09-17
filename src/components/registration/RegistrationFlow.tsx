// src/components/registration/RegistrationFlow.tsx (Correção final de tipo)

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import ProfileTypeStep from '@/components/registration/ProfileTypeStep';
import UsernameStep from '@/components/registration/UsernameStep';
import AuthStep from '@/components/registration/AuthStep';
import FetishStep from '@/components/registration/FetishStep';

export type FormData = {
  profileType?: string;
  username?: string;
  email?: string;
  password?: string;
  fetishes?: string[];
};

const STEPS_COUNT = 4;

const RegistrationFlow = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({});
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();

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
    
    if (!finalFormData.profileType || !finalFormData.username || !finalFormData.email || !finalFormData.password) {
      setError("Dados de cadastro incompletos. Por favor, tente novamente do início.");
      setIsLoading(false);
      return;
    }

    const userData = {
      profileType: finalFormData.profileType,
      username: finalFormData.username,
      email: finalFormData.email,
      password: finalFormData.password,
      fetishes: finalFormData.fetishes || [],
    };

    try {
      const response = await axios.post('http://localhost:3001/api/users/register', userData);
      alert('Cadastro concluído com sucesso! Você será redirecionado para a página de login.');
      navigate('/entrar');
    } catch (caughtError: unknown) {
      let errorMessage = "Ocorreu um erro desconhecido. Tente novamente.";
      if (axios.isAxiosError(caughtError)) {
        errorMessage = caughtError.response?.data?.message || "Erro ao conectar com o servidor.";
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <ProfileTypeStep onNext={handleNext} />;
      case 2:
        return <UsernameStep onNext={handleNext} onBack={prevStep} />;
      case 3:
        {/* --- AQUI ESTÁ A CORREÇÃO --- */}
        {/* "Embrulhamos" o handleNext para satisfazer o TypeScript */}
        return <FetishStep onNext={(data) => handleNext(data)} onBack={prevStep} />;
      case 4:
        return <AuthStep onConclude={handleConclude} onBack={prevStep} isLoading={isLoading} apiError={error} />;
      default:
        return <ProfileTypeStep onNext={handleNext} />;
    }
  };

  return (
    <>
      {renderStep()}
      <div className="flex justify-center space-x-2 mt-8">
        {[...Array(STEPS_COUNT).keys()].map((s) => (
          <div
            key={s + 1}
            className={`w-2 h-2 rounded-full transition-colors duration-300 ${step === (s + 1) ? 'bg-primary' : 'bg-gray-300'}`}
          ></div>
        ))}
      </div>
    </>
  );
};

export default RegistrationFlow;