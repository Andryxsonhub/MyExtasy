// src/App.tsx (VERSÃO FINAL COM ROTA CORRETA)

import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate, useSearchParams } from "react-router-dom";
import React, { useEffect } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthProvider";
import api from './services/api';

import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";

// Páginas
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Explorar from "./pages/Explorar";
import Lives from "./pages/Lives";
import { Loja } from "./pages/Loja";
import Planos from "./pages/Planos";
import Entrar from "./pages/Entrar";
import Sugestoes from "./pages/Sugestoes";
import UserProfilePage from "./pages/UserProfilePage";
import LivePage from './pages/Live';
import Home from "./pages/Home";
import Sobre from './pages/Sobre';

// ALTERAÇÃO 1: Importamos o RegistrationFlow AQUI, que é o lugar certo.
import RegistrationFlow from "./components/registration/RegistrationFlow";
// A página Cadastrar.tsx não será mais usada, mas mantemos o import caso precise no futuro.
import Cadastrar from "./pages/Cadastrar";


const queryClient = new QueryClient();

const GithubCallbackHandler = () => {
  const { setIsLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const authenticateWithCode = async (code: string) => {
      try {
        const response = await api.post('/auth/github/callback', { code });
        const { token } = response.data;
        if (token) {
          localStorage.setItem('authToken', token);
          setIsLoggedIn(true);
          navigate('/home');
        } else {
          throw new Error("Token não recebido do servidor.");
        }
      } catch (error) {
        console.error("Erro durante a autenticação com GitHub:", error);
        navigate('/entrar', { state: { error: 'Falha na autenticação com o GitHub.' } });
      }
    };
    const code = searchParams.get('code');
    if (code) { authenticateWithCode(code); } 
    else { navigate('/entrar', { state: { error: 'Código de autorização do GitHub não encontrado.' } }); }
  }, [navigate, searchParams, setIsLoggedIn]);

  return <div className="flex justify-center items-center h-screen bg-background"><p className="text-white text-xl animate-pulse">Autenticando...</p></div>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/auth/github/callback" element={<GithubCallbackHandler />} />

      {/* --- Rotas Públicas --- */}
      <Route path="/" element={<Index />} />
      <Route path="/loja" element={<Loja />} />
      <Route path="/planos" element={<Planos />} />
      <Route path="/entrar" element={<Entrar />} />
      <Route path="/sobre" element={<Sobre />} />

      {/* ALTERAÇÃO 2: A rota /cadastrar agora leva DIRETAMENTE para o fluxo de 8 passos! */}
      <Route path="/cadastrar" element={<RegistrationFlow />} />

      {/* --- Rotas Protegidas --- */}
      <Route path="/explorar" element={<ProtectedRoute><Explorar /></ProtectedRoute>} />
      <Route path="/lives" element={<ProtectedRoute><Lives /></ProtectedRoute>} />
      
      {/* A MUDANÇA ESTÁ AQUI ABAIXO */}
      <Route path="/live/:id" element={<ProtectedRoute><LivePage /></ProtectedRoute>} />

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
