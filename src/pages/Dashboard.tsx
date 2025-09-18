// src/components/UserProfile.tsx

import React from 'react';
import { FaVideo } from 'react-icons/fa'; // NOVO: Importamos o ícone de vídeo

// Definição das propriedades que o componente espera receber
interface UserProfileProps {
  name: string;
  email: string;
  bio: string;
  profilePictureUrl: string | null; // A URL pode ser nula
}

const UserProfile: React.FC<UserProfileProps> = ({ name, email, bio, profilePictureUrl }) => {
  
  // Função para lidar com o clique no botão (não faz nada por enquanto)
  const handleStartLive = () => {
    console.log('Botão "Iniciar Live" clicado!');
    // No futuro, aqui você colocaria a lógica para iniciar uma transmissão
    alert('Funcionalidade de Live ainda não implementada.');
  };

  return (
    // Card principal do perfil
    <div className="bg-card p-6 rounded-lg shadow-md text-center flex flex-col h-full">
      
      {/* Imagem de Perfil */}
      <img
        // Se a URL da foto existir, use-a. Senão, use uma imagem padrão.
        src={profilePictureUrl || 'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg'}
        alt="Foto de Perfil"
        className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-primary object-cover"
      />

      {/* Informações do Usuário */}
      <div className="flex-grow">
        <h2 className="text-2xl font-bold text-foreground">{name}</h2>
        <p className="text-sm text-muted-foreground mb-4">{email}</p>
        <p className="text-foreground mb-6">{bio}</p>
      </div>

      {/* BOTÃO "INICIAR LIVE" ADICIONADO AQUI */}
      <button 
        onClick={handleStartLive}
        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105"
      >
        <FaVideo />
        <span>Iniciar Live</span>
      </button>

    </div>
  );
};

export default UserProfile;