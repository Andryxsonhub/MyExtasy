// src/components/registration/RegistrationFlow.tsx

import React, { useState } from 'react';
import api from '@/services/api'; 
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";

// Imports de todos os componentes de etapa
import ProfileTypeStep from '@/components/registration/ProfileTypeStep';
import UsernameStep from '@/components/registration/UsernameStep';
import InterestStep from '@/components/registration/InterestStep';
import DesireStep from '@/components/registration/DesireStep';
import FetishStep from '@/components/registration/FetishStep';
import LocationStep from '@/components/registration/LocationStep';
import SuggestionStep from '@/components/registration/SuggestionStep';
import AuthStep from '@/components/registration/AuthStep';

// --- ALTERAÇÃO 1: Adicionamos o campo 'name' ao tipo FormData ---
export type FormData = {
  name?: string; // <-- ADICIONADO AQUI
  profileType?: string;
  username?: string;
  dateOfBirth?: Date;
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
  
  const handleConclude = async (authData: Partial<FormData>) => {
    setIsLoading(true);
    setError(null);
    
    // --- ALTERAÇÃO 2: Adicionamos 'name' ao objeto final enviado para a API ---
    const userData = {
      name: formData.name, // <-- ADICIONADO AQUI
      profileType: formData.profileType,
      username: formData.username,
      dateOfBirth: formData.dateOfBirth,
      email: authData.email,
      password: authData.password,
      interests: formData.interests || [],
      desires: formData.desires || [],
      fetishes: formData.fetishes || [],
      location: formData.location || '',
      favoritedSuggestions: formData.favoritedSuggestions || [],
    };
    
    // --- ALTERAÇÃO 3: Adicionamos 'name' à validação ---
    if (!userData.email || !userData.password || !userData.username || !userData.name || !userData.profileType || !userData.dateOfBirth) {
        setError("Dados essenciais (tipo de perfil, nome, nome de usuário, data de nascimento, e-mail ou senha) estão faltando.");
        setIsLoading(false);
        return;
    }

    try {
      await api.post('/register', userData);
      
      toast.success("Sucesso!", {
        description: "Seu cadastro foi realizado perfeitamente.",
      })
      
      setTimeout(() => {
          navigate('/entrar'); 
      }, 2000);

    } catch (caughtError: unknown) {
      let errorMessage = "Ocorreu um erro desconhecido. Tente novamente.";
      if (typeof caughtError === 'object' && caughtError !== null && 'isAxiosError' in caughtError) {
        const axiosError = caughtError as { response?: { data?: { message?: string } } };
        errorMessage = axiosError.response?.data?.message || "Erro ao conectar com o servidor.";
      }
      setError(errorMessage);
    } finally {
      // Garante que o loading para, mesmo que o toast e o redirect aconteçam.
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
      case 8: return <AuthStep onConclude={handleConclude} onBack={prevStep} isLoading={isLoading} apiError={error || ''} successMessage={''} />;
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