import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2, Heart, MessageCircle } from 'lucide-react'; // Importei MessageCircle
import type { Photo } from '../../types/types';
import api from '@/services/api';
import { togglePhotoLike } from '@/services/interactionApi';
// Removemos o FsLightbox e importamos nosso novo modal
// import FsLightbox from 'fslightbox-react'; // <-- REMOVIDO
import PhotoDetailModal from '@/components/PhotoDetailModal'; // <-- IMPORTA O NOVO MODAL

interface PhotosTabContentProps {
    photos: Photo[];
    onAddPhotoClick: () => void;
    isMyProfile: boolean;
    onDeleteSuccess: () => void; 
}

// O tipo Photo do 'types' precisa ter as contagens
type PhotoWithCounts = Photo & {
    likeCount?: number;
    commentCount?: number; // A API vai mandar isso agora
    isLikedByMe?: boolean;
};

const PhotosTabContent: React.FC<PhotosTabContentProps> = ({ photos, onAddPhotoClick, isMyProfile, onDeleteSuccess }) => {
    
    const [localPhotos, setLocalPhotos] = useState<PhotoWithCounts[]>(photos);
    
    // --- LÓGICA DO LIGHTBOX REMOVIDA ---
    // const [lightboxController, setLightboxController] = useState({ toggler: false, slide: 1 });
    
    // +++ NOVA LÓGICA DO MODAL +++
    const [selectedPhotoId, setSelectedPhotoId] = useState<number | null>(null);
    
    const [likingPhotoId, setLikingPhotoId] = useState<number | null>(null);

    useEffect(() => { setLocalPhotos(photos); }, [photos]);

    // +++ NOVA FUNÇÃO PARA ABRIR O MODAL +++
    const openPhotoModal = (photoId: number) => {
        setSelectedPhotoId(photoId);
    };

    const handleDeletePhoto = async (photoId: number) => { 
        // @ts-ignore
        if (!confirm('Tem certeza que deseja apagar esta foto?')) { return; }
        try {
            await api.delete(`/users/photos/${photoId}`); 
            // @ts-ignore
            alert('Foto apagada com sucesso!');
            onDeleteSuccess(); 
        } catch (error) {
            console.error('Erro ao apagar a foto:', error);
            // @ts-ignore
            alert('Não foi possível apagar a foto.');
        }
    };

    const handleLikeClick = async (photoId: number) => {
        if (likingPhotoId === photoId) return; 
        setLikingPhotoId(photoId); 
        const photoToUpdate = localPhotos.find(p => p.id === photoId);
        const originalIsLiked = photoToUpdate?.isLikedByMe; 
        
        // Atualização Otimista
        setLocalPhotos(prevPhotos =>
            prevPhotos.map(photo =>
                photo.id === photoId ? { 
                    ...photo, 
                    isLikedByMe: !photo.isLikedByMe,
                    likeCount: (photo.likeCount ?? 0) + (!photo.isLikedByMe ? 1 : -1) 
                } : photo
            )
        );
        
        try { 
            const responseData = await togglePhotoLike(photoId); 
            // Sincroniza com a resposta final da API
            setLocalPhotos(prevPhotos =>
                prevPhotos.map(photo =>
                    photo.id === photoId ? { ...photo, isLikedByMe: responseData.isLikedByMe, likeCount: responseData.likeCount } : photo
                )
            );
        } catch (error) { 
            console.error("Erro ao processar curtida (revertendo):", error); 
            // @ts-ignore
            alert("Erro ao processar a curtida."); 
            // Reverte a atualização otimista
            setLocalPhotos(prevPhotos =>
                prevPhotos.map(photo =>
                    photo.id === photoId ? { 
                        ...photo, 
                        isLikedByMe: originalIsLiked ?? false,
                        likeCount: (photo.likeCount ?? 0) + (originalIsLiked ? 1 : -1) 
                    } : photo
                )
            ); 
        } finally { 
            setLikingPhotoId(null); 
        }
    };

    return (
        <div>
            {/* Cabeçalho */}
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white">Minhas Fotos</h3>
                {isMyProfile && (
                    <Button onClick={onAddPhotoClick}> 
                        <PlusCircle className="w-4 h-4 mr-2" /> Adicionar Nova Foto
                    </Button>
                )}
            </div>
            
            {/* Grid ou Mensagem */}
            {localPhotos.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {localPhotos.map((photo, i) => ( 
                        <div key={photo.id} className="relative aspect-square bg-gray-800 rounded-lg overflow-hidden group">
                            
                            {/* ATUALIZADO o onClick */}
                            <img 
                                src={photo.url} 
                                alt={photo.description || 'Foto do usuário'} 
                                className="w-full h-full object-cover cursor-pointer" 
                                onClick={() => openPhotoModal(photo.id)} // <-- MUDANÇA AQUI
                            />
                            
                            {isMyProfile && (
                                <button onClick={(e) => { e.stopPropagation(); handleDeletePhoto(photo.id); }} className="absolute top-2 right-2 p-2 bg-black bg-opacity-50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-red-600" aria-label="Apagar foto" > <Trash2 size={18} /> </button>
                            )}
                            
                            {/* Botão de Like (Atualizado para parar a propagação) */}
                            <button
                                onClick={(e) => { e.stopPropagation(); handleLikeClick(photo.id); }}
                                disabled={likingPhotoId === photo.id} 
                                className={`absolute bottom-2 left-2 p-1.5 bg-black bg-opacity-50 rounded-full text-white z-10 flex items-center gap-1.5 transition-all hover:bg-opacity-75 ${photo.isLikedByMe ? 'text-red-500' : 'text-white'} ${likingPhotoId === photo.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                                aria-label="Curtir foto"
                            >
                                <Heart size={18} className={photo.isLikedByMe ? "fill-current" : ""} />
                                <span className="text-sm font-semibold">{Number(photo.likeCount) || 0}</span>
                            </button>

                            {/* Contagem de Comentários (NOVO) */}
                            <div className="absolute bottom-2 right-2 p-1.5 bg-black bg-opacity-50 rounded-full text-white z-10 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                <MessageCircle size={18} />
                                <span className="text-sm font-semibold">{Number(photo.commentCount) || 0}</span>
                            </div>

                        </div> 
                    ))}
                </div> 
            ) : (
                <div className="text-center text-gray-500 py-16 border-2 border-dashed border-gray-700 rounded-lg">
                    <p>Nenhuma foto publicada ainda.</p>
                </div>
            )} 

            {/* Lightbox REMOVIDO */}
            {/* <FsLightbox ... /> */}

            {/* NOVO MODAL (Renderização Condicional) */}
            {selectedPhotoId && (
                <PhotoDetailModal 
                    photoId={selectedPhotoId} 
                    onClose={() => setSelectedPhotoId(null)} 
                />
            )}
        </div> 
    ); 
}; 

export default PhotosTabContent;

