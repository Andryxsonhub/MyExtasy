// src/types/index.ts

import { ReactNode } from 'react';

// Tipo para as props de rotas protegidas e provedores
export interface ChildrenProps {
  children: ReactNode;
}

// Tipo para o nosso Contexto de Autenticação
export interface AuthContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  isLoading: boolean;
}