// src/services/pimentasApi.ts
// --- ★★★ CORREÇÃO 10/11: Adicionado 'roomName' ★★★ ---

import api from './api'; 

interface PimentaPackage {
  id: number;
  name: string;
  priceInCents: number;
  pimentaAmount: number;
  createdAt: string;
}

export const fetchPimentaPackages = async (): Promise<PimentaPackage[]> => {
  try {
    const response = await api.get('/api/pimentas/packages'); 
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar pacotes de pimentas:", error);
    return [];
  }
};

interface TransferResponse {
  message: string;
  novoSaldoDoador: number;
}

/**
 * Chama a API do backend para transferir pimentas (dar gorjeta) para outro usuário.
 * @param receptorId O ID do usuário (host da live) que vai RECEBER as pimentas.
 * @param valor A quantidade de pimentas a ser enviada.
 * @param contexto Uma string para o extrato (ex: 'presente_live').
 * @param roomName Opcional: A sala da live (ex: 'live-1'), usado pelo socket.
 */
export const transferirPimentas = async (
  receptorId: number, 
  valor: number, 
  contexto: string,
  // ★★★ CORREÇÃO: Adicionamos 'roomName' como 4º argumento ★★★
  roomName?: string
): Promise<number> => {
  try {
    // Chama a rota 'POST /api/pimentas/transferir'
    const { data } = await api.post<TransferResponse>('/pimentas/transferir', {
      receptorId,
      valor,
      contexto,
      // ★★★ CORREÇÃO: Enviamos 'roomName' no corpo da requisição ★★★
      roomName,
    });
    
    // Retorna o novo saldo do DOADOR
    return data.novoSaldoDoador;

  } catch (error) {
    console.error("Erro ao transferir pimentas:", error);
    throw error;
  }
};