import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, PlayCircle } from 'lucide-react';
import type { Video } from '../../types/types';

import FsLightbox from 'fslightbox-react';

interface VideosTabContentProps {
    videos: Video[];
    onAddVideoClick: () => void;
    isMyProfile: boolean;
}

const VideosTabContent: React.FC<VideosTabContentProps> = ({ videos, onAddVideoClick, isMyProfile }) => {
    
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

    const videoUrls = videos.map(video => video.url);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white">Meus Vídeos</h3>
                {isMyProfile && (
                    <Button onClick={onAddVideoClick}>
                        <PlusCircle className="w-4 h-4 mr-2" /> Adicionar Novo Vídeo
                    </Button>
                )}
            </div>

            {videos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {videos.map((video, i) => (
                        <div 
                            key={video.id} 
                            className="relative aspect-video bg-black rounded-lg overflow-hidden cursor-pointer group"
                            onClick={() => openLightboxOnSlide(i + 1)}
                        >
                            <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-50 transition-colors z-10"></div>
                            <PlayCircle className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-12 w-16 h-16 text-white opacity-70 group-hover:opacity-100 transition-opacity z-20" />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center text-gray-500 py-16 border-2 border-dashed border-gray-700 rounded-lg">
                    <p>Nenhum vídeo publicado ainda.</p>
                </div>
            )}

            <FsLightbox
                toggler={lightboxController.toggler}
                sources={videoUrls}
                slide={lightboxController.slide}
            />
        </div>
    );
};

export default VideosTabContent;