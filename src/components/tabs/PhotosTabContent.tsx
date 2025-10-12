// src/components/tabs/PhotosTabContent.tsx
 import React from 'react';
 import { Button } from '@/components/ui/button';
 import { PlusCircle } from 'lucide-react';
 import type { Photo } from '../../types/types';

 interface PhotosTabContentProps {
     photos: Photo[];
     onAddPhotoClick: () => void;
 }

 const PhotosTabContent: React.FC<PhotosTabContentProps> = ({ photos, onAddPhotoClick }) => {
     const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

     return (
         <div>
             <div className="flex justify-between items-center mb-6">
                 <h3 className="text-2xl font-bold text-white">Minhas Fotos</h3>
                 <Button onClick={onAddPhotoClick}> 
                     <PlusCircle className="w-4 h-4 mr-2" /> Adicionar Nova Foto 
                 </Button>
             </div>
             {photos.length > 0 ? (
                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                     {photos.map((photo) => ( 
                         <div key={photo.id} className="relative aspect-square bg-gray-800 rounded-lg overflow-hidden"> 
                             <img src={`${API_URL}${photo.url}`} alt={photo.description || 'Foto do usuário'} className="w-full h-full object-cover" /> 
                         </div> 
                     ))}
                 </div>
             ) : (
                 <div className="text-center text-gray-500 py-16 border-2 border-dashed border-gray-700 rounded-lg"> 
                     <p>Nenhuma foto publicada ainda.</p> 
                 </div>
             )}
         </div>
     );
 };

 export default PhotosTabContent;