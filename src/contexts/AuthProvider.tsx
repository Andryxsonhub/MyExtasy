// src/contexts/AuthProvider.tsx (VERSÃO FINAL CORRIGIDA)

import React, { useState, ReactNode, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext'; // Importa SÓ o AuthContext
import type { UserData } from '../types/types'; // <-- 1. IMPORTA O TIPO CORRETO
import api from '../services/api';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // 2. USA O TIPO CORRETO (UserData) NO ESTADO
  const [user, setUser] = useState<UserData | null>(null); 
  
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const verifyAuth = useCallback(async () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // 3. Informa ao Axios que a resposta DEVE ser do tipo UserData
        const response = await api.get<UserData>('/auth/me'); 
        
        if (response.data) {
          setUser(response.data); // 'response.data' agora é UserData
          setIsLoggedIn(true);
        } else {
          throw new Error("Token inválido ou sessão expirada.");
        }
      } catch (error) {
        console.error("Falha na verificação de autenticação:", error);
        localStorage.removeItem('authToken');
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
        setIsLoggedIn(false);
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    verifyAuth();
  }, [verifyAuth]);

  // 4. A função de logout que já estava no seu arquivo
  const logout = () => {
    localStorage.removeItem('authToken');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    setIsLoggedIn(false);
    navigate('/entrar', { replace: true });
  };

  return (
    // 5. O 'value' agora bate com o AuthContextType (o 'user' é UserData)
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, isLoading, user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook useAuth (sem alterações)
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};