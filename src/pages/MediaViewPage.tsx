import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Loader2, ArrowLeft, Heart, MessageCircle } from 'lucide-react';
import api from '@/services/api';
import { togglePhotoLike, toggleVideoLike } from '@/services/interactionApi';
import type { MediaFeedItem } from '@/types/types';

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
                // Rota unificada para buscar mídia por tipo e ID
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
        const mediaUrl = media.media_url;

        return (
            <div className="bg-black/90 p-4 rounded-xl shadow-2xl flex flex-col lg:flex-row max-w-6xl mx-auto h-[85vh] lg:h-[90vh]">
                
                {/* Visualizador de Mídia (Ocupa a maior parte) */}
                <div className="lg:flex-grow h-1/2 lg:h-full bg-black flex items-center justify-center relative overflow-hidden rounded-lg">
                    {isPhoto ? (
                        <img 
                            src={mediaUrl} 
                            alt={media.content || "Mídia"} 
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
                <div className="lg:w-96 flex flex-col bg-gray-900 lg:ml-4 mt-4 lg:mt-0 rounded-lg">
                    
                    {/* Header: Usuário e Botão Voltar */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-700">
                        <button onClick={() => navigate(-1)} className="text-gray-300 hover:text-primary transition-colors flex items-center">
                            <ArrowLeft size={24} className="mr-2" />
                            <span className="font-semibold text-lg">Voltar</span>
                        </button>
                        <Link to={`/profile/${media.author.id}`} className="flex items-center gap-2">
                            <img src={media.author.profilePictureUrl || undefined} alt={media.author.name} className="w-8 h-8 rounded-full object-cover" />
                            <span className="font-semibold text-white truncate">{media.author.name}</span>
                        </Link>
                    </div>

                    {/* Descrição */}
                    <div className="p-4 border-b border-gray-700">
                        <p className="text-gray-300 whitespace-pre-wrap">{media.content || (isPhoto ? "Nenhuma descrição para esta foto." : "Nenhuma descrição para este vídeo.")}</p>
                    </div>

                    {/* Ações (Likes e Comentários) */}
                    <div className="flex items-center justify-start gap-6 p-4 border-b border-gray-700">
                        {/* Botão de Like */}
                        <button onClick={handleLike} className="flex items-center gap-2 text-sm font-medium transition-colors">
                            <Heart size={20} className={media.isLikedByMe ? "text-red-500 fill-red-500" : "text-gray-400 hover:text-red-400"} />
                            <span className={media.isLikedByMe ? "text-red-400" : "text-gray-400"}>
                                {media.likeCount.toLocaleString('pt-BR')} Curtidas
                            </span>
                        </button>
                        {/* Placeholder Comentários */}
                        <div className="flex items-center gap-2 text-gray-400 text-sm font-medium">
                            <MessageCircle size={20} />
                            <span>0 Comentários</span> {/* Substituir por contagem real */}
                        </div>
                    </div>
                    
                    {/* Placeholder para a seção de Comentários (Scrollable) */}
                    <div className="flex-grow p-4 overflow-y-auto text-gray-400">
                        <p className="text-sm">Área de Comentários em desenvolvimento...</p>
                    </div>
                </div>

            </div>
        );
    };

    return (
        <Layout>
            <div className="bg-background text-white min-h-screen pt-20 flex flex-col items-center justify-center">
                {isLoading && <div className="text-center"><Loader2 className="animate-spin h-10 w-10 text-primary mx-auto mb-4" /><p>Carregando mídia...</p></div>}
                {error && <div className="text-center text-red-500 p-8"><p>{error}</p><button onClick={() => navigate(-1)} className="mt-4 text-primary hover:underline flex items-center mx-auto"><ArrowLeft size={16} className="mr-1" /> Voltar</button></div>}
                {!isLoading && !error && media && renderMedia()}
            </div>
        </Layout>
    );
};

export default MediaViewPage;
