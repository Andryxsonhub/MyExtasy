// src/components/registration/RegistrationFlow.tsx (VERSÃO FINAL COMPLETA)

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// IMPORTS DE TODOS OS COMPONENTES
import ProfileTypeStep from '@/components/registration/ProfileTypeStep';
import UsernameStep from '@/components/registration/UsernameStep';
import InterestStep from '@/components/registration/InterestStep';
import DesireStep from '@/components/registration/DesireStep';
import FetishStep from '@/components/registration/FetishStep';
import LocationStep from '@/components/registration/LocationStep';
import SuggestionStep from '@/components/registration/SuggestionStep';
import AuthStep from '@/components/registration/AuthStep';

// TIPO DE DADOS ATUALIZADO COM TODOS OS CAMPOS
export type FormData = {
  profileType?: string;
  username?: string;
  email?: string;
  password?: string;
  interests?: string[];
  desires?: string[];
  fetishes?: string[];
  location?: string;
  favoritedSuggestions?: number[];
};

const STEPS_COUNT = 8;

const RegistrationFlow = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({});
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();

  const handleNext = (data: Partial<FormData>) => {
    const updatedData = { ...formData, ...data };
    setFormData(updatedData);
    if (step < STEPS_COUNT) {
        setStep(prev => prev + 1);
    }
  };
  
  const prevStep = () => {
    setError(null);
    if (step > 1) {
        setStep(prev => prev - 1);
    }
  }
  
  // FUNÇÃO DE CONCLUIR O CADASTRO (AGORA COMPLETA)
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
      interests: finalFormData.interests || [],
      desires: finalFormData.desires || [],
      fetishes: finalFormData.fetishes || [],
      location: finalFormData.location || '',
      favoritedSuggestions: finalFormData.favoritedSuggestions || [],
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

  // RENDERIZAÇÃO DAS 8 ETAPAS
  const renderStep = () => {
    switch (step) {
      case 1:
        return <ProfileTypeStep onNext={handleNext} />;
      case 2:
        return <UsernameStep onNext={handleNext} onBack={prevStep} />;
      case 3:
        return <InterestStep onNext={handleNext} onBack={prevStep} />;
      case 4:
        return <DesireStep onNext={handleNext} onBack={prevStep} />;
      case 5:
        return <FetishStep onNext={handleNext} onBack={prevStep} />;
      case 6:
        return <LocationStep onNext={handleNext} onBack={prevStep} />;
      case 7: 
        return <SuggestionStep onNext={handleNext} onBack={prevStep} />;
      case 8:
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