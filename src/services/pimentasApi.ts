// src/services/pimentasApi.ts
// --- ATUALIZADO (Adiciona 'transferirPimentas' e corrige o 'api') ---

// --- ★★★ CORREÇÃO: Importa o 'api' central em vez de criar um novo axios ★★★ ---
import api from './api'; 
// (Removemos: import axios from 'axios';)
// (Removemos: const API_URL = import.meta.env.VITE_API_URL;)
// (Removemos: const api = axios.create({ baseURL: API_URL });)

// Interface para definir o formato de um pacote de pimentas
interface PimentaPackage {
  id: number;
  name: string;
  priceInCents: number;
  pimentaAmount: number;
  createdAt: string;
}

// Função que busca a lista de pacotes da nossa API (Sua função original, agora usando o 'api' central)
export const fetchPimentaPackages = async (): Promise<PimentaPackage[]> => {
  try {
    const response = await api.get('/api/pimentas/packages'); // <-- Usa o 'api' central
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar pacotes de pimentas:", error);
    return [];
  }
};

// --- ★★★ NOVO (Fase 5): Adiciona a função de Transferência ★★★ ---

// Interface para a resposta da API de transferência
interface TransferResponse {
  message: string;
  novoSaldoDoador: number;
}

/**
 * Chama a API do backend para transferir pimentas (dar gorjeta) para outro usuário.
 * @param receptorId O ID do usuário (host da live) que vai RECEBER as pimentas.
 * @param valor A quantidade de pimentas a ser enviada.
 * @param contexto Uma string para o extrato (ex: 'presente_live').
 * @returns O novo saldo de pimentas do doador.
 */
export const transferirPimentas = async (
  receptorId: number, 
  valor: number, 
  contexto: string
): Promise<number> => {
  try {
    // Chama a rota 'POST /api/pimentas/transferir' que criámos no backend
    const { data } = await api.post<TransferResponse>('/pimentas/transferir', {
      receptorId,
      valor,
      contexto,
    });
    
    // Retorna o novo saldo do usuário logado (para o frontend atualizar a UI)
    return data.novoSaldoDoador;

  } catch (error) {
    console.error("Erro ao transferir pimentas:", error);
    // Lança o erro para o componente (LivePage) poder tratá-lo
    throw error;
  }
};
// --- ★★★ FIM DO NOVO ★★★ ---

