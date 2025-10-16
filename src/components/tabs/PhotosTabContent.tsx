import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2 } from 'lucide-react';
import type { Photo } from '../../types/types';
import api from '@/services/api';

import FsLightbox from 'fslightbox-react';

interface PhotosTabContentProps {
    photos: Photo[];
    onAddPhotoClick: () => void;
    isMyProfile: boolean;
    onDeleteSuccess: () => void; 
}

const PhotosTabContent: React.FC<PhotosTabContentProps> = ({ photos, onAddPhotoClick, isMyProfile, onDeleteSuccess }) => {
    
    const [lightboxController, setLightboxController] = useState({
        toggler: false,
        slide: 1
    });

    function openLightboxOnSlide(number: number) {
        setLightboxController({
            toggler: !lightboxController.toggler,
            slide: number
        });
    }

    // ==========================================================
    // A CORREÇÃO DO ERRO "Expression expected" ESTÁ AQUI:
    // A lógica da função foi restaurada.
    // ==========================================================
    const handleDeletePhoto = async (photoId: number) => {
        if (!window.confirm('Tem certeza que deseja apagar esta foto? Esta ação não pode ser desfeita.')) {
            return;
        }
        try {
            await api.delete(`/users/photos/${photoId}`);
            alert('Foto apagada com sucesso!');
            onDeleteSuccess();
        } catch (error) {
            console.error('Erro ao apagar a foto:', error);
            alert('Não foi possível apagar a foto. Tente novamente.');
        }
    };

    const photoUrls = photos.map(photo => photo.url);

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
            
            {photos.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {photos.map((photo, i) => (
                        <div key={photo.id} className="relative aspect-square bg-gray-800 rounded-lg overflow-hidden group cursor-pointer">
                            <img 
                                src={photo.url} 
                                alt={photo.description || 'Foto do usuário'} 
                                className="w-full h-full object-cover" 
                                onClick={() => openLightboxOnSlide(i + 1)}
                            />
                            {isMyProfile && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleDeletePhoto(photo.id); }}
                                    className="absolute top-2 right-2 p-2 bg-black bg-opacity-50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-red-600"
                                    aria-label="Apagar foto"
                                >
                                    <Trash2 size={18} />
                                </button>
                            )}
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
            />
        </div>
    );
};

export default PhotosTabContent;