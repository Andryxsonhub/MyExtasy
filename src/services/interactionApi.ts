// src/services/interactionApi.ts (VERSÃO FINAL CORRIGIDA - 26/10/2025)

import api from './api'; // Importa sua instância principal do Axios
import { AxiosError } from 'axios';

/**
 * [EXISTENTE] Busca as estatísticas privadas do usuário logado.
 * Rota: GET /api/interactions/me/stats
 */
export const fetchMyStats = async () => {
  try {
    const { data } = await api.get('/interactions/me/stats'); 
    return data;
  } catch (error: unknown) {
    console.error("Erro ao buscar estatísticas (serviço):", error);
    let errorMessage = "Não foi possível buscar suas estatísticas.";
    if (error instanceof AxiosError && error.response) {
      errorMessage = error.response.data?.message || errorMessage;
    }
    throw new Error(errorMessage);
  }
};

/**
 * [EXISTENTE] Tenta deletar um vídeo.
 * Rota: DELETE /api/users/videos/:videoId (Esta rota está em 'userRoutes' ou 'mediaRoutes')
 */
export const deleteVideo = async (videoId: number) => {
  try {
    await api.delete(`/users/videos/${videoId}`); 
  } catch (error: unknown) {
    console.error("Erro ao deletar vídeo (serviço):", error);
    let errorMessage = "Não foi possível apagar o vídeo. Tente novamente.";
    if (error instanceof AxiosError && error.response) {
      errorMessage = error.response.data?.message || errorMessage;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    throw new Error(errorMessage);
  }
};

/**
 * [EXISTENTE] Curte/descurte uma foto (da galeria).
 * Rota: POST /api/photos/:photoId/like (Esta rota está em 'mediaRoutes')
 */
export const togglePhotoLike = async (photoId: number) => {
  try {
    const { data } = await api.post(`/photos/${photoId}/like`);
    return data;
  } catch (error: unknown) {
    console.error("Erro ao curtir/descurtir foto:", error);
    if (error instanceof AxiosError && error.response) {
       throw new Error(error.response.data?.message || "Não foi possível processar sua curtida na foto.");
    }
    throw new Error("Não foi possível processar sua curtida na foto.");
  }
};

/**
 * [EXISTENTE] Curte/descurte um vídeo (da galeria).
 * Rota: POST /api/videos/:videoId/like (Esta rota está em 'mediaRoutes')
 */
export const toggleVideoLike = async (videoId: number) => {
  try {
    const { data } = await api.post(`/videos/${videoId}/like`);
    return data;
  } catch (error: unknown) {
    console.error("Erro ao curtir/descurtir vídeo:", error);
    if (error instanceof AxiosError && error.response) {
       throw new Error(error.response.data?.message || "Não foi possível processar sua curtida no vídeo.");
    }
    throw new Error("Não foi possível processar sua curtida no vídeo.");
  }
};


// ----------------------------------------------------
// Funções que o ProfileHeader.tsx (Cabeçalho do Perfil) usa
// ----------------------------------------------------

/**
 * [CORRIGIDO] Função para seguir/deixar de seguir (Toggle).
 * Rota: POST /api/interactions/:userId/follow
 */
export const toggleFollowUser = async (userId: number) => {
  try {
    const { data } = await api.post(`/interactions/${userId}/follow`);
    return data; // Retorna { isFollowing: boolean }
  } catch (error: unknown) {
    console.error("Erro ao seguir/deixar de seguir usuário:", error);
    let errorMessage = "Não foi possível processar a ação.";
    if (error instanceof AxiosError && error.response) {
       errorMessage = error.response.data?.message || errorMessage;
    }
    throw new Error(errorMessage);
  }
};

/**
 * [NOVA] Função para curtir/descurtir um PERFIL (Toggle).
 * Rota: POST /api/interactions/profile/:userId/like
 */
export const toggleProfileLike = async (userId: number) => {
    try {
      const { data } = await api.post(`/interactions/profile/${userId}/like`);
      return data; // Retorna { isLikedByMe: boolean, likeCount: number }
    } catch (error: unknown) {
      console.error("Erro ao curtir/descurtir perfil:", error);
      let errorMessage = "Não foi possível processar a curtida no perfil.";
      if (error instanceof AxiosError && error.response) {
         errorMessage = error.response.data?.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  };

/**
 * [NOVA - F03] Função para denunciar um usuário.
 * Rota: POST /api/interactions/:userId/denounce
 */
export const denounceUser = async (userId: number, reason: string) => {
    try {
      const { data } = await api.post(`/interactions/${userId}/denounce`, { reason });
      return data;
    } catch (error: unknown) {
      console.error("Erro ao denunciar usuário:", error);
      let errorMessage = "Não foi possível enviar a denúncia.";
      if (error instanceof AxiosError && error.response) {
         errorMessage = error.response.data?.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  };
  
/**
 * [NOVA - F04] Função para bloquear/desbloquear um usuário (Toggle).
 * Rota: POST /api/interactions/:userId/block
 */
export const blockUser = async (userId: number) => {
    try {
      const { data } = await api.post(`/interactions/${userId}/block`);
      return data; // Retorna { isBlocked: boolean, updatedBlockedList: [...] }
    } catch (error: unknown) {
      console.error("Erro ao bloquear/desbloquear usuário:", error);
      let errorMessage = "Não foi possível processar o bloqueio.";
      if (error instanceof AxiosError && error.response) {
         errorMessage = error.response.data?.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
};