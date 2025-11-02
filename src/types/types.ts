import { ReactNode } from 'react';

// Tipos AuthContextType, MonthlyStats, UserData
export interface AuthContextType { 
  isLoggedIn: boolean; 
  setIsLoggedIn: (isLoggedIn: boolean) => void; 
  isLoading: boolean; 
  user: UserData | null; 
  setUser: (user: UserData | null) => void; 
  logout: () => void; 
}
export interface MonthlyStats { 
  visits?: number; // Corrigido para opcional
  commentsReceived?: number; // Corrigido para opcional
  commentsMade?: number; // Corrigido para opcional
  likesReceived: number; 
  followers: number; 
  following?: number; 
}
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
  following?: { followingId: number }[]; 
  blockedUsers?: { blockedUserId: number }[]; 
  likesGiven?: { likedUserId: number }[]; 
  likeCount?: number; 
  isLikedByMe?: boolean; 
  // Novos campos do backend (opcionais)
  tipo_plano?: 'gratuito' | 'mensal' | 'anual';
  status?: 'ativo' | 'congelado' | 'deletado';
}

// Tipo Post (para posts de texto)
export interface Post { 
  id: number; 
  content: string; 
  createdAt: string; 
  author: { name: string; profilePictureUrl?: string | null; }; 
}

// Tipos Photo e Video
export interface Photo { 
  id: number; 
  url: string; 
  description: string | null; 
  createdAt: string; 
  likeCount: number; 
  isLikedByMe: boolean;
  // --- ★★★ ATUALIZAÇÃO AQUI ★★★ ---
  commentCount: number; 
}
export interface Video { 
  id: number; 
  url: string; 
  description: string | null; 
  createdAt: string; 
  likeCount: number; 
  isLikedByMe: boolean;
  // --- ★★★ ATUALIZAÇÃO AQUI ★★★ ---
  commentCount: number;
}

// Tipo MediaFeedItem
export interface MediaFeedItem { 
  id: number; 
  media_type: 'photo' | 'video'; 
  media_url: string; 
  thumbnail_url?: string; 
  content: string | null; 
  createdAt: string; 
  author: { id: number; name: string; profilePictureUrl: string | null; }; 
  likeCount: number; 
  isLikedByMe: boolean; 
  // --- ★★★ ATUALIZAÇÃO AQUI (O erro do seu print) ★★★ ---
  commentCount: number;
}

// Para a lista de usuários que curtiram (Likers)
export interface LikerUser {
  id: number;
  name: string;
  profilePictureUrl: string | null;
}

// --- ★★★ A CORREÇÃO ESTÁ AQUI ★★★ ---
// Interface para o Chat (Fase 3B/4)
export interface Message {
  id: number | string; // <-- CORRIGIDO (aceita 'string' para IDs de socket.io e 'number' para IDs do DB)
  content: string;
  createdAt: string; 
  authorId: number;
  receiverId: number;
  read: boolean;
  isTip?: boolean; // Para marcar se é uma gorjeta
  // O autor da mensagem (para mostrar nome/foto)
  author: {
    id: number;
    name: string;
    profilePictureUrl: string | null;
  };
}

// Interface para Pacotes de Pimenta (Loja)
export interface PimentaPackage {
  id: number;
  name: string;
  pimentaAmount: number;
  priceInCents: number;
}

// Outras interfaces
export interface ChildrenProps { children: ReactNode; }
