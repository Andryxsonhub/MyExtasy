// src/App.tsx (VERSÃO COMPLETA E CORRIGIDA)

import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate, useSearchParams } from "react-router-dom";
import React, { useEffect } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthProvider";
import api from './services/api'; // ALTERAÇÃO 1: Troca 'axios' por 'api'

import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";

// Importação das páginas
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Explorar from "./pages/Explorar";
import Lives from "./pages/Lives";
import { Loja } from "./pages/Loja";
import Planos from "./pages/Planos";
import Entrar from "./pages/Entrar";
import Cadastrar from "./pages/Cadastrar";
import Sugestoes from "./pages/Sugestoes";
import UserProfilePage from "./pages/UserProfilePage";
import Home from "./pages/Home";

const queryClient = new QueryClient();

// ALTERAÇÃO 2: Componente GithubCallbackHandler completamente reescrito para usar 'api'
const GithubCallbackHandler = () => {
  const { setIsLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const authenticateWithCode = async (code: string) => {
      try {
        // Usa a instância 'api' para enviar o código para o backend
        const response = await api.post('/auth/github/callback', { code });
        
        const { token } = response.data;
        if (token) {
          localStorage.setItem('authToken', token);
          setIsLoggedIn(true);
          navigate('/home'); // Redireciona para a home após o sucesso
        } else {
          throw new Error("Token não recebido do servidor.");
        }
      } catch (error) {
        console.error("Erro durante a autenticação com GitHub:", error);
        // Redireciona para a página de login com uma mensagem de erro
        navigate('/entrar', { state: { error: 'Falha na autenticação com o GitHub.' } });
      }
    };

    const code = searchParams.get('code');
    if (code) {
      authenticateWithCode(code);
    } else {
      // Se não houver código, redireciona para o login
      navigate('/entrar', { state: { error: 'Código de autorização do GitHub não encontrado.' } });
    }
  }, [navigate, searchParams, setIsLoggedIn]);

  return (
    <div className="flex justify-center items-center h-screen bg-background">
      <p className="text-white text-xl animate-pulse">Autenticando com o GitHub...</p>
    </div>
  );
};


const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/auth/github/callback" element={<GithubCallbackHandler />} />

      {/* --- Rotas Públicas --- */}
      <Route path="/" element={<Index />} />
      <Route path="/loja" element={<Loja />} />
      <Route path="/planos" element={<Planos />} />
      <Route path="/cadastrar" element={<Cadastrar />} />
      <Route path="/entrar" element={<Entrar />} />

      {/* --- Rotas Protegidas --- */}
      <Route path="/explorar" element={<ProtectedRoute><Explorar /></ProtectedRoute>} />
      <Route path="/lives" element={<ProtectedRoute><Lives /></ProtectedRoute>} />
      <Route path="/sugestoes" element={<ProtectedRoute><Sugestoes /></ProtectedRoute>} />
      <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      
      <Route path="/profile/:userId" element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>} />
      <Route path="/meu-perfil" element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>} />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Header />
            <main className="pt-16">
              <AppRoutes />
            </main>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;