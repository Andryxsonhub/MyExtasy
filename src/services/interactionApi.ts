// src/services/interactionApi.ts (VERSÃO FINAL REALMENTE COMPLETA)

import api from './api';
import { AxiosError } from 'axios';
import type { LikerUser } from '../types/types';

interface LikeToggleResponse {
  isLikedByMe: boolean;
  likeCount: number;
}
interface FollowToggleResponse {
  isFollowing: boolean;
}
interface BlockToggleResponse {
  isBlocked: boolean;
  updatedBlockedList: { blockedUserId: number }[];
}

/** Busca estatísticas privadas do usuário logado. */
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

/** Deleta um vídeo. */
export const deleteVideo = async (videoId: number): Promise<void> => { // Adicionado Promise<void>
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

/** Curte/descurte uma foto. */
export const togglePhotoLike = async (photoId: number): Promise<LikeToggleResponse> => {
  try {
    const { data } = await api.post<LikeToggleResponse>(`/media/photos/${photoId}/like`);
    return data;
  } catch (error: unknown) {
    console.error("Erro ao curtir/descurtir foto:", error);
    if (error instanceof AxiosError && error.response) {
       throw new Error(error.response.data?.message || "Não foi possível processar sua curtida na foto.");
    }
    throw new Error("Não foi possível processar sua curtida na foto.");
  }
};

/** Curte/descurte um vídeo. */
export const toggleVideoLike = async (videoId: number): Promise<LikeToggleResponse> => {
  try {
    const { data } = await api.post<LikeToggleResponse>(`/media/videos/${videoId}/like`);
    return data;
  } catch (error: unknown) {
    console.error("Erro ao curtir/descurtir vídeo:", error);
    if (error instanceof AxiosError && error.response) {
       throw new Error(error.response.data?.message || "Não foi possível processar sua curtida no vídeo.");
    }
    throw new Error("Não foi possível processar sua curtida no vídeo.");
  }
};

/** Segue/deixa de seguir um usuário. */
export const toggleFollowUser = async (userId: number): Promise<FollowToggleResponse> => {
  try {
    const { data } = await api.post<FollowToggleResponse>(`/interactions/${userId}/follow`);
    return data;
  } catch (error: unknown) {
    console.error("Erro ao seguir/deixar de seguir usuário:", error);
    let errorMessage = "Não foi possível processar a ação.";
    if (error instanceof AxiosError && error.response) {
       errorMessage = error.response.data?.message || errorMessage;
    }
    throw new Error(errorMessage);
  }
};

/** Curte/descurte um perfil. */
export const toggleProfileLike = async (userId: number): Promise<LikeToggleResponse> => {
    try {
      const { data } = await api.post<LikeToggleResponse>(`/interactions/profile/${userId}/like`);
      return data;
    } catch (error: unknown) {
      console.error("Erro ao curtir/descurtir perfil:", error);
      let errorMessage = "Não foi possível processar a curtida no perfil.";
      if (error instanceof AxiosError && error.response) {
         errorMessage = error.response.data?.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  };

/** Denuncia um usuário. */
export const denounceUser = async (userId: number, reason: string): Promise<{ message: string }> => { // Adicionado tipo de retorno
    try {
      const { data } = await api.post<{ message: string }>(`/interactions/${userId}/denounce`, { reason });
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

/** Bloqueia/desbloqueia um usuário. */
export const blockUser = async (userId: number): Promise<BlockToggleResponse> => {
    try {
      const { data } = await api.post<BlockToggleResponse>(`/interactions/${userId}/block`);
      return data;
    } catch (error: unknown) {
      console.error("Erro ao bloquear/desbloquear usuário:", error);
      let errorMessage = "Não foi possível processar o bloqueio.";
      if (error instanceof AxiosError && error.response) {
         errorMessage = error.response.data?.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
};

/** Busca a lista de usuários que curtiram uma foto. */
export const getPhotoLikers = async (photoId: number): Promise<LikerUser[]> => {
  try {
    const { data } = await api.get<LikerUser[]>(`/media/photos/${photoId}/likers`);
    return data; // <-- RETURN ESTAVA FALTANDO
  } catch (error: unknown) {
    console.error(`Erro ao buscar likers da foto ${photoId}:`, error);
    let errorMessage = "Não foi possível buscar quem curtiu.";
    if (error instanceof AxiosError && error.response) {
       errorMessage = error.response.data?.message || errorMessage;
    }
    throw new Error(errorMessage);
  }
};

/** Busca a lista de usuários que curtiram um vídeo. */
export const getVideoLikers = async (videoId: number): Promise<LikerUser[]> => {
  try {
    const { data } = await api.get<LikerUser[]>(`/media/videos/${videoId}/likers`);
    return data; // <-- RETURN ESTAVA FALTANDO
  } catch (error: unknown) {
    console.error(`Erro ao buscar likers do vídeo ${videoId}:`, error);
    let errorMessage = "Não foi possível buscar quem curtiu.";
    if (error instanceof AxiosError && error.response) {
       errorMessage = error.response.data?.message || errorMessage;
    }
    throw new Error(errorMessage);
  }
};