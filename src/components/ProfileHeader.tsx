// Arquivo: src/components/ProfileHeader.tsx (VERSÃO COMPLETA E CORRIGIDA)

import React from 'react';

// Esta interface precisa existir aqui para que o componente saiba o formato do objeto 'user'
// Garanta que ela seja igual à que está na página UserProfilePage.tsx
interface UserData {
  id: number;
  name: string;
  email: string;
  bio: string | null;
  profilePictureUrl: string | null;
  location: string | null;
  gender: string | null;
  createdAt: string;
  lastSeenAt: string | null;
}

// 1. AQUI ESTÁ A MUDANÇA PRINCIPAL: Adicionamos 'onEditClick' às props que o componente espera
interface ProfileHeaderProps {
  user: UserData;
  onEditClick: () => void; // A função que será chamada no clique do botão
}

// 2. E AQUI NÓS RECEBEMOS a função 'onEditClick' junto com o 'user'
const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, onEditClick }) => {
  
  // O cálculo do tempo de membro pode continuar aqui se você já o tinha
  const calculateMembershipDuration = (createdAt: string) => {
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

  return (
    <header className="bg-card text-white p-6 rounded-lg shadow-lg">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
        {/* Profile Picture Placeholder */}
        <div className="w-32 h-32 bg-purple-800 rounded-full flex items-center justify-center text-4xl font-bold flex-shrink-0">
          {user.name.substring(0, 2).toUpperCase()}
        </div>

        {/* User Info */}
        <div className="flex-grow">
          <h1 className="text-4xl font-bold">{user.name}</h1>
          {user.location && <p className="text-gray-400 mt-1">📍 {user.location}</p>}
        </div>

        {/* Edit Button and Membership Info */}
        <div className="flex flex-col items-start sm:items-end gap-2 mt-4 sm:mt-0">
          <button 
            // 3. AQUI USAMOS a função no evento onClick do botão
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