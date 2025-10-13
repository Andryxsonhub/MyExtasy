// src/contexts/AuthProvider.tsx (VERSÃO FINAL COM LOGOUT)

import React, { useState, ReactNode, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. IMPORTANTE: Importe o useNavigate
import { AuthContext, User } from './AuthContext';
import api from '../services/api';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate(); // 2. Inicialize o hook para podermos redirecionar

  const verifyAuth = useCallback(async () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await api.get('/auth/me');
        if (response.data) {
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

  // 3. AQUI ESTÁ A FUNÇÃO DE LOGOUT QUE FALTAVA
  const logout = () => {
    // Limpa o token do armazenamento do navegador
    localStorage.removeItem('authToken');
    // Limpa o cabeçalho de autorização do Axios
    delete api.defaults.headers.common['Authorization'];
    // Reseta os estados de usuário e login
    setUser(null);
    setIsLoggedIn(false);
    // Leva o usuário de volta para a tela de login
   navigate('/entrar', { replace: true }); // <-- Correção aqui
  };

  return (
    // 4. ADICIONE A FUNÇÃO 'logout' AO VALOR DO PROVIDER
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, isLoading, user, setUser, logout }}>
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