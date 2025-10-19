// src/components/tabs/VideosTabContent.tsx
// --- CÓDIGO COMPLETO E CORRIGIDO (ESLint no-explicit-any) ---

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, PlayCircle, Trash2, Loader2 } from 'lucide-react';
import { deleteVideo } from '../../services/interactionApi'; // Verifique o caminho
import type { Video } from '../../types/types';

import FsLightbox from 'fslightbox-react';
// Não precisa importar AxiosError aqui se deleteVideo já trata os erros

interface VideosTabContentProps {
  videos: Video[];
  onAddVideoClick: () => void;
  isMyProfile: boolean;
  onDeleteSuccess: () => void;
}

const VideosTabContent: React.FC<VideosTabContentProps> = ({ videos, onAddVideoClick, isMyProfile, onDeleteSuccess }) => {

  const [lightboxController, setLightboxController] = useState({
    toggler: false,
    slide: 1
  });

  const [deletingVideoId, setDeletingVideoId] = useState<number | null>(null);

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
    } catch (error: unknown) { // <-- CORRIGIDO: unknown
        console.error("Erro ao deletar vídeo (componente):", error);

        // --- CORRIGIDO: Verificação de tipo ---
        let alertMessage = 'Tente novamente.';
        if (error instanceof Error) {
            // Pega a mensagem do erro lançado pela função deleteVideo
            alertMessage = error.message;
        } else if (typeof error === 'string') {
             alertMessage = error; // Menos comum, mas possível
        }
        // --- FIM DA CORREÇÃO ---

        alert(`Erro ao apagar vídeo: ${alertMessage}`);
    } finally {
        setDeletingVideoId(null);
    }
  };


  const videoUrls = videos.map(video => video.url);

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

      {videos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {videos.map((video, i) => (
            <div
              key={video.id}
              className="relative aspect-video bg-black rounded-lg overflow-hidden cursor-pointer group"
              onClick={() => openLightboxOnSlide(i + 1)}
            >
              <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-50 transition-colors z-10"></div>
              <PlayCircle className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 text-white opacity-70 group-hover:opacity-100 transition-opacity z-20 pointer-events-none" />

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