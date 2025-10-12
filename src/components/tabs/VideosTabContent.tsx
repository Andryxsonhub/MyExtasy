// src/components/tabs/VideosTabContent.tsx (VERSÃO CORRIGIDA)

import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import type { Video } from '../../types/types';

interface VideosTabContentProps {
    videos: Video[];
    onAddVideoClick: () => void;
    isMyProfile: boolean; // <-- PROPRIEDADE ADICIONADA
}

const VideosTabContent: React.FC<VideosTabContentProps> = ({ videos, onAddVideoClick, isMyProfile }) => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white">Meus Vídeos</h3>
                {/* O botão agora só aparece se for o seu perfil */}
                {isMyProfile && (
                    <Button onClick={onAddVideoClick}> 
                        <PlusCircle className="w-4 h-4 mr-2" /> Adicionar Novo Vídeo 
                    </Button>
                )}
            </div>
            {videos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {videos.map((video) => (
                        <div key={video.id} className="relative aspect-video bg-black rounded-lg overflow-hidden">
                            <video src={`${API_URL}${video.url}`} controls className="w-full h-full object-contain" />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center text-gray-500 py-16 border-2 border-dashed border-gray-700 rounded-lg"> 
                    <p>Nenhum vídeo publicado ainda.</p> 
                    <p className="text-sm mt-1">Que tal adicionar o primeiro?</p> 
                </div>
            )}
        </div>
    );
};

export default VideosTabContent;