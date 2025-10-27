import React, { useState } from 'react';
// CORREÇÃO: Importação do Link para resolver o erro ts(2304)
import { Link } from 'react-router-dom'; 
import { Heart, PlayCircle, User } from 'lucide-react';
import type { MediaFeedItem, LikerUser } from '../types/types';
import { getPhotoLikers, getVideoLikers } from '../services/interactionApi';
import LikersModal from './LikersModal';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface ContentCardProps {
  post: MediaFeedItem;
  onLike: (id: number, type: 'photo' | 'video') => void;
}

const ContentCard: React.FC<ContentCardProps> = ({ post, onLike }) => {
  // --- ESTADO PARA O MODAL ---
  const [isLikersModalOpen, setIsLikersModalOpen] = useState(false);
  const [likersList, setLikersList] = useState<LikerUser[] | null>(null);
  const [isLoadingLikers, setIsLoadingLikers] = useState(false);

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onLike(post.id, post.media_type);
  };

  // --- FUNÇÃO PARA ABRIR O MODAL ---
  const handleLikersClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!post.likeCount || post.likeCount <= 0) return; 

    setIsLoadingLikers(true);
    setIsLikersModalOpen(true);
    setLikersList(null); 

    try {
      let likers: LikerUser[];
      if (post.media_type === 'photo') {
        likers = await getPhotoLikers(post.id);
      } else {
        likers = await getVideoLikers(post.id);
      }
      setLikersList(likers);
    } catch (error) {
      console.error("Erro ao buscar likers:", error);
    } finally {
      setIsLoadingLikers(false);
    }
  };

  const closeModal = () => setIsLikersModalOpen(false);

  return (
    <>
      <Link 
        to={`/${post.media_type}/${post.id}`} 
        className="group block rounded-lg overflow-hidden shadow-lg hover:shadow-primary/50 transition-shadow duration-300"
      >
        <div className="relative aspect-square w-full bg-zinc-800">
                
          {/* ======================================================= 
                [MÍDIA e OVERLAY]
            ======================================================= */}
            {post.media_type === 'photo' ? (
                <img 
                    src={post.media_url} 
                    alt={`Mídia de ${post.author.name}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-black/80">
                    <img 
                        src={post.thumbnail_url || post.media_url} 
                        alt={`Thumbnail de ${post.author.name}`}
                        className="w-full h-full object-cover opacity-70"
                    />
                    <PlayCircle size={64} className="absolute text-white/90 group-hover:text-primary transition-colors" />
                </div>
            )}

            {/* ======================================================= 
                [INFORMAÇÕES DO USUÁRIO]
            ======================================================= */}
            <div className="absolute top-2 left-2 z-10 flex items-center gap-2 bg-black bg-opacity-50 rounded-full pr-3 py-1">
                <Avatar className="w-8 h-8">
                    <AvatarImage src={post.author.profilePictureUrl || undefined} alt={post.author.name} /> 
                    <AvatarFallback>
                        <User className="w-4 h-4 text-white" />
                    </AvatarFallback>
                </Avatar>
                <span className="text-sm font-semibold text-white truncate max-w-[100px]">{post.author.name}</span>
            </div>

            {/* --- ÁREA DE LIKE ATUALIZADA --- */}
            <div className="absolute bottom-2 right-2 z-10 flex items-center gap-1.5 bg-black bg-opacity-50 rounded-full p-1.5">
                {/* Botão Ícone Like */}
                <button
                    onClick={handleLikeClick}
                    className={`text-white transition-colors ${post.isLikedByMe ? 'text-red-500' : 'hover:text-gray-300'}`}
                    aria-label="Curtir mídia"
                >
                    <Heart size={18} className={post.isLikedByMe ? "fill-current" : ""} />
                </button>
                {/* Contagem Clicável */}
                <button
                    onClick={handleLikersClick}
                    className={`text-sm font-semibold text-white ${post.likeCount > 0 ? 'cursor-pointer hover:underline' : 'cursor-default'}`}
                    disabled={!post.likeCount || post.likeCount <= 0 || isLoadingLikers}
                    aria-label="Ver quem curtiu"
                >
                    {Number(post.likeCount) || 0}
                </button>
            </div>
            {/* --- FIM DA ÁREA DE LIKE --- */}
        </div>
      </Link>

      {/* Renderiza o Modal */}
      <LikersModal
        isOpen={isLikersModalOpen}
        onClose={closeModal}
        likers={likersList}
        isLoading={isLoadingLikers}
        title={`Curtidas em ${post.media_type === 'photo' ? 'Foto' : 'Vídeo'}`}
      />
    </>
  );
};

export default ContentCard;
