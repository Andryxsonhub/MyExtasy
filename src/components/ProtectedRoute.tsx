// src/components/ProtectedRoute.tsx

import React from 'react';
import { Navigate } from 'react-router-dom';
// --- AQUI ESTÁ A CORREÇÃO ---
import { useAuth } from '../contexts/AuthProvider'; 

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-white">Carregando...</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    // Agora ele vai ler o isLoggedIn correto e não vai redirecionar se estiver logado.
    return <Navigate to="/entrar" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;