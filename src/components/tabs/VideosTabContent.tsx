// src/components/tabs/VideosTabContent.tsx (VERIFICAÇÃO FINALÍSSIMA ABSOLUTA)

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, PlayCircle, Trash2, Loader2, Heart } from 'lucide-react';
import { deleteVideo, toggleVideoLike, getVideoLikers } from '../../services/interactionApi'; // Importar getVideoLikers
import type { Video, LikerUser } from '../../types/types'; // Importar LikerUser
import FsLightbox from 'fslightbox-react';
import LikersModal from '../LikersModal'; // Importar o Modal

// Interface com TODAS as props necessárias, incluindo onAddVideoClick
interface VideosTabContentProps {
  videos: Video[];
  onAddVideoClick: () => void; // <-- GARANTIDO QUE ESTÁ AQUI
  isMyProfile: boolean;
  onDeleteSuccess: () => void;
}

// O componente recebe as props
const VideosTabContent: React.FC<VideosTabContentProps> = ({ videos, onAddVideoClick, isMyProfile, onDeleteSuccess }) => {

  const [localVideos, setLocalVideos] = useState<Video[]>(videos);
  const [lightboxController, setLightboxController] = useState({ toggler: false, slide: 1 });
  const [deletingVideoId, setDeletingVideoId] = useState<number | null>(null);
  const [likingVideoId, setLikingVideoId] = useState<number | null>(null);
  const [isLikersModalOpen, setIsLikersModalOpen] = useState(false);
  const [likersList, setLikersList] = useState<LikerUser[] | null>(null);
  const [isLoadingLikers, setIsLoadingLikers] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState<number | null>(null);

  useEffect(() => { setLocalVideos(videos); }, [videos]);

  function openLightboxOnSlide(number: number) { setLightboxController({ toggler: !lightboxController.toggler, slide: number }); }

  const handleDelete = async (videoId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    if (!window.confirm("Tem certeza que deseja apagar este vídeo?")) { return; }
    setDeletingVideoId(videoId);
    try { await deleteVideo(videoId); onDeleteSuccess(); }
    catch (error: unknown) {
        console.error("Erro ao deletar vídeo:", error);
        let msg = 'Tente novamente.';
        if (error instanceof Error) msg = error.message; else if (typeof error === 'string') msg = error;
        alert(`Erro ao apagar vídeo: ${msg}`);
    } finally { setDeletingVideoId(null); }
  };

  const handleLikeClick = async (videoId: number) => {
    if (likingVideoId === videoId) return;
    setLikingVideoId(videoId);
    const videoToUpdate = localVideos.find(v => v.id === videoId);
    const originalIsLiked = videoToUpdate?.isLikedByMe;
    setLocalVideos(prevVideos => prevVideos.map(video => video.id === videoId ? { ...video, isLikedByMe: !video.isLikedByMe } : video ));
    try {
        const responseData = await toggleVideoLike(videoId);
        setLocalVideos(prevVideos => prevVideos.map(video => video.id === videoId ? { ...video, isLikedByMe: responseData.isLikedByMe, likeCount: responseData.likeCount } : video ));
    } catch (error) {
        console.error("Erro ao processar curtida (revertendo):", error); alert("Erro ao processar a curtida.");
        setLocalVideos(prevVideos => prevVideos.map(video => video.id === videoId ? { ...video, isLikedByMe: originalIsLiked ?? false } : video )); // Fallback
    } finally { setLikingVideoId(null); }
  };

  const handleLikersClick = async (e: React.MouseEvent, videoId: number, likeCount: number) => {
    e.stopPropagation(); e.preventDefault(); if (likeCount <= 0) return;
    setSelectedVideoId(videoId); setIsLoadingLikers(true); setIsLikersModalOpen(true); setLikersList(null);
    try { const likers = await getVideoLikers(videoId); setLikersList(likers); }
    catch (error) { console.error("Erro ao buscar likers:", error); }
    finally { setIsLoadingLikers(false); }
  };
  const closeModal = () => setIsLikersModalOpen(false);

  const videoUrls = localVideos.map(video => video.url);

  return (
    <>
        <div>
            {/* Cabeçalho */}
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white">Meus Vídeos</h3>
                {/* Uso da prop 'onAddVideoClick' */}
                {isMyProfile && (
                    <Button onClick={onAddVideoClick}>
                        <PlusCircle className="w-4 h-4 mr-2" /> Adicionar Novo Vídeo
                    </Button>
                )}
            </div>

            {/* Grid ou Mensagem */}
            {localVideos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {localVideos.map((video, i) => (
                        <div key={video.id} className="relative aspect-video bg-black rounded-lg overflow-hidden group" >
                            <div className="w-full h-full cursor-pointer" onClick={() => openLightboxOnSlide(i + 1)} >
                                <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-50 transition-colors z-10"></div>
                                <PlayCircle className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 text-white opacity-70 group-hover:opacity-100 transition-opacity z-20 pointer-events-none" />
                            </div>
                            {isMyProfile && ( <button onClick={(e) => handleDelete(video.id, e)} disabled={deletingVideoId === video.id} className="absolute top-2 right-2 ..." aria-label="Apagar vídeo" > {deletingVideoId === video.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />} </button> )}
                            <div className="absolute bottom-2 left-2 z-30 flex items-center gap-1.5 bg-black bg-opacity-50 rounded-full p-1.5">
                                <button onClick={(e) => { e.stopPropagation(); handleLikeClick(video.id); }} disabled={likingVideoId === video.id} className={`text-white ... ${video.isLikedByMe ? 'text-red-500' : 'hover:text-gray-300'} ...`} > <Heart size={18} className={video.isLikedByMe ? "fill-current" : ""} /> </button>
                                <button onClick={(e) => handleLikersClick(e, video.id, video.likeCount)} className={`text-sm font-semibold text-white ${video.likeCount > 0 ? 'cursor-pointer hover:underline' : 'cursor-default'}`} disabled={!video.likeCount || video.likeCount <= 0 || isLoadingLikers} > {Number(video.likeCount) || 0} </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : ( <div className="text-center text-gray-500 ..."> <p>Nenhum vídeo publicado ainda.</p> </div> )}

            {/* Lightbox */}
            <FsLightbox toggler={lightboxController.toggler} sources={videoUrls} slide={lightboxController.slide} types={new Array(videoUrls.length).fill('video')} />
        </div>

        {/* Modal */}
        <LikersModal isOpen={isLikersModalOpen} onClose={closeModal} likers={likersList} isLoading={isLoadingLikers} title={`Curtidas no Vídeo`} />
    </>
  );
};

export default VideosTabContent;