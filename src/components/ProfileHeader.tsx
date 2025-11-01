// src/components/ProfileHeader.tsx
// --- ATUALIZADO (Fase 3B: Aceita 'onOpenChatModal' e adiciona o botão 'Mensagem') ---

import React, { useState, useRef, useEffect } from 'react';
import api from '../services/api';
// --- NOVO (1/4): Importa o ícone de Mensagem ---
import { Camera, Loader2, UserCheck, UserPlus, Heart, MoreVertical, ShieldAlert, UserX, MessageCircle } from 'lucide-react';
import type { UserData } from '../types/types';

import { useAuth } from '../contexts/AuthProvider';
import {
  toggleFollowUser,
  toggleProfileLike,
  denounceUser,
  blockUser
} from '../services/interactionApi';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from './ui/button';

interface ProfileHeaderProps {
  user: UserData;
  onEditClick: () => void;
  onCoverUploadSuccess: () => void;
  isMyProfile: boolean;
  // --- NOVO (2/4): Adiciona a prop para abrir o chat ---
  onOpenChatModal: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  onEditClick,
  onCoverUploadSuccess,
  isMyProfile,
  onOpenChatModal // <-- Recebe a nova prop
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { user: loggedInUser, setUser: setLoggedInUser } = useAuth();

  const [isFollowed, setIsFollowed] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);

  const [isLiked, setIsLiked] = useState(user.isLikedByMe || false);
  const [likeCount, setLikeCount] = useState(user.likeCount || 0);
  const [isLikeLoading, setIsLikeLoading] = useState(false);

  const [isBlocked, setIsBlocked] = useState(false);
  const [isBlockLoading, setIsBlockLoading] = useState(false);

  // Lógica para definir o estado inicial
  useEffect(() => {
    const alreadyFollowing = loggedInUser?.following?.some((f: any) => f.followingId === user.id) || false;
    setIsFollowed(alreadyFollowing);

    setIsLiked(user.isLikedByMe || false);
    setLikeCount(user.likeCount || 0);

    const alreadyBlocked = loggedInUser?.blockedUsers?.some((b: any) => b.blockedUserId === user.id) || false;
    setIsBlocked(alreadyBlocked);

  }, [user.id, user.isLikedByMe, user.likeCount, loggedInUser]);

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

  // --- FUNÇÕES DE TOGGLE ATUALIZADAS (Sem alteração) ---

  const handleFollowToggle = async () => {
    setIsFollowLoading(true);
    try {
      const data = await toggleFollowUser(user.id);
      setIsFollowed(data.isFollowing);
    } catch (err) {
      console.error("Erro ao seguir/deseguir:", err);
    } finally {
      setIsFollowLoading(false);
    }
  };

  const handleLikeToggle = async () => {
    if (isLikeLoading) return;
    setIsLikeLoading(true);
    const originalState = { isLiked, likeCount };
    const newLikedState = !isLiked;
    const newLikeCount = newLikedState ? likeCount + 1 : likeCount - 1;
    setIsLiked(newLikedState);
    setLikeCount(newLikeCount);
    try {
      const data = await toggleProfileLike(user.id);
      setIsLiked(data.isLikedByMe);
      setLikeCount(data.likeCount);
    } catch (err) {
      console.error("Erro ao curtir/descurtir:", err);
      setIsLiked(originalState.isLiked);
      setLikeCount(originalState.likeCount);
    } finally {
      setIsLikeLoading(false);
    }
  };

  // --- FUNÇÕES (Denunciar e Bloquear) (Sem alteração) ---

  const handleDenounceClick = async () => {
    const reason = window.prompt("Por favor, descreva o motivo da denúncia (mínimo de 10 caracteres).");

    if (!reason || reason.trim().length < 10) {
      if (reason !== null) {
        alert("A denúncia deve ter pelo menos 10 caracteres.");
      }
      return;
    }
    try {
      await denounceUser(user.id, reason.trim());
      alert("Denúncia enviada com sucesso. Nossa equipe irá analisar.");
    } catch (error) {
      console.error("Erro ao denunciar:", error);
      alert("Não foi possível enviar a denúncia. Tente novamente.");
    }
  };

  const handleBlockToggle = async () => {
    setIsBlockLoading(true);
    try {
      const data = await blockUser(user.id);

      setIsBlocked(data.isBlocked);

      if (setLoggedInUser && loggedInUser) {
        setLoggedInUser({ ...loggedInUser, blockedUsers: data.updatedBlockedList });
      }
      alert(data.isBlocked ? "Usuário bloqueado com sucesso." : "Usuário desbloqueado.");
    } catch (error) {
      console.error("Erro ao bloquear:", error);
      alert("Não foi possível processar o bloqueio. Tente novamente.");
    } finally {
      setIsBlockLoading(false);
    }
  };


  return (
    <div className="bg-card text-white rounded-lg shadow-lg overflow-hidden">
      {/* Bloco da Capa (Sem alteração) */}
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

      {/* Bloco Principal do Header (Sem alteração) */}
      <div className="p-6 pt-0 -mt-16 sm:-mt-20 z-10 relative">
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-6">

          {/* Avatar (Sem alteração) */}
          {fullProfileImageUrl ? (
            <img src={fullProfileImageUrl} alt={`Foto de ${user.name}`} className="w-32 h-32 rounded-full object-cover border-4 border-card flex-shrink-0" />
          ) : (
            <div className="w-32 h-32 bg-purple-800 rounded-full flex items-center justify-center text-4xl font-bold flex-shrink-0 border-4 border-card">
              {user.name.substring(0, 2).toUpperCase()}
            </div>
          )}

          {/* Nome e Localização (Sem alteração) */}
          <div className="flex-grow pt-16 sm:pt-0 text-center sm:text-left">
            <h1 className="text-4xl font-bold">{user.name}</h1>
            {user.location && <p className="text-gray-400 mt-1">📍 {user.location}</p>}
          </div>

          {/* --- BLOCO DE BOTÕES ATUALIZADO --- */}
          <div className="flex flex-col items-center sm:items-end gap-2 w-full sm:w-auto">

            {isMyProfile ? (
              // Se FOR o meu perfil
              <button onClick={onEditClick} className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors w-full sm:w-auto">
                Editar perfil
              </button>
            ) : (
              // Se NÃO FOR o meu perfil
              // --- NOVO (3/4): Adiciona o botão "Mensagem" ---
              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  onClick={onOpenChatModal} // <-- LIGA A FUNÇÃO AQUI
                  disabled={isBlockLoading || isBlocked} // Não pode enviar msg se estiver bloqueado
                  className="font-bold py-2 px-4 rounded-lg transition-colors w-full flex items-center justify-center gap-1.5 bg-gray-700 hover:bg-gray-600 text-white"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Mensagem</span>
                </Button>

                {/* Botão Seguir (Usa handleFollowToggle) */}
                <button
                  onClick={handleFollowToggle}
                  disabled={isFollowLoading || isBlocked} // Não pode seguir se estiver bloqueado
                  className={`font-bold py-2 px-4 rounded-lg transition-colors w-full flex items-center justify-center gap-1.5
Read             ${isFollowed
                      ? 'bg-gray-700 hover:bg-gray-600 text-white'
                      : 'bg-primary hover:bg-primary-dark text-white'
                    }
                    ${isFollowLoading || isBlocked ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  {isFollowLoading ? <Loader2 className="animate-spin w-5 h-5" /> : (isFollowed ? <UserCheck className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />)}
                  <span>{isFollowed ? 'Seguindo' : 'Seguir'}</span>
                </button>

                {/* Botão Curtir (Usa handleLikeToggle) */}
                <button
                  onClick={handleLikeToggle}
                  disabled={isLikeLoading || isBlocked} // Não pode curtir se estiver bloqueado
                  className={`font-bold py-2 px-4 rounded-lg transition-colors w-full flex items-center justify-center gap-1.5
                    ${isLiked
                      ? 'bg-red-800 hover:bg-red-700 text-white'
                      : 'bg-gray-700 hover:bg-gray-600 text-white'
                    }
                    ${isLikeLoading || isBlocked ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  {isLikeLoading ? <Loader2 className="animate-spin w-5 h-5" /> : <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />}
                  <span>{likeCount}</span>
                </button>

                {/* --- NOVO (4/4): Adiciona 'isBlocked' ao Dropdown --- */}
                {/* Dropdown Denunciar/Bloquear */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="h-10 w-10 border-gray-700 hover:bg-gray-700" disabled={isBlockLoading}>
                      {isBlockLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <MoreVertical className="h-5 w-5" />}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-card border-gray-700 text-white w-40">
                    <DropdownMenuItem
                      className="flex gap-2 items-center cursor-pointer focus:bg-gray-700"
                      onClick={handleDenounceClick}
                      disabled={isBlocked} // Não pode denunciar se estiver bloqueado
                    >
                      <ShieldAlert className="w-4 h-4 text-yellow-500" />
                      <span>Denunciar</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className={`flex gap-2 items-center cursor-pointer focus:bg-gray-700 ${isBlocked ? 'focus:text-yellow-500' : 'focus:text-red-500'}`}
                      onClick={handleBlockToggle}
                      disabled={isBlockLoading}
                    >
                      ci   <UserX className={`w-4 h-4 ${isBlocked ? 'text-yellow-500' : 'text-red-500'}`} />
                      <span>{isBlocked ? 'Desbloquear' : 'Bloquear'}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

              </div>
            )}

            <span className="text-xs text-gray-500">{membershipDuration}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;

