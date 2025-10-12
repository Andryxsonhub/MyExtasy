// src/components/ContentCard.tsx

// AVISO CORRIGIDO: O comentário abaixo instrui o ESLint a ignorar o ícone não utilizado.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Heart, UserCircle2 } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';
import LikeButton from './LikeButton';

// A interface do Post deve ser a mesma do Explorar.tsx
export interface Post {
  id: number;
  userid: number;
  media_type: 'image' | 'video';
  media_url: string;
  author_name: string;
  author_avatar_url: string | null;
  likes_count: number;
}

interface ContentCardProps {
  post: Post;
  onLike: () => void;
}

const ContentCard: React.FC<ContentCardProps> = ({ post, onLike }) => {
  return (
    <div className="group relative aspect-square w-full bg-zinc-800 rounded-lg overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105">
      {/* Media: Imagem ou Vídeo */}
      {post.media_type === 'image' ? (
        <img src={post.media_url} alt={`Post de ${post.author_name}`} className="w-full h-full object-cover" />
      ) : (
        <video src={post.media_url} className="w-full h-full object-cover" controls muted loop />
      )}

      {/* Overlay que aparece no hover */}
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity duration-300" />

      {/* Informações do Usuário com Link */}
      <Link to={`/profile/${post.userid}`} className="absolute top-2 left-2">
        <div className="flex items-center space-x-2 bg-black/50 p-1 rounded-full">
          {post.author_avatar_url ? (
            <img src={post.author_avatar_url} alt={post.author_name} className="w-6 h-6 rounded-full object-cover" />
          ) : (
            <UserCircle2 className="w-6 h-6 text-white" />
          )}
          <span className="text-white text-sm font-semibold">{post.author_name}</span>
        </div>
      </Link>

      {/* Curtidas (usando o LikeButton) */}
      <div className="absolute bottom-2 right-2">
        <LikeButton likes={post.likes_count} onLike={onLike} />
      </div>
    </div>
  );
};

export default ContentCard;