// src/contexts/AuthContext.tsx

import { createContext } from 'react';

// A interface que define o formato do nosso contexto
export interface AuthContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  isLoading: boolean;
}

// O contexto em si
export const AuthContext = createContext<AuthContextType | undefined>(undefined);