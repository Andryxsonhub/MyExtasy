// src/pages/ExplorePage.tsx (VERSÃO FINAL LIMPA - Sem console.log)

import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';
import { PlusCircle, Loader2 } from 'lucide-react';
import ContentCard from '../components/ContentCard';
import type { MediaFeedItem } from '../types/types';
import api from '../services/api';
import { togglePhotoLike, toggleVideoLike } from '../services/interactionApi';

// Interface OnlineUser
interface OnlineUser { id: number; name: string; profilePictureUrl: string | null; gender: string | null; }

const ExplorePage: React.FC = () => {
  const [feedMedia, setFeedMedia] = useState<MediaFeedItem[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        setIsLoading(true); setError(null);
        const [feedResponse, onlineUsersResponse] = await Promise.all([
            api.get('/media/feed'), api.get('/users/online') ]);
        setFeedMedia(feedResponse.data);
        setOnlineUsers(onlineUsersResponse.data);
      } catch (err) {
        console.error("Erro ao buscar dados da página:", err);
        setError("Não foi possível carregar o conteúdo.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPageData();
  }, []);

  // Lógica de Like Otimista
  const handleLike = async (mediaId: number, mediaType: 'photo' | 'video') => {
    const originalMedia = [...feedMedia];
    setFeedMedia(prevMedia =>
        prevMedia.map(item =>
            item.id === mediaId && item.media_type === mediaType
                ? { ...item, isLikedByMe: !item.isLikedByMe, likeCount: item.isLikedByMe ? item.likeCount - 1 : item.likeCount + 1, }
                : item
        )
    );
    try {
        if (mediaType === 'photo') { await togglePhotoLike(mediaId); }
        else { await toggleVideoLike(mediaId); }
    } catch (error) {
        console.error("Erro ao processar curtida:", error);
        alert("Erro ao processar curtida. Tente novamente.");
        setFeedMedia(originalMedia);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      {/* Título */}
      <div className="flex justify-between items-center mb-6"> <h1 className="text-3xl font-bold text-white">Explorar Comunidade</h1> </div>

      {/* Seção Online Agora */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Online agora</h2>
          <Link to="/explorar?filter=online" className="text-sm text-primary hover:underline">Ver mais</Link>
        </div>
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {/* Botão Destaque-se */}
          <div className="flex flex-col items-center flex-shrink-0 w-20 text-center">
             <button className="w-16 h-16 rounded-full bg-card border-2 border-dashed border-primary flex items-center justify-center mb-2 hover:bg-primary/20 transition-colors">
               <PlusCircle className="w-8 h-8 text-primary" />
             </button>
             <span className="text-xs text-gray-300 font-medium">Destaque-se</span>
          </div>

          {/* Mensagem se não houver usuários online */}
          {onlineUsers.length === 0 && !isLoading && (
            <div className="flex items-center pl-4">
                 <p className="text-gray-500 text-sm">Ninguém online no momento.</p>
            </div>
          )}

          {/* Mapeamento dos usuários online */}
          {onlineUsers.map((onlineUser: OnlineUser) => ( // Tipagem explícita mantida
              <Link to={`/profile/${onlineUser.id}`} key={onlineUser.id} className="flex flex-col items-center flex-shrink-0 w-20 text-center group">
                <Avatar className="w-16 h-16 mb-2 border-2 border-green-500 transition-transform group-hover:scale-105">
                  <AvatarImage src={onlineUser.profilePictureUrl || undefined} alt={onlineUser.name} />
                  <AvatarFallback>{onlineUser.name?.substring(0, 2).toUpperCase() ?? '??'}</AvatarFallback>
                </Avatar>
                <p className="text-sm font-semibold text-white truncate w-full">{onlineUser.name ?? 'Nome Indisponível'}</p>
                <p className="text-xs text-gray-400">{onlineUser.gender ?? 'Não informado'}</p>
              </Link>
            )
          )}
        </div>
      </div>

      {/* Seção Destaques da Comunidade */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Destaques da Comunidade</h2>
        {isLoading && <div className="text-center py-16"><Loader2 className="mx-auto h-8 w-8 text-primary animate-spin" /></div>}
        {error && <p className="text-red-500 text-center">{error}</p>}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {feedMedia.map((media) => (
              <ContentCard
                key={`${media.media_type}-${media.id}`}
                post={media}
                onLike={handleLike}
              />
            ))}
          </div>
        )}
         {/* Adicionado: Mensagem se o feed estiver vazio */}
         {!isLoading && !error && feedMedia.length === 0 && (
             <p className="text-gray-500 text-center py-10">Nenhuma mídia encontrada nos destaques.</p>
         )}
      </div>
    </div>
  );
};

export default ExplorePage;