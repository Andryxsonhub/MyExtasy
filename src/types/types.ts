// src/types/types.ts (VERSÃO COMPLETA E CORRIGIDA)

import { ReactNode } from 'react';

// Tipo para as props de rotas protegidas e provedores
export interface ChildrenProps {
  children: ReactNode;
}

// Tipo para o nosso Contexto de Autenticação
export interface AuthContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  isLoading: boolean;
  user: UserData | null;
  setUser: (user: UserData | null) => void;
}

// Interface para um único Post
export interface Post {
  id: number;
  content: string;
  createdAt: string;
}

// Interface para os dados do Usuário (agora realmente completa)
export interface UserData {
  id: number;
  name: string;
  email: string;
  profilePictureUrl: string | null;
  location: string | null;
  gender: string | null;
  createdAt: string;
  lastSeenAt: string | null;
  pimentaBalance?: number;
  
  // --- CAMPOS ADICIONADOS PARA A ABA "SOBRE" ---
  bio: string | null;
  interests: string | null;
  desires: string | null;
  fetishes: string | null;
}