// src/pages/ExplorePage.tsx (VERSÃO FINAL E LIMPA)

import React, { useState, useEffect } from 'react';
// A importação 'useAuth' foi removida pois não é usada aqui
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';
import { PlusCircle, Loader2 } from 'lucide-react';
import ContentCard, { Post } from '../components/ContentCard'; 
import api from '../services/api';

interface OnlineUser {
    id: number;
    name: string;
    profilePictureUrl: string | null;
    gender: string | null;
}

const ExplorePage: React.FC = () => {
  // A linha 'const { user } = useAuth();' foi removida daqui
  
  const [feedPosts, setFeedPosts] = useState<Post[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [feedResponse, onlineUsersResponse] = await Promise.all([
            api.get('/posts/feed'),
            api.get('/users/online')
        ]);

        setFeedPosts(feedResponse.data);
        setOnlineUsers(onlineUsersResponse.data);

      } catch (err) {
        console.error("Erro ao buscar dados da página:", err);
        setError("Não foi possível carregar o conteúdo. Tente novamente mais tarde.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPageData();
  }, []);

  const handleLike = (postId: number) => {
    console.log(`Curtiu o post ${postId}! (Funcionalidade a ser implementada)`);
  };

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Explorar Comunidade</h1>
      </div>
      
      <div className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Online agora</h2>
          <Link to="/explorar?filter=online" className="text-sm text-primary hover:underline">Ver mais</Link>
        </div>
        <div className="flex space-x-4 overflow-x-auto pb-4">
          <div className="flex flex-col items-center flex-shrink-0 w-20 text-center">
            <button className="w-16 h-16 rounded-full bg-card border-2 border-dashed border-primary flex items-center justify-center mb-2 hover:bg-primary/20 transition-colors">
              <PlusCircle className="w-8 h-8 text-primary" />
            </button>
            <span className="text-xs text-gray-300 font-medium">Destaque-se</span>
          </div>
          
          {onlineUsers.map((onlineUser) => (
            <Link to={`/profile/${onlineUser.id}`} key={onlineUser.id} className="flex flex-col items-center flex-shrink-0 w-20 text-center group">
              <Avatar className="w-16 h-16 mb-2 border-2 border-green-500 transition-transform group-hover:scale-105">
                <AvatarImage src={onlineUser.profilePictureUrl || undefined} alt={onlineUser.name} />
                <AvatarFallback>{onlineUser.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <p className="text-sm font-semibold text-white truncate w-full">{onlineUser.name}</p>
              <p className="text-xs text-gray-400">{onlineUser.gender}</p>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Destaques da Comunidade</h2>
        
        {isLoading && <div className="text-center py-16"><Loader2 className="mx-auto h-8 w-8 text-primary animate-spin" /></div>}
        {error && <p className="text-red-500 text-center">{error}</p>}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {feedPosts.map((post) => (
              <ContentCard
                key={`${post.media_type}-${post.id}`}
                post={post}
                onLike={() => handleLike(post.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;