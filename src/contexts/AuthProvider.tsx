// src/contexts/AuthProvider.tsx

import React, { useState, ReactNode, useEffect, useContext } from 'react';
import { AuthContext, User } from './AuthContext';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [user, setUser] = useState<User | null>(null);
  // O isLoading agora começa como true, forçando a verificação inicial
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Esta função roda uma vez quando o app carrega
    // para verificar se já existe um token de login de uma sessão anterior.
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsLoggedIn(true);
      // No futuro, você faria uma chamada à API aqui para buscar os dados do usuário
      // e então setUser(userData);
    }
    // Independentemente de ter token ou não, a verificação terminou.
    setIsLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, isLoading, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};