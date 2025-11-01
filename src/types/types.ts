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
    visits: number; 
    commentsReceived: number; 
    commentsMade: number; 
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
    // --- ATUALIZADO: pimentaBalance não é mais opcional ---
    pimentaBalance: number; 
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
    // --- NOVOS CAMPOS (do Backend) ---
    tipo_plano: 'gratuito' | 'mensal' | 'anual';
    status: 'ativo' | 'congelado' | 'deletado';
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
}
export interface Video { 
    id: number; 
    url: string; 
    description: string | null; 
    createdAt: string; 
    likeCount: number; 
    isLikedByMe: boolean; 
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
}

// Tipo LikerUser
export interface LikerUser {
  id: number;
  name: string;
  profilePictureUrl: string | null;
}

// --- ★★★ NOVO TIPO (Fase 4 - Chat) ★★★ ---
// Esta interface representa UMA mensagem no chat
export interface Message {
  id: number;
  content: string;
  createdAt: string; // (Vem como string ISO do Prisma)
  read: boolean;
  authorId: number;
  receiverId: number;
  // Inclui os dados do autor (remetente) para exibição
  author: {
    id: number;
    name: string;
    profilePictureUrl: string | null;
  };
}
// --- ★★★ FIM DO NOVO TIPO ★★★ ---

// Outras interfaces
export interface ChildrenProps { children: ReactNode; }

