// src/components/registration/RegistrationFlow.tsx (VERSÃO FINAL COM CORREÇÃO DE DUPLICATAS)

import React, { useState } from 'react';
import api from '@/services/api'; 
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthProvider';

// IMPORTS DE TODOS OS COMPONENTES DE ETAPA
import ProfileTypeStep from '@/components/registration/ProfileTypeStep';
import UsernameStep from '@/components/registration/UsernameStep';
import InterestStep from '@/components/registration/InterestStep';
import DesireStep from '@/components/registration/DesireStep';
import FetishStep from '@/components/registration/FetishStep';
import LocationStep from '@/components/registration/LocationStep';
import SuggestionStep from '@/components/registration/SuggestionStep';
import AuthStep from '@/components/registration/AuthStep';

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
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { setIsLoggedIn } = useAuth();

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
  
  const handleConclude = async (authData: Partial<FormData>) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    // ================== INÍCIO DA CORREÇÃO ==================
    // Construímos o objeto final de forma explícita para evitar chaves duplicadas.
    const userData = {
      profileType: formData.profileType,
      username: formData.username,
      email: authData.email,
      password: authData.password,
      interests: formData.interests || [],
      desires: formData.desires || [],
      fetishes: formData.fetishes || [],
      location: formData.location || '',
      favoritedSuggestions: formData.favoritedSuggestions || [],
    };

    // Verificação de segurança para garantir que os dados essenciais estão presentes
    if (!userData.email || !userData.password || !userData.username || !userData.profileType) {
        setError("Dados essenciais (tipo de perfil, e-mail, senha ou nome de usuário) estão faltando. Por favor, reinicie o cadastro.");
        setIsLoading(false);
        return;
    }
    // =================== FIM DA CORREÇÃO ===================

    try {
      const response = await api.post('/register', userData);
      
      const { token } = response.data;
      if (token) {
        setSuccessMessage("Cadastro concluído com sucesso! Redirecionando...");
        localStorage.setItem('authToken', token);
        setIsLoggedIn(true); 
        setTimeout(() => {
            navigate('/home'); 
        }, 1500);
      } else {
        setIsLoading(false);
        navigate('/entrar', { state: { message: 'Cadastro concluído! Faça o login para continuar.' } });
      }

    } catch (caughtError: unknown) {
      let errorMessage = "Ocorreu um erro desconhecido. Tente novamente.";
      if (typeof caughtError === 'object' && caughtError !== null && 'isAxiosError' in caughtError) {
        const axiosError = caughtError as { response?: { data?: { message?: string } } };
        errorMessage = axiosError.response?.data?.message || "Erro ao conectar com o servidor.";
      }
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1: return <ProfileTypeStep onNext={handleNext} />;
      case 2: return <UsernameStep onNext={handleNext} onBack={prevStep} />;
      case 3: return <InterestStep onNext={handleNext} onBack={prevStep} />;
      case 4: return <DesireStep onNext={handleNext} onBack={prevStep} />;
      case 5: return <FetishStep onNext={handleNext} onBack={prevStep} />;
      case 6: return <LocationStep onNext={handleNext} onBack={prevStep} />;
      case 7: return <SuggestionStep onNext={handleNext} onBack={prevStep} />;
      case 8: return <AuthStep onConclude={handleConclude} onBack={prevStep} isLoading={isLoading} apiError={error || ''} successMessage={successMessage || ''} />;
      default: return <ProfileTypeStep onNext={handleNext} />;
    }
  };

  return (
    <div className="pt-10">
      {renderStep()}
      <div className="flex justify-center space-x-2 mt-8">
        {[...Array(STEPS_COUNT).keys()].map((s) => (
          <div
            key={s + 1}
            className={`w-2 h-2 rounded-full transition-colors duration-300 ${step === (s + 1) ? 'bg-primary' : 'bg-gray-300'}`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default RegistrationFlow;