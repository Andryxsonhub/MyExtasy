// src/components/ProtectedRoute.tsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // 1. Pegamos também o `isLoading` do nosso hook
  const { isLoggedIn, isLoading } = useAuth();

  // 2. Adicionamos a nova verificação de loading
  // Enquanto o AuthProvider estiver verificando o token, exibimos uma mensagem.
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-white">Carregando...</p>
      </div>
    );
  }

  // 3. A verificação antiga agora só roda DEPOIS que o loading termina.
  // Se não está mais carregando E o usuário não está logado, redireciona.
  if (!isLoggedIn) {
    return <Navigate to="/entrar" replace />;
  }

  // Se não está carregando E está logado, renderiza a página.
  return <>{children}</>;
};

export default ProtectedRoute;