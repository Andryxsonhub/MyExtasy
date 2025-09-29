// src/contexts/AuthProvider.tsx (VERSÃO CORRIGIDA E ROBUSTA)

import React, { useState, ReactNode, useEffect, useContext, useCallback } from 'react';
import { AuthContext, User } from './AuthContext';
import api from '../services/api'; // Precisamos do 'api' para buscar o usuário

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Usamos useCallback para evitar que a função seja recriada desnecessariamente
  const verifyAuth = useCallback(async () => {
    const token = localStorage.getItem('authToken');

    if (token) {
      try {
        // Passo 1: Informar ao 'api' para usar este token em todas as requisições
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // Passo 2: Buscar os dados do usuário no backend para confirmar que o token é válido
        const response = await api.get('/auth/me'); // Crie esta rota no seu backend
        
        if (response.data) {
          // Passo 3: Se tudo deu certo, atualizamos o estado DE UMA VEZ
          setUser(response.data);
          setIsLoggedIn(true);
        } else {
          // Se não houver dados, o token é inválido
          throw new Error("Token inválido ou sessão expirada.");
        }
      } catch (error) {
        // Se a chamada falhar (token expirado, etc.), limpamos tudo
        console.error("Falha na verificação de autenticação:", error);
        localStorage.removeItem('authToken');
        api.defaults.headers.common['Authorization'] = null;
        setUser(null);
        setIsLoggedIn(false);
      }
    }
    
    // Passo 4: Apenas ao final de TODO o processo, dizemos que o carregamento terminou.
    // Isso garante que o ProtectedRoute nunca tome uma decisão com dados incompletos.
    setIsLoading(false);
  }, []);

  useEffect(() => {
    verifyAuth();
  }, [verifyAuth]);

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