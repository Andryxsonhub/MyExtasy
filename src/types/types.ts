// src/types/types.ts

import { ReactNode } from 'react';

// Para provedores e rotas protegidas
export interface ChildrenProps {
  children: ReactNode;
}

// Para o Contexto de Autenticação
export interface AuthContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  isLoading: boolean;
  user: UserData | null;
  setUser: (user: UserData | null) => void;
}

// Para as estatísticas do Sidebar
export interface MonthlyStats {
  visits: number;
  commentsReceived: number;
  commentsMade: number;
}

// O tipo principal para os dados do usuário
export interface UserData {
  id: number;
  name: string;
  email: string;
  username: string | null;
  bio: string | null;
  profilePictureUrl: string | null;
  coverPhotoUrl: string | null;
  location: string | null;
  gender: string | null;
  createdAt: string;
  lastSeenAt: string | null;
  pimentaBalance?: number;
  interests: string | null;
  desires: string | null;
  fetishes: string | null;
  certificationLevel?: number;
  monthlyStats?: MonthlyStats;
}

// Para a lista de posts
export interface Post {
  id: number;
  content: string;
  createdAt: string;
  author: {
    name: string;
    profilePictureUrl?: string | null;
  };
}

// Para a galeria de mídia
export interface Photo {
  id: number;
  url: string;
  description: string | null;
  createdAt: string;
}

export interface Video {
  id: number;
  url: string;
  description: string | null;
  createdAt: string;
}