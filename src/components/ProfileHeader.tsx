// src/components/ProfileHeader.tsx (VERSÃO COM AJUSTE DE POSIÇÃO DA CAPA)

import React, { useState, useRef } from 'react';
import api from '../services/api';
import { Camera, Loader2 } from 'lucide-react';
import type { UserData } from '../types/types';

interface ProfileHeaderProps {
  user: UserData;
  onEditClick: () => void;
  onCoverUploadSuccess: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, onEditClick, onCoverUploadSuccess }) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCoverUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('coverPhoto', file);

    setIsUploading(true);
    try {
      await api.post('/users/profile/cover', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onCoverUploadSuccess();
    } catch (error) {
      console.error('Erro ao enviar a foto de capa:', error);
      alert('Houve um erro ao enviar sua foto. Tente novamente.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadButtonClick = () => {
    fileInputRef.current?.click();
  };
  
  const fullProfileImageUrl = user.profilePictureUrl ? `${import.meta.env.VITE_API_URL}${user.profilePictureUrl}` : null;
  const fullCoverImageUrl = user.coverPhotoUrl ? `${import.meta.env.VITE_API_URL}${user.coverPhotoUrl}` : null;

  const calculateMembershipDuration = (createdAt: string) => {
    const creationDate = new Date(createdAt);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - creationDate.getTime()) / (1000 * 60 * 60 * 24));
    if (diffInDays < 1) return "Membro hoje";
    if (diffInDays === 1) return "Membro há 1 dia";
    return `Membro há ${diffInDays} dias`;
  };
  const membershipDuration = calculateMembershipDuration(user.createdAt);

  return (
    <div className="bg-card text-white rounded-lg shadow-lg overflow-hidden">
      <div className="relative h-48 sm:h-64 group bg-gray-800">
        {fullCoverImageUrl ? (
          // ALTERAÇÃO AQUI: Adicionada a classe 'object-top'
          <img src={fullCoverImageUrl} alt="Foto de capa" className="w-full h-full object-cover object-top" />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-gray-800 to-gray-900 flex items-center justify-center text-gray-500">
            <Camera className="w-12 h-12 opacity-30" />
          </div>
        )}
        <button
          onClick={handleUploadButtonClick}
          disabled={isUploading}
          className="absolute top-4 right-4 bg-black bg-opacity-50 text-white font-bold py-2 px-4 rounded-lg transition-opacity opacity-0 group-hover:opacity-100 disabled:opacity-50 flex items-center gap-2"
        >
          {isUploading ? (
            <><Loader2 className="animate-spin w-5 h-5" /><span>Enviando...</span></>
          ) : (
            <><Camera className="w-5 h-5" /><span>Alterar Capa</span></>
          )}
        </button>
        <input type="file" ref={fileInputRef} onChange={handleCoverUpload} accept="image/*" className="hidden" />
      </div>

      <div className="p-6 pt-0 -mt-16 sm:-mt-20 z-10 relative">
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-6">
          {fullProfileImageUrl ? (
            <img src={fullProfileImageUrl} alt={`Foto de ${user.name}`} className="w-32 h-32 rounded-full object-cover border-4 border-card flex-shrink-0" />
          ) : (
            <div className="w-32 h-32 bg-purple-800 rounded-full flex items-center justify-center text-4xl font-bold flex-shrink-0 border-4 border-card">
              {user.name.substring(0, 2).toUpperCase()}
            </div>
          )}
          <div className="flex-grow pt-16 sm:pt-0 text-center sm:text-left">
            <h1 className="text-4xl font-bold">{user.name}</h1>
            {user.location && <p className="text-gray-400 mt-1">📍 {user.location}</p>}
          </div>
          <div className="flex flex-col items-center sm:items-end gap-2">
            <button onClick={onEditClick} className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors w-full sm:w-auto">
              Editar perfil
            </button>
            <span className="text-xs text-gray-500">{membershipDuration}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;