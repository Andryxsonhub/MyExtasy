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
}

// Tipo Post (para posts de texto)
export interface Post { 
    id: number; 
    content: string; 
    createdAt: string; 
    author: { name: string; profilePictureUrl?: string | null; }; 
}

// Tipos Photo e Video (Podem ser removidos se o MediaFeedItem for o único usado, mas mantidos por enquanto)
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

// Tipo MediaFeedItem (CORRIGIDO com thumbnail_url)
export interface MediaFeedItem { 
    id: number; 
    media_type: 'photo' | 'video'; 
    media_url: string; 
    // PROPRIEDADE ADICIONADA:
    thumbnail_url?: string; // Para a imagem de capa de vídeos
    content: string | null; 
    createdAt: string; 
    // Esta é a propriedade que corrigimos no ContentCard (post.author)
    author: { id: number; name: string; profilePictureUrl: string | null; }; 
    likeCount: number; 
    isLikedByMe: boolean; 
}

// --- NOVO TIPO ---
// Para a lista de usuários que curtiram (Likers)
export interface LikerUser {
  id: number;
  name: string;
  profilePictureUrl: string | null;
}
// --- FIM DO NOVO TIPO ---

// Outras interfaces
export interface ChildrenProps { children: ReactNode; }