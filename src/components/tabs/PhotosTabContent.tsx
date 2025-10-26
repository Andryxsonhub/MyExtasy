// src/components/tabs/PhotosTabContent.tsx (VERSÃO FINAL COMPLETA - COM LIKES)

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2, Heart } from 'lucide-react'; // <-- 1. IMPORTAR O ÍCONE
import type { Photo } from '../../types/types';
import api from '@/services/api';
import FsLightbox from 'fslightbox-react';
import { togglePhotoLike } from '@/services/interactionApi'; // <-- 2. IMPORTAR A FUNÇÃO DA API

interface PhotosTabContentProps {
    photos: Photo[];
    onAddPhotoClick: () => void;
    isMyProfile: boolean;
    onDeleteSuccess: () => void; 
}

const PhotosTabContent: React.FC<PhotosTabContentProps> = ({ photos, onAddPhotoClick, isMyProfile, onDeleteSuccess }) => {
    
    // 3. ESTADO LOCAL PARA ATUALIZAÇÃO OTIMISTA
    const [localPhotos, setLocalPhotos] = useState<Photo[]>(photos);
    const [lightboxController, setLightboxController] = useState({
        toggler: false,
        slide: 1
    });

    // Sincroniza o estado local se as props mudarem (ex: após deletar e refazer o fetch)
    useEffect(() => {
        setLocalPhotos(photos);
    }, [photos]);

    function openLightboxOnSlide(number: number) {
        setLightboxController({
            toggler: !lightboxController.toggler,
            slide: number
        });
    }

    const handleDeletePhoto = async (photoId: number) => {
        if (!window.confirm('Tem certeza que deseja apagar esta foto? Esta ação não pode ser desfeita.')) {
            return;
        }
        try {
            await api.delete(`/users/photos/${photoId}`);
            alert('Foto apagada com sucesso!');
            onDeleteSuccess(); // Dispara o refetch no componente pai
        } catch (error) {
            console.error('Erro ao apagar a foto:', error);
            alert('Não foi possível apagar a foto. Tente novamente.');
        }
    };

    // 4. FUNÇÃO PARA LIDAR COM O CLIQUE DE LIKE
    const handleLikeClick = async (photoId: number) => {
        // Guarda o estado original para reverter em caso de erro
        const originalPhotos = [...localPhotos];

        // Atualização Otimista: Muda o estado local imediatamente
        setLocalPhotos(prevPhotos =>
            prevPhotos.map(photo =>
                photo.id === photoId
                    ? {
                        ...photo,
                        isLikedByMe: !photo.isLikedByMe,
                        likeCount: photo.isLikedByMe
                            ? photo.likeCount - 1
                            : photo.likeCount + 1,
                      }
                    : photo
            )
        );

        // Tenta enviar a requisição para o backend
        try {
            await togglePhotoLike(photoId);
            // Sucesso: O backend está sincronizado com o frontend.
        } catch (error) {
            // Erro: Reverte o estado local para o original
            alert("Erro ao processar a curtida. Tente novamente.");
            setLocalPhotos(originalPhotos);
        }
    };

    // Usamos 'localPhotos' para as URLs e para o map
    const photoUrls = localPhotos.map(photo => photo.url);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white">Minhas Fotos</h3>
                {isMyProfile && (
                    <Button onClick={onAddPhotoClick}>
                        <PlusCircle className="w-4 h-4 mr-2" /> Adicionar Nova Foto
                    </Button>
                )}
            </div>
            
            {localPhotos.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {localPhotos.map((photo, i) => ( // <-- Usar localPhotos
                        <div key={photo.id} className="relative aspect-square bg-gray-800 rounded-lg overflow-hidden group">
                            <img 
                                src={photo.url} 
                                alt={photo.description || 'Foto do usuário'} 
                                className="w-full h-full object-cover cursor-pointer" 
                                onClick={() => openLightboxOnSlide(i + 1)}
                            />
                            
                            {/* BOTÃO DE DELETAR (só para meu perfil) */}
                            {isMyProfile && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleDeletePhoto(photo.id); }}
                                    className="absolute top-2 right-2 p-2 bg-black bg-opacity-50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-red-600"
                                    aria-label="Apagar foto"
                                >
                                    <Trash2 size={18} />
                                </button>
                            )}

                            {/* 5. BOTÃO DE LIKE (para todos) */}
                            <button
                                onClick={(e) => { e.stopPropagation(); handleLikeClick(photo.id); }}
                                className={`absolute bottom-2 left-2 p-1.5 bg-black bg-opacity-50 rounded-full text-white z-10 flex items-center gap-1.5 transition-all hover:bg-opacity-75
                                  ${photo.isLikedByMe ? 'text-red-500' : 'text-white'}
                                `}
                                aria-label="Curtir foto"
                            >
                                <Heart 
                                    size={18} 
                                    className={photo.isLikedByMe ? "fill-current" : ""} 
                                />
                                <span className="text-sm font-semibold">{photo.likeCount}</span>
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center text-gray-500 py-16 border-2 border-dashed border-gray-700 rounded-lg">
                    <p>Nenhuma foto publicada ainda.</p>
                </div>
            )}

            <FsLightbox
                toggler={lightboxController.toggler}
                sources={photoUrls}
                slide={lightboxController.slide}
                // Garante que o FsLightbox saiba que são imagens (para o S3)
                types={new Array(photoUrls.length).fill('image')}
            />
        </div>
    );
};

export default PhotosTabContent;