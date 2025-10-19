// src/components/ProfileHeader.tsx
// --- VERSÃO FINAL (Correção ts(7006) - 'any' implícito) ---

import React, { useState, useRef, useEffect } from 'react';
import api from '../services/api';
import { Camera, Loader2, UserCheck, UserPlus, Heart } from 'lucide-react';
import type { UserData } from '../types/types';

// 1. Importando o hook de Autenticação
import { useAuth } from '../contexts/AuthProvider';
// 2. Importando as novas funções da API
import { followUser, unfollowUser, likeProfile, unlikeProfile } from '../services/interactionApi';

interface ProfileHeaderProps {
  user: UserData;
  onEditClick: () => void;
  onCoverUploadSuccess: () => void;
  isMyProfile: boolean;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, onEditClick, onCoverUploadSuccess, isMyProfile }) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // 3. Pegando o usuário logado do contexto
  const { user: loggedInUser } = useAuth();

  // 4. Estados para os novos botões
  const [isFollowed, setIsFollowed] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [isLikeLoading, setIsLikeLoading] = useState(false);

  // 5. Lógica para definir o estado inicial dos botões
  useEffect(() => {
    
    // --- ESTA É A LINHA CORRIGIDA (f) ---
    // Adicionamos (f: { followingId: number }) para dizer ao TS o tipo de 'f'
    const alreadyFollowing = loggedInUser?.following?.some((f: { followingId: number }) => f.followingId === user.id) || false;
    setIsFollowed(alreadyFollowing);

    // --- ESTA É A LINHA CORRIGIDA (l) ---
    // Adicionamos (l: { likedUserId: number }) para dizer ao TS o tipo de 'l'
    const alreadyLiked = loggedInUser?.likesGiven?.some((l: { likedUserId: number }) => l.likedUserId === user.id) || false;
    setIsLiked(alreadyLiked);
    
    // Resetar os estados quando o perfil do usuário (user.id) mudar
  }, [user.id, loggedInUser]);
  
  // --- Lógica de Upload de Capa (Sem alteração) ---
  const handleCoverUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('cover', file);
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
  
  const fullProfileImageUrl = user.profilePictureUrl;
  const fullCoverImageUrl = user.coverPhotoUrl;
  
  // --- Lógica da Duração (Sem alteração) ---
  const calculateMembershipDuration = (createdAt: string): string => {
    const creationDate = new Date(createdAt);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - creationDate.getTime()) / (1000 * 60 * 60 * 24));
    if (diffInDays < 1) return "Membro hoje";
    if (diffInDays === 1) return "Membro há 1 dia";
    return `Membro há ${diffInDays} dias`;
  };
  const membershipDuration = calculateMembershipDuration(user.createdAt);

  // --- 6. FUNÇÕES DE TOGGLE PARA OS NOVOS BOTÕES (Sem alteração) ---
  const handleFollowToggle = async () => {
    setIsFollowLoading(true);
    try {
      if (isFollowed) {
        await unfollowUser(user.id);
        setIsFollowed(false);
        // TODO: Atualizar o contador de seguidores no 'loggedInUser' (Contexto)
      } else {
        await followUser(user.id);
        setIsFollowed(true);
        // TODO: Atualizar o contador de seguidores no 'loggedInUser' (Contexto)
      }
    } catch (err) {
      console.error("Erro ao seguir/deseguir:", err);
      // Reverte o estado se a API falhar (opcional)
    } finally {
      setIsFollowLoading(false);
    }
  };
  
  const handleLikeToggle = async () => {
    setIsLikeLoading(true);
    try {
      if (isLiked) {
        await unlikeProfile(user.id);
        setIsLiked(false);
      } else {
        await likeProfile(user.id);
        setIsLiked(true);
      }
    } catch (err) {
      console.error("Erro ao curtir/descurtir:", err);
    } finally {
      setIsLikeLoading(false);
    }
  };


  return (
    <div className="bg-card text-white rounded-lg shadow-lg overflow-hidden">
      {/* Bloco da Capa (Sem alteração na lógica de upload) */}
      <div className="relative h-48 sm:h-64 group bg-gray-800">
        {fullCoverImageUrl ? (
          <img src={fullCoverImageUrl} alt="Foto de capa" className="w-full h-full object-cover object-top" />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-gray-800 to-gray-900 flex items-center justify-center text-gray-500">
            <Camera className="w-12 h-12 opacity-30" />
          </div>
        )}
        {isMyProfile && (
            <>
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
            </>
        )}
      </div>

      {/* Bloco Principal do Header (Avatar, Nome, Botões) */}
      <div className="p-6 pt-0 -mt-16 sm:-mt-20 z-10 relative">
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-6">
          
          {/* Avatar */}
          {fullProfileImageUrl ? (
            <img src={fullProfileImageUrl} alt={`Foto de ${user.name}`} className="w-32 h-32 rounded-full object-cover border-4 border-card flex-shrink-0" />
          ) : (
            <div className="w-32 h-32 bg-purple-800 rounded-full flex items-center justify-center text-4xl font-bold flex-shrink-0 border-4 border-card">
              {user.name.substring(0, 2).toUpperCase()}
            </div>
          )}
          
          {/* Nome e Localização */}
          <div className="flex-grow pt-16 sm:pt-0 text-center sm:text-left">
            <h1 className="text-4xl font-bold">{user.name}</h1>
            {user.location && <p className="text-gray-400 mt-1">📍 {user.location}</p>}
          </div>

          {/* --- 7. BLOCO DE BOTÕES ATUALIZADO (Sem alteração) --- */}
          <div className="flex flex-col items-center sm:items-end gap-2 w-full sm:w-auto">
            
            {isMyProfile ? (
              // Se FOR o meu perfil, mostra "Editar perfil"
              <button onClick={onEditClick} className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors w-full sm:w-auto">
                Editar perfil
              </button>
            ) : (
              // Se NÃO FOR o meu perfil, mostra "Seguir" e "Curtir"
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={handleFollowToggle}
                  disabled={isFollowLoading}
                  className={`font-bold py-2 px-4 rounded-lg transition-colors w-full flex items-center justify-center gap-1.5
                    ${isFollowed 
                      ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                      : 'bg-primary hover:bg-primary-dark text-white'
                    }
                    ${isFollowLoading ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  {isFollowLoading ? <Loader2 className="animate-spin w-5 h-5" /> : (isFollowed ? <UserCheck className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />)}
                  <span>{isFollowed ? 'Seguindo' : 'Seguir'}</span>
                </button>
                
                <button
                  onClick={handleLikeToggle}
                  disabled={isLikeLoading}
                  className={`font-bold py-2 px-4 rounded-lg transition-colors w-full flex items-center justify-center gap-1.5
                    ${isLiked 
                      ? 'bg-red-800 hover:bg-red-700 text-white' 
                      : 'bg-gray-700 hover:bg-gray-600 text-white'
                    }
                    ${isLikeLoading ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  {isLikeLoading ? <Loader2 className="animate-spin w-5 h-5" /> : <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />}
                  <span>{isLiked ? 'Curtiu' : 'Curtir'}</span>
                </button>
              </div>
            )}
            
            {/* Duração como membro (Sem alteração) */}
            <span className="text-xs text-gray-500">{membershipDuration}</span>
          </div>
          {/* --- FIM DO BLOCO DE BOTÕES --- */}

        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;