import React, { useState, ReactNode, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import type { UserData } from '../types/types'; 
import api from '../services/api';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserData | null>(null); 
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const verifyAuth = useCallback(async () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // --- ★★★ CORREÇÃO APLICADA AQUI ★★★ ---
        // Trocamos '/auth/me' por '/users/profile'
        // Esta é a rota que agora retorna TODOS os dados (incluindo plano e status)
        const response = await api.get<UserData>('/users/profile'); 
        // --- ★★★ FIM DA CORREÇÃO ★★★ ---
        
        if (response.data) {
          // Se o usuário estiver 'congelado', o frontend deve saber
          if (response.data.status === 'congelado') {
            console.log("Conta congelada. Redirecionando para reativação...");
            // (Futuramente, podemos navegar para uma página 'sua-conta-esta-congelada')
            // Por enquanto, vamos apenas logar o usuário
          }

          setUser(response.data); 
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

  const logout = () => {
    localStorage.removeItem('authToken');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    setIsLoggedIn(false);
    navigate('/entrar', { replace: true });
  };

  return (
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
