// src/services/chatApi.ts
// --- NOVO ARQUIVO (Fase 4 - Chat) ---
// Este arquivo centraliza todas as chamadas de API para o chat.

import api from './api';
import type { Message } from '../types/types';

/**
 * Busca o histórico de conversa entre o usuário logado e outro usuário.
 * @param otherUserId O ID do usuário com quem estamos conversando.
 * @returns Uma promessa com a lista de mensagens.
 */
export const fetchConversation = async (otherUserId: number): Promise<Message[]> => {
  try {
    const { data } = await api.get<Message[]>(`/messages/conversation/${otherUserId}`);
    return data;
  } catch (error) {
    console.error('Erro ao buscar histórico da conversa:', error);
    throw error;
  }
};

/**
 * Envia uma nova mensagem.
 * @param receiverId O ID do usuário que receberá a mensagem.
 * @param content O texto da mensagem.
 * @returns Uma promessa com a nova mensagem criada e o novo saldo de pimentas (se houver cobrança).
 */
export const sendMessage = async (receiverId: number, content: string): Promise<{ message: Message; newPimentaBalance: number | null }> => {
  try {
    // A rota no backend espera { receiverId, content }
    const { data } = await api.post<{ message: Message; newPimentaBalance: number | null }>('/messages/send', { 
      receiverId, 
      content 
    });
    return data;
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    // Lança o erro para o componente (ChatModal) poder tratar (ex: erro 403 de pimentas)
    throw error;
  }
};
