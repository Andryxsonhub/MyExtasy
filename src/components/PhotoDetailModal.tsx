import React, { useState, useEffect } from 'react';
import api from '@/services/api';
import type { Photo } from '../types/types'; // Importa o tipo Photo
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import CommentSection from './CommentSection'; // Importa o novo componente
import { ArrowLeft, X, Heart, MessageCircle } from 'lucide-react';

// O tipo da foto que vem da API (com autor e contagens)
// A API /media/photos/:id retorna 'media_url' e 'content'
type PhotoWithDetails = Omit<Photo, 'url' | 'description'> & {
  media_url: string; // Vem da API
  content: string; // Vem da API
  author: {
    id: number;
    name: string;
    profilePictureUrl: string | null;
  };
  likeCount: number;
  commentCount: number; 
  isLikedByMe: boolean;
};

interface PhotoDetailModalProps {
  photoId: number;
  onClose: () => void;
}

const PhotoDetailModal: React.FC<PhotoDetailModalProps> = ({ photoId, onClose }) => {
  const [photo, setPhoto] = useState<PhotoWithDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Buscar os detalhes da foto (autor, contagem de likes, etc.)
  useEffect(() => {
    if (!photoId) return;
    setIsLoading(true);
    const fetchPhotoDetails = async () => {
      try {
        const response = await api.get<PhotoWithDetails>(`/media/photos/${photoId}`);
        setPhoto(response.data);
      } catch (error) {
        console.error("Erro ao buscar detalhes da foto:", error);
        onClose(); // Fecha o modal se a foto não puder ser carregada
      } finally {
        setIsLoading(false);
      }
    };
    fetchPhotoDetails();
  }, [photoId, onClose]);

  // 2. Renderização (Layout de 2 colunas)
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-gray-900 w-full h-full md:w-[90vw] md:h-[90vh] md:max-w-6xl md:rounded-lg flex flex-col md:flex-row overflow-hidden"
        onClick={(e) => e.stopPropagation()} // Impede de fechar ao clicar no modal
      >
        {/* Coluna 1: A Imagem */}
        <div className="w-full md:w-3/5 h-1/2 md:h-full bg-black flex items-center justify-center">
          {isLoading ? (
            <p className="text-white">Carregando foto...</p>
          ) : (
            <img 
              // =======================================================
              // ▼▼▼ CORREÇÃO (Para bater com a API) ▼▼▼
              src={photo?.media_url} 
              alt={photo?.content || 'Foto'} 
              // ▲▲▲ FIM DA CORREÇÃO ▲▲▲
              // =======================================================
              className="max-w-full max-h-full object-contain"
            />
          )}
        </div>

        {/* Coluna 2: Detalhes e Comentários */}
        <div className="w-full md:w-2/5 h-1/2 md:h-full bg-gray-800 text-white flex flex-col">
          {isLoading || !photo ? (
            <p className="text-white text-center p-4">Carregando...</p>
          ) : (
            <>
              {/* Header (Voltar, Autor) */}
              <div className="p-4 border-b border-gray-700 flex items-center justify-between flex-shrink-0">
                <button onClick={onClose} className="text-gray-300 hover:text-white flex items-center">
                  <ArrowLeft size={20} className="mr-2" /> Voltar
                </button>
                <div className="flex items-center space-x-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={photo.author.profilePictureUrl || undefined} />
                    <AvatarFallback>{photo.author.name[0] || 'A'}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-semibold">{photo.author.name}</span>
                </div>
              </div>

              {/* Detalhes (Descrição, Likes) */}
              <div className="p-4 border-b border-gray-700 flex-shrink-0">
                <p className="text-sm text-gray-300 mb-3">
                  {/* ======================================================= */}
                  {/* ▼▼▼ CORREÇÃO (Para bater com a API) ▼▼▼ */}
                  {photo.content || "Nenhuma descrição para esta foto."}
                  {/* ▲▲▲ FIM DA CORREÇÃO ▲▲▲ */}
                  {/* ======================================================= */}
                </p>
                <div className="flex items-center space-x-4 text-sm">
                  <div className={`flex items-center ${photo.isLikedByMe ? 'text-red-500' : 'text-white'}`}>
                    <Heart size={18} className="mr-1.5" />
                    {photo.likeCount} Curtidas
                  </div>
                  <div className="flex items-center text-gray-300">
                    <MessageCircle size={18} className="mr-1.5" />
                    {photo.commentCount} Comentários
                  </div>
                </div>
              </div>

              {/* Área de Comentários (Onde o "Em desenvolvimento" estava) */}
              {/* Usamos o novo componente aqui */}
              <div className="flex-1 min-h-0">
                <CommentSection photoId={photo.id} />
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Botão de Fechar (para mobile) */}
      <button onClick={onClose} className="absolute top-4 right-4 text-white md:hidden">
        <X size={28} />
      </button>
    </div>
  );
};

export default PhotoDetailModal;