// src/components/ProfileHeader.tsx (VERSÃO CORRIGIDA FINAL)

import React from 'react';

interface UserData {
  id: number;
  name: string;
  email: string;
  bio: string | null;
  profilePictureUrl: string | null; // A URL da foto que vem do backend
  location: string | null;
  gender: string | null;
  createdAt: string;
  lastSeenAt: string | null;
}

interface ProfileHeaderProps {
  user: UserData;
  onEditClick: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, onEditClick }) => {
  const calculateMembershipDuration = (createdAt: string) => {
    // ... sua lógica de cálculo de tempo continua a mesma
    const creationDate = new Date(createdAt);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - creationDate.getTime()) / 1000);
    if (diffInSeconds < 60) return `${diffInSeconds} segundos`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} minutos`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} horas`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} dias`;
  };

  const membershipDuration = calculateMembershipDuration(user.createdAt);

  // Criamos a URL completa da imagem, juntando o endereço do backend com o caminho da foto
  const fullProfileImageUrl = user.profilePictureUrl
    ? `${import.meta.env.VITE_API_URL}${user.profilePictureUrl}`
    : null;

  return (
    <header className="bg-card text-white p-6 rounded-lg shadow-lg">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
        
        {/* ========================================================== */}
        {/* LÓGICA CORRIGIDA PARA EXIBIR A FOTO OU O PLACEHOLDER */}
        {/* ========================================================== */}
        {fullProfileImageUrl ? (
          // SE TIVER FOTO, MOSTRE A TAG <img>
          <img
            src={fullProfileImageUrl}
            alt={`Foto de ${user.name}`}
            className="w-32 h-32 rounded-full object-cover border-4 border-primary flex-shrink-0"
          />
        ) : (
          // SENÃO, MOSTRE O CÍRCULO COM AS INICIAIS
          <div className="w-32 h-32 bg-purple-800 rounded-full flex items-center justify-center text-4xl font-bold flex-shrink-0">
            {user.name.substring(0, 2).toUpperCase()}
          </div>
        )}

        {/* User Info (continua igual) */}
        <div className="flex-grow">
          <h1 className="text-4xl font-bold">{user.name}</h1>
          {user.location && <p className="text-gray-400 mt-1">📍 {user.location}</p>}
        </div>

        {/* Edit Button and Membership Info (continua igual) */}
        <div className="flex flex-col items-start sm:items-end gap-2 mt-4 sm:mt-0">
          <button
            onClick={onEditClick}
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors w-full sm:w-auto"
          >
            Editar perfil
          </button>
          <span className="text-xs text-gray-500">Membro há {membershipDuration}</span>
        </div>
      </div>
    </header>
  );
};

export default ProfileHeader;