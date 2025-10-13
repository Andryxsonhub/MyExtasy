// src/contexts/AuthContext.ts (ATUALIZADO)

import { createContext } from 'react';

export interface User {
  id: number;
  name: string;
  email: string;
  bio?: string | null;
  profilePictureUrl?: string | null;
  pimentaBalance: number;
  username?: string;
  displayName?: string;
  photos?: Array<{ value: string }>;
}

export interface AuthContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  isLoading: boolean;
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void; // <-- ADICIONADO AQUI
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);