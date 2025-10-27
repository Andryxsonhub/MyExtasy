// src/components/tabs/PhotosTabContent.tsx (VERIFICAÇÃO FINAL ABSOLUTA)

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2, Heart } from 'lucide-react';
import type { Photo } from '../../types/types'; // Importa o tipo correto
import api from '@/services/api'; 
import FsLightbox from 'fslightbox-react';
import { togglePhotoLike } from '@/services/interactionApi'; 

// Interface com TODAS as props necessárias
interface PhotosTabContentProps {
    photos: Photo[];
    onAddPhotoClick: () => void; // <-- GARANTIDO QUE ESTÁ AQUI
    isMyProfile: boolean;
    onDeleteSuccess: () => void; 
}

// O componente recebe as props
const PhotosTabContent: React.FC<PhotosTabContentProps> = ({ photos, onAddPhotoClick, isMyProfile, onDeleteSuccess }) => {
    
    const [localPhotos, setLocalPhotos] = useState<Photo[]>(photos);
    const [lightboxController, setLightboxController] = useState({ toggler: false, slide: 1 });
    const [likingPhotoId, setLikingPhotoId] = useState<number | null>(null);

    useEffect(() => { setLocalPhotos(photos); }, [photos]);

    function openLightboxOnSlide(number: number) { setLightboxController({ toggler: !lightboxController.toggler, slide: number }); }

    const handleDeletePhoto = async (photoId: number) => { 
        if (!window.confirm('Tem certeza que deseja apagar esta foto?')) { return; }
        try {
            await api.delete(`/users/photos/${photoId}`); 
            alert('Foto apagada com sucesso!');
            onDeleteSuccess(); 
        } catch (error) {
            console.error('Erro ao apagar a foto:', error);
            alert('Não foi possível apagar a foto.');
        }
     };

    const handleLikeClick = async (photoId: number) => {
        if (likingPhotoId === photoId) return; 
        setLikingPhotoId(photoId); 
        const photoToUpdate = localPhotos.find(p => p.id === photoId);
        const originalIsLiked = photoToUpdate?.isLikedByMe; 
        setLocalPhotos(prevPhotos =>
            prevPhotos.map(photo =>
                photo.id === photoId ? { ...photo, isLikedByMe: !photo.isLikedByMe } : photo
            )
        );
        try { 
            const responseData = await togglePhotoLike(photoId); 
            setLocalPhotos(prevPhotos =>
                prevPhotos.map(photo =>
                    photo.id === photoId ? { ...photo, isLikedByMe: responseData.isLikedByMe, likeCount: responseData.likeCount } : photo
                )
            );
        } catch (error) { 
            console.error("Erro ao processar curtida (revertendo):", error); 
            alert("Erro ao processar a curtida."); 
            setLocalPhotos(prevPhotos =>
                prevPhotos.map(photo =>
                    photo.id === photoId ? { ...photo, isLikedByMe: originalIsLiked ?? false } : photo // Fallback aqui
                )
            ); 
        } finally { 
            setLikingPhotoId(null); 
        }
    };

    const photoUrls = localPhotos.map(photo => photo.url);

    return (
        <div>
            {/* Cabeçalho */}
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white">Minhas Fotos</h3>
                {/* Uso da prop 'onAddPhotoClick' */}
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
                            <img src={photo.url} alt={photo.description || 'Foto do usuário'} className="w-full h-full object-cover cursor-pointer" onClick={() => openLightboxOnSlide(i + 1)} />
                            {isMyProfile && (
                                <button onClick={(e) => { e.stopPropagation(); handleDeletePhoto(photo.id); }} className="absolute top-2 right-2 p-2 bg-black bg-opacity-50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-red-600" aria-label="Apagar foto" > <Trash2 size={18} /> </button>
                            )}
                            <button
                                onClick={(e) => { e.stopPropagation(); handleLikeClick(photo.id); }}
                                disabled={likingPhotoId === photo.id} 
                                className={`absolute bottom-2 left-2 p-1.5 bg-black bg-opacity-50 rounded-full text-white z-10 flex items-center gap-1.5 transition-all hover:bg-opacity-75 ${photo.isLikedByMe ? 'text-red-500' : 'text-white'} ${likingPhotoId === photo.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                                aria-label="Curtir foto"
                            >
                                <Heart size={18} className={photo.isLikedByMe ? "fill-current" : ""} />
                                <span className="text-sm font-semibold">{Number(photo.likeCount) || 0}</span>
                            </button>
                        </div> 
                    ))}
                </div> 
            ) : (
                <div className="text-center text-gray-500 py-16 border-2 border-dashed border-gray-700 rounded-lg">
                    <p>Nenhuma foto publicada ainda.</p>
                </div>
            )} 

            {/* Lightbox */}
            <FsLightbox toggler={lightboxController.toggler} sources={photoUrls} slide={lightboxController.slide} types={new Array(photoUrls.length).fill('image')} />
        </div> 
    ); 
}; 

export default PhotosTabContent;