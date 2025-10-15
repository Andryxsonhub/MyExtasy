import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2 } from 'lucide-react';
import type { Photo } from '../../types/types';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import api from '@/services/api';

interface PhotosTabContentProps {
    photos: Photo[];
    onAddPhotoClick: () => void;
    isMyProfile: boolean;
    onDeleteSuccess: () => void; 
}

const PhotosTabContent: React.FC<PhotosTabContentProps> = ({ photos, onAddPhotoClick, isMyProfile, onDeleteSuccess }) => {
    
    const [open, setOpen] = useState(false);
    const [index, setIndex] = useState(0);

    const slides = photos.map(photo => {
        if (photo.url.startsWith('http')) {
            return { src: photo.url };
        }
        const parts = photo.url.split('/');
        if (parts.length === 4) {
            const folder = parts[2];
            const filename = parts[3];
            return { src: `/media?folder=${folder}&file=${filename}` };
        }
        return { src: photo.url };
    });

    const handleDeletePhoto = async (photoId: number) => {
        if (!window.confirm('Tem certeza que deseja apagar esta foto? Esta ação não pode ser desfeita.')) {
            return;
        }
        try {
            // A chamada à API agora usará o ID numérico correto, ex: /users/photos/7
            await api.delete(`/users/photos/${photoId}`);
            alert('Foto apagada com sucesso!');
            onDeleteSuccess();
        } catch (error) {
            console.error('Erro ao apagar a foto:', error);
            alert('Não foi possível apagar a foto. Tente novamente.');
        }
    };

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
                        <div key={photo.id} className="relative aspect-square bg-gray-800 rounded-lg overflow-hidden group">
                            <img 
                                src={slides[i].src}
                                alt={photo.description || 'Foto do usuário'}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 cursor-pointer"
                                onClick={() => {
                                    setIndex(i);
                                    setOpen(true);
                                }}
                            />
                            {isMyProfile && (
                                <button
                                    // =================================================================
                                    // AQUI ESTÁ A GARANTIA DA CORREÇÃO DO ERRO 404:
                                    // Passamos 'photo.id', que é um número limpo, para a função.
                                    // =================================================================
                                    onClick={(e) => {
                                        e.stopPropagation(); 
                                        handleDeletePhoto(photo.id);
                                    }}
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

            <Lightbox
                open={open}
                close={() => setOpen(false)}
                slides={slides}
                index={index}
            />
        </div>
    );
};

export default PhotosTabContent;