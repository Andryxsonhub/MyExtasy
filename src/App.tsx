// src/App.tsx

import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import { AuthProvider } from "./contexts/AuthProvider";

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
import Home from "./pages/Home"; // 1. IMPORTAMOS A NOVA PÁGINA HOME

const queryClient = new QueryClient();

const AppRoutes = () => {
  return (
    <Routes>
      {/* --- Rotas Públicas --- */}
      <Route path="/" element={<Index />} />
      <Route path="/loja" element={<Loja />} />
      <Route path="/planos" element={<Planos />} />
      <Route path="/cadastrar" element={<Cadastrar />} />
      <Route path="/entrar" element={<Entrar />} />

      {/* --- Rotas Protegidas --- */}
      <Route
        path="/explorar"
        element={<ProtectedRoute><Explorar /></ProtectedRoute>}
      />
      <Route
        path="/lives"
        element={<ProtectedRoute><Lives /></ProtectedRoute>}
      />
      <Route
        path="/sugestoes"
        element={<ProtectedRoute><Sugestoes /></ProtectedRoute>}
      />
      <Route
        path="/dashboard"
        element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
      />
      {/* 2. ADICIONAMOS A NOVA ROTA HOME AQUI */}
      <Route
        path="/home"
        element={<ProtectedRoute><Home /></ProtectedRoute>}
      />
      <Route
        path="/profile/:userId"
        element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>}
      />
      
      {/* Rota para páginas não encontradas */}
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