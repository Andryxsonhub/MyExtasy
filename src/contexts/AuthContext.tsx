// src/contexts/AuthContext.ts

import { createContext } from 'react';

// Adicionamos a propriedade 'photos' que vem do perfil do GitHub
export interface User {
  id: string;
  username: string;
  displayName: string;
  photos?: Array<{ value: string }>; // A foto do perfil vem aqui
}

export interface AuthContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  isLoading: boolean;
  user: User | null; 
  setUser: (user: User | null) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);