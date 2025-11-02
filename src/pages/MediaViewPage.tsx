// src/pages/MediaViewPage.tsx
// --- ARQUIVO "FANTASMA" CORRIGIDO (AGORA TEM COMENTÁRIOS) ---

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Loader2, ArrowLeft, Heart, MessageCircle, PlayCircle } from 'lucide-react';
import api from '@/services/api';
import { togglePhotoLike, toggleVideoLike } from '@/services/interactionApi';
import type { MediaFeedItem } from '@/types/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// --- ★★★ NOVO IMPORT ★★★ ---
import CommentSection from '@/components/CommentSection'; // Importa nosso novo componente

const MediaViewPage: React.FC = () => {
    const { mediaType, id } = useParams<{ mediaType: 'photo' | 'video', id: string }>();
    const navigate = useNavigate();
    const [media, setMedia] = useState<MediaFeedItem | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const mediaId = id ? parseInt(id) : null;

    useEffect(() => {
        if (!mediaId || !mediaType) {
            setError("Mídia não especificada.");
            setIsLoading(false);
            return;
        }

        const fetchMedia = async () => {
            setIsLoading(true);
            try {
                const endpoint = mediaType === 'photo' ? `/media/photos/${mediaId}` : `/media/videos/${mediaId}`;
                const response = await api.get(endpoint);
                setMedia(response.data);
                setError(null);
            } catch (err) {
                console.error("Erro ao buscar mídia:", err);
                setError("Não foi possível carregar esta mídia. Ela pode ter sido removida.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchMedia();
    }, [mediaId, mediaType]);

    // Lógica de Like Otimista
    const handleLike = async () => {
        if (!media) return;

        // Atualização otimista
        const originalMedia = media;
        setMedia(prev => prev ? { 
            ...prev, 
            isLikedByMe: !prev.isLikedByMe, 
            likeCount: prev.isLikedByMe ? prev.likeCount - 1 : prev.likeCount + 1 
        } : null);

        try {
            if (mediaType === 'photo') { await togglePhotoLike(mediaId!); }
            else { await toggleVideoLike(mediaId!); }
        } catch (error) {
            console.error("Erro ao processar curtida:", error);
            alert("Erro ao processar curtida. Tente novamente.");
            setMedia(originalMedia); // Reverte se falhar
        }
    };

    const renderMedia = () => {
        if (!media) return null;

        const isPhoto = media.media_type === 'photo';
        // --- ★★★ CORREÇÃO (media_url e content) ★★★ ---
        // (O backend envia 'media_url' e 'content' nesta rota)
        const mediaUrl = media.media_url;
        const description = media.content;
        // --- ★★★ FIM DA CORREÇÃO ★★★ ---

        return (
            <div className="bg-gray-900 w-full h-full md:w-[90vw] md:h-[90vh] md:max-w-6xl md:rounded-lg flex flex-col md:flex-row overflow-hidden">
                
                {/* Visualizador de Mídia (Ocupa a maior parte) */}
                <div className="w-full md:w-3/5 h-1/2 md:h-full bg-black flex items-center justify-center relative overflow-hidden">
                    {isPhoto ? (
                        <img 
                            src={mediaUrl} 
                            alt={description || "Mídia"} 
                            className="max-w-full max-h-full object-contain" 
                        />
                    ) : (
                        <video 
                            src={mediaUrl} 
                            controls 
                            autoPlay 
                            loop 
                            className="max-w-full max-h-full object-contain" 
                        />
                    )}
                </div>

                {/* Painel de Info e Comentários (Lateral ou Abaixo) */}
                <div className="w-full md:w-2/5 h-1/2 md:h-full bg-gray-800 text-white flex flex-col">
                    
                    {/* Header: Usuário e Botão Voltar */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-700 flex-shrink-0">
                        <button onClick={() => navigate(-1)} className="text-gray-300 hover:text-primary transition-colors flex items-center">
                            <ArrowLeft size={20} className="mr-2" />
                            <span className="font-semibold">Voltar</span>
                        </button>
                        <Link to={`/profile/${media.author.id}`} className="flex items-center gap-2">
                            <Avatar className="w-8 h-8">
                                <AvatarImage src={media.author.profilePictureUrl || undefined} alt={media.author.name} />
                                <AvatarFallback>{media.author.name[0] || 'A'}</AvatarFallback>
                            </Avatar>
                            <span className="font-semibold text-white truncate">{media.author.name}</span>
                        </Link>
                    </div>

                    {/* Descrição */}
                    <div className="p-4 border-b border-gray-700 flex-shrink-0">
                        <p className="text-gray-300 whitespace-pre-wrap text-sm">{description || (isPhoto ? "Nenhuma descrição para esta foto." : "Nenhuma descrição para este vídeo.")}</p>
                    </div>

                    {/* Ações (Likes e Comentários) */}
                    <div className="flex items-center justify-start gap-6 p-4 border-b border-gray-700 flex-shrink-0">
                        {/* Botão de Like */}
                        <button onClick={handleLike} className="flex items-center gap-2 text-sm font-medium transition-colors">
                            <Heart size={20} className={media.isLikedByMe ? "text-red-500 fill-red-500" : "text-gray-400 hover:text-red-400"} />
                            <span className={media.isLikedByMe ? "text-red-400" : "text-gray-400"}>
                                {media.likeCount.toLocaleString('pt-BR')} Curtidas
                            </span>
                        </button>
                        {/* Contagem de Comentários (AGORA É REAL) */}
                        <div className="flex items-center gap-2 text-gray-400 text-sm font-medium">
                            <MessageCircle size={20} />
                            {/* --- ★★★ ATUALIZAÇÃO AQUI ★★★ --- */}
                            <span>{media.commentCount.toLocaleString('pt-BR')} Comentários</span>
                            {/* --- ★★★ FIM DA ATUALIZAÇÃO ★★★ --- */}
                        </div>
                    </div>
                    
                    {/* --- ★★★ GRANDE ATUALIZAÇÃO AQUI ★★★ --- */}
                    {/* Substituímos o "em desenvolvimento..." pelo componente real */}
                    <div className="flex-1 min-h-0">
                        {isPhoto && mediaId ? (
                            <CommentSection photoId={mediaId} />
                        ) : (
                            <div className="p-4 text-center text-gray-500 text-sm">
                                Comentários para vídeos ainda não estão habilitados.
                            </div>
                        )}
                    </div>
                    {/* --- ★★★ FIM DA ATUALIZAÇÃO ★★★ --- */}

                </div>
            </div>
        );
    };

    return (
        <Layout>
            {/* Container principal da página (tela cheia, centralizado) */}
            <div className="bg-background text-white h-[calc(100vh-theme(space.16))] flex flex-col items-center justify-center p-4">
                {isLoading && <div className="text-center"><Loader2 className="animate-spin h-10 w-10 text-primary mx-auto mb-4" /><p>Carregando mídia...</p></div>}
                {error && <div className="text-center text-red-500 p-8"><p>{error}</p><button onClick={() => navigate(-1)} className="mt-4 text-primary hover:underline flex items-center mx-auto"><ArrowLeft size={16} className="mr-1" /> Voltar</button></div>}
                {!isLoading && !error && media && renderMedia()}
            </div>
        </Layout>
    );
};

export default MediaViewPage;
