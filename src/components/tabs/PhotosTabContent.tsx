// src/components/tabs/PhotosTabContent.tsx (VERSÃO FINAL CORRIGIDA)

import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import type { Photo } from '../../types/types';

interface PhotosTabContentProps {
    photos: Photo[];
    onAddPhotoClick: () => void;
    isMyProfile: boolean;
}

const PhotosTabContent: React.FC<PhotosTabContentProps> = ({ photos, onAddPhotoClick, isMyProfile }) => {
    
    // Helper para construir a nova URL segura.
    const getSecureImageUrl = (photoUrl: string) => {
        // Exemplo de photo.url: /uploads/photos/nome-do-arquivo.jpg
        // Precisamos transformar isso em: /api/media/photos/nome-do-arquivo.jpg
        const parts = photoUrl.split('/');
        if (parts.length === 4) { 
            const folder = parts[2];
            const filename = parts[3];
            return `/api/media/${folder}/${filename}`;
        }
        // Retorna a URL original se o formato for inesperado, para evitar quebrar a imagem.
        return photoUrl; 
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
                    {photos.map((photo) => {
                        // Constrói a URL segura completa para cada foto
                        const secureUrl = `${import.meta.env.VITE_API_URL}${getSecureImageUrl(photo.url)}`;
                        
                        return (
                            <div key={photo.id} className="relative aspect-square bg-gray-800 rounded-lg overflow-hidden">
                                <img src={secureUrl} alt={photo.description || 'Foto do usuário'} className="w-full h-full object-cover" />
                            </div>
                        );
                    })}
                </div>
            ) : (
                // AQUI ESTAVA O ERRO, AGORA CORRIGIDO:
                <div className="text-center text-gray-500 py-16 border-2 border-dashed border-gray-700 rounded-lg">
                    <p>Nenhuma foto publicada ainda.</p>
                </div>
            )}
        </div>
    );
};

export default PhotosTabContent;