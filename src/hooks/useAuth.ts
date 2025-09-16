// src/hooks/useAuth.tsx

import { useContext } from 'react';
// Importamos o Context e o seu Tipo do novo arquivo AuthContext
import { AuthContext, AuthContextType } from '../contexts/AuthContext';

export const useAuth = () => {
  const context = useContext<AuthContextType | undefined>(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};