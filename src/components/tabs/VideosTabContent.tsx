// src/components/tabs/VideosTabContent.tsx (VERSÃO FINAL COMPLETA - COM LIKES)

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, PlayCircle, Trash2, Loader2, Heart } from 'lucide-react'; // <-- 1. IMPORTAR O ÍCONE
import { deleteVideo, toggleVideoLike } from '../../services/interactionApi'; // <-- 2. IMPORTAR A FUNÇÃO DA API
import type { Video } from '../../types/types';

import FsLightbox from 'fslightbox-react';

interface VideosTabContentProps {
  videos: Video[];
  onAddVideoClick: () => void;
  isMyProfile: boolean;
  onDeleteSuccess: () => void;
}

const VideosTabContent: React.FC<VideosTabContentProps> = ({ videos, onAddVideoClick, isMyProfile, onDeleteSuccess }) => {

  // 3. ESTADO LOCAL PARA ATUALIZAÇÃO OTIMISTA
  const [localVideos, setLocalVideos] = useState<Video[]>(videos);
  const [lightboxController, setLightboxController] = useState({
    toggler: false,
    slide: 1
  });
  const [deletingVideoId, setDeletingVideoId] = useState<number | null>(null);

  // Sincroniza o estado local se as props mudarem
  useEffect(() => {
    setLocalVideos(videos);
  }, [videos]);

  function openLightboxOnSlide(number: number) {
    setLightboxController({
      toggler: !lightboxController.toggler,
      slide: number
    });
  }

  const handleDelete = async (videoId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    if (!window.confirm("Tem certeza que deseja apagar este vídeo? Esta ação não pode ser desfeita.")) {
        return;
    }
    setDeletingVideoId(videoId);
    try {
        await deleteVideo(videoId);
        onDeleteSuccess(); // Notifica o pai
    } catch (error: unknown) {
        console.error("Erro ao deletar vídeo (componente):", error);
        let alertMessage = 'Tente novamente.';
        if (error instanceof Error) {
            alertMessage = error.message;
        } else if (typeof error === 'string') {
            alertMessage = error;
        }
        alert(`Erro ao apagar vídeo: ${alertMessage}`);
    } finally {
        setDeletingVideoId(null);
    }
  };

  // 4. FUNÇÃO PARA LIDAR COM O CLIQUE DE LIKE
  const handleLikeClick = async (videoId: number) => {
    const originalVideos = [...localVideos];

    // Atualização Otimista
    setLocalVideos(prevVideos =>
        prevVideos.map(video =>
            video.id === videoId
                ? {
                    ...video,
                    isLikedByMe: !video.isLikedByMe,
                    likeCount: video.isLikedByMe
                        ? video.likeCount - 1
                        : video.likeCount + 1,
                  }
                : video
        )
    );

    // Tenta enviar a requisição para o backend
    try {
        await toggleVideoLike(videoId);
    } catch (error) {
        alert("Erro ao processar a curtida. Tente novamente.");
        setLocalVideos(originalVideos); // Reverte
    }
  };

  const videoUrls = localVideos.map(video => video.url); // <-- Usar localVideos

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-white">Meus Vídeos</h3>
        {isMyProfile && (
          <Button onClick={onAddVideoClick}>
            <PlusCircle className="w-4 h-4 mr-2" /> Adicionar Novo Vídeo
          </Button>
        )}
      </div>

      {localVideos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {localVideos.map((video, i) => ( // <-- Usar localVideos
            <div
              key={video.id}
              className="relative aspect-video bg-black rounded-lg overflow-hidden group"
            >
              <div
                className="w-full h-full cursor-pointer"
                onClick={() => openLightboxOnSlide(i + 1)}
              >
                <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-50 transition-colors z-10"></div>
                <PlayCircle className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 text-white opacity-70 group-hover:opacity-100 transition-opacity z-20 pointer-events-none" />
              </div>

              {/* BOTÃO DE DELETAR (só para meu perfil) */}
              {isMyProfile && (
                <button
                  onClick={(e) => handleDelete(video.id, e)}
                  disabled={deletingVideoId === video.id}
                  className="absolute top-2 right-2 p-1.5 bg-red-700 hover:bg-red-600 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity z-30 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Apagar vídeo"
                >
                  {deletingVideoId === video.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              )}

              {/* 5. BOTÃO DE LIKE (para todos) */}
              <button
                  onClick={(e) => { e.stopPropagation(); handleLikeClick(video.id); }}
                  className={`absolute bottom-2 left-2 p-1.5 bg-black bg-opacity-50 rounded-full text-white z-30 flex items-center gap-1.5 transition-all hover:bg-opacity-75
                    ${video.isLikedByMe ? 'text-red-500' : 'text-white'}
                  `}
                  aria-label="Curtir vídeo"
              >
                  <Heart 
                      size={18} 
                      className={video.isLikedByMe ? "fill-current" : ""} 
                  />
                  <span className="text-sm font-semibold">{video.likeCount}</span>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-16 border-2 border-dashed border-gray-700 rounded-lg">
          <p>Nenhum vídeo publicado ainda.</p>
        </div>
      )}

      <FsLightbox
        toggler={lightboxController.toggler}
        sources={videoUrls}
        slide={lightboxController.slide}
        types={new Array(videoUrls.length).fill('video')}
      />
    </div>
  );
};

export default VideosTabContent;