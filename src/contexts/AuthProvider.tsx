// src/contexts/AuthProvider.tsx

import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { AuthContext, AuthContextType } from './AuthContext';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // AQUI ESTÁ A MUDANÇA: O estado já começa com o valor correto.
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('authToken'));
  
  // Este estado de loading é ótimo para futuras telas de carregamento.
  const [isLoading, setIsLoading] = useState(true);

  // O useEffect agora só controla o estado de 'carregando'.
  useEffect(() => {
    setIsLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};