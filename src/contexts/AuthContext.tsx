// src/contexts/AuthContext.ts (VERSÃO FINAL UNIFICADA)

import { createContext } from 'react';

// Interface 'User' completa, unindo dados do DB e do login social
export interface User {
  id: number; // Usando 'number' para corresponder ao seu banco de dados (autoincrement)
  name: string;
  email: string;
  bio?: string | null;
  profilePictureUrl?: string | null;
  pimentaBalance: number; // <-- O CAMPO QUE RESOLVE O ERRO
  
  // Campos que podem vir do login social (GitHub, etc.)
  username?: string;
  displayName?: string;
  photos?: Array<{ value: string }>;
  
  // Adicione aqui quaisquer outras propriedades que seu usuário tenha
}

export interface AuthContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  isLoading: boolean;
  user: User | null; 
  setUser: (user: User | null) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);