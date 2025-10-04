// src/components/registration/UsernameStep.tsx (VERSÃO CORRIGIDA E ATUALIZADA)

import React, { useState } from 'react';
import { Check, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale'; // Para formatar a data e o calendário em português

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import type { FormData } from './RegistrationFlow';

interface Props {
  onNext: (data: Partial<FormData>) => void;
  onBack: () => void;
}

// --- LÓGICA DE VALIDAÇÃO ---
const isUserAdult = (birthDate: Date): boolean => {
  const today = new Date();
  const eighteenYearsAgo = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
  return birthDate <= eighteenYearsAgo;
};

// --- VALOR INICIAL PARA O CALENDÁRIO ---
const initialCalendarDate = new Date();
initialCalendarDate.setFullYear(initialCalendarDate.getFullYear() - 18);


const UsernameStep: React.FC<Props> = ({ onNext, onBack }) => {
  const [username, setUsername] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>();
  const [month, setMonth] = useState<Date>(initialCalendarDate);
  const [isCalendarOpen, setCalendarOpen] = useState(false);


  const isUsernameValid = username.length > 3;
  const isAgeValid = dateOfBirth ? isUserAdult(dateOfBirth) : false;
  const isFormValid = isUsernameValid && isAgeValid;

  const handleNextClick = () => {
    if (!isFormValid) return;
    onNext({ username, dateOfBirth });
  };

  const handleDateSelect = (date: Date | undefined) => {
    setDateOfBirth(date);
    if (date) {
      setMonth(date);
    }
    setCalendarOpen(false);
  };

  return (
    <div className="w-full max-w-md mx-auto text-center">
      <div className="mb-8">
          <p className="text-sm font-semibold text-gray-400 uppercase">A PREPARAR O SEU PERFIL</p>
          <h1 className="text-2xl font-bold text-white mt-1">Seus dados básicos</h1>
          <p className="text-gray-300 mt-2">Como prefere ser chamado e quando você nasceu?</p>
      </div>
      
      {/* CAMPO DE NOME DE USUÁRIO (Existente) */}
      <div className="relative mb-6 text-left">
          <label className="text-sm font-medium text-gray-300 mb-2 block">Nome de usuário</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Digite o seu nome de usuário"
            className="w-full px-4 py-3 bg-gray-800 text-white border-2 border-gray-600 rounded-lg focus:outline-none focus:border-pink-500 transition-colors"
          />
          {isUsernameValid && (
            <Check className="absolute right-4 top-10 -translate-y-1/2 text-green-500" />
          )}
      </div>
      
      {/* CAMPO DE DATA DE NASCIMENTO COM CALENDÁRIO */}
      <div className="relative mb-4 text-left">
         <label className="text-sm font-medium text-gray-300 mb-2 block">Sua data de nascimento</label>
          <Popover open={isCalendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal h-auto py-3 px-4 bg-gray-800 border-2 border-gray-600 hover:bg-gray-700 hover:text-white",
                  !dateOfBirth && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateOfBirth ? format(dateOfBirth, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : <span>Selecione sua data</span>}
              </Button>
            </PopoverTrigger>
            {/* --- CORREÇÃO FINAL: Forçando o calendário a ficar na frente --- */}
            <PopoverContent 
              className="w-auto p-0 z-50" 
              align="start"
              onOpenAutoFocus={(e) => e.preventDefault()}
            >
              <Calendar
                mode="single"
                selected={dateOfBirth}
                onSelect={handleDateSelect}
                month={month}
                onMonthChange={setMonth}
                captionLayout="dropdown-buttons"
                fromYear={1940}
                toYear={new Date().getFullYear()}
                locale={ptBR}
                classNames={{
                  dropdown: "text-black bg-white rounded-md p-1",
                }}
              />
            </PopoverContent>
          </Popover>
          {dateOfBirth && !isAgeValid && (
              <p className="text-red-500 text-sm mt-2 text-center">
                  Você precisa ter pelo menos 18 anos para se cadastrar.
              </p>
          )}
      </div>
      
      <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <button onClick={onBack} className="w-full bg-gray-700 text-white font-bold py-3 px-4 rounded-lg transition-colors hover:bg-gray-600">
              Voltar
          </button>
          <button onClick={handleNextClick} disabled={!isFormValid} className="w-full bg-pink-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 hover:bg-pink-700 disabled:bg-gray-500 disabled:cursor-not-allowed">
              Avançar
          </button>
      </div>
    </div>
  );
};

export default UsernameStep;

