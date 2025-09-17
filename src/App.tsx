// src/App.tsx

import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import React, { useEffect } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthProvider";
import axios from 'axios';

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
import Dashboard from "./pages/Dashboard";
import Sugestoes from "./pages/Sugestoes";
import UserProfilePage from "./pages/UserProfilePage";
import Home from "./pages/Home";

const queryClient = new QueryClient();

// Componente "Portão de Chegada" para o callback do GitHub
const GithubCallbackHandler = () => {
  const { setIsLoggedIn, setUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyLogin = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/auth/profile', {
          withCredentials: true, 
        });

        if (response.data && response.data.user) {
          setIsLoggedIn(true);
          setUser(response.data.user);
          navigate('/home');
        } else {
          navigate('/entrar');
        }
      } catch (error) {
        console.error("Falha na verificação de autenticação", error);
        navigate('/entrar');
      }
    };

    verifyLogin();
  }, [setIsLoggedIn, setUser, navigate]);

  return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-white text-xl">Autenticando...</p>
    </div>
  );
};


const AppRoutes = () => {
  return (
    <Routes>
      {/* =============================================================== */}
      {/* ================ A ROTA QUE ESTAVA FALTANDO =================== */}
      {/* =============================================================== */}
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
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/profile/:userId" element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>} />
      
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