// src/services/interactionApi.ts
// --- CÓDIGO FINALMENTE COMPLETO E CORRIGIDO (Tipo + ESLint) ---

import axios, { AxiosInstance, AxiosError } from 'axios'; // Importar AxiosInstance e AxiosError

// -----------------------------------------------------------------
// CONFIGURAÇÃO DA API
// -----------------------------------------------------------------

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333';

const getAuthToken = () => {
  const token = localStorage.getItem('authToken');
  return token;
};

// Instância base para /api/interactions
const apiClient = axios.create({
  baseURL: `${API_URL}/api/interactions`,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Tipo correto para a instância
let mainApiClientInstance: AxiosInstance | null = null;

const getMainApiClient = async (): Promise<AxiosInstance> => { // Adicionado tipo de retorno Promise<AxiosInstance>
    if (!mainApiClientInstance) {
        try {
            const apiModule = await import('../services/api');
            mainApiClientInstance = apiModule.default; // Acessa a exportação padrão
            if (!mainApiClientInstance || typeof mainApiClientInstance.delete !== 'function') { // Verifica se é uma instância válida
                throw new Error("Importação de 'api' não retornou uma instância Axios válida.");
            }
        } catch(e) {
            console.warn("Instância principal 'api' não encontrada ou falhou ao importar, usando apiClient de interactions para /users. Ajuste se necessário.", e);
            // Fallback: Cria uma nova instância apontando para a raiz /api
            mainApiClientInstance = axios.create({ baseURL: `${API_URL}/api` });
            mainApiClientInstance.interceptors.request.use(
              (config) => {
                const token = getAuthToken();
                if (token) {
                  config.headers['Authorization'] = `Bearer ${token}`;
                }
                return config;
              },
              (error) => {
                return Promise.reject(error);
              }
            );
        }
    }
    // Garante que nunca retornará null aqui, pois criamos um fallback
    if (!mainApiClientInstance) {
         throw new Error("Falha crítica: Não foi possível obter uma instância da API.");
    }
    return mainApiClientInstance;
}


// -----------------------------------------------------------------
// FUNÇÕES DA API (Like, Follow, Stats) - Com 'unknown' no catch
// -----------------------------------------------------------------

export const fetchMyStats = async () => {
  try {
    const { data } = await apiClient.get('/me/stats');
    return data;
  } catch (error: unknown) {
    console.error('Erro ao buscar estatísticas:', error);
    let errorMessage = 'Não foi possível carregar as estatísticas.';
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message?: string }>;
        errorMessage = axiosError.response?.data?.message || axiosError.message;
    } else if (error instanceof Error) {
        errorMessage = error.message;
    }
    throw new Error(errorMessage);
  }
};

export const followUser = async (userId: number | string) => {
  try {
    const { data } = await apiClient.post(`/${userId}/follow`);
    return data;
  } catch (error: unknown) {
    console.error('Erro ao seguir usuário:', error);
    let errorMessage = 'Erro ao seguir usuário.';
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ error?: string }>;
        errorMessage = axiosError.response?.data?.error || axiosError.message;
    } else if (error instanceof Error) {
        errorMessage = error.message;
    }
    throw new Error(errorMessage);
  }
};

export const unfollowUser = async (userId: number | string) => {
  try {
    await apiClient.delete(`/${userId}/unfollow`);
    return true;
  } catch (error: unknown) {
    console.error('Erro ao deixar de seguir usuário:', error);
    let errorMessage = 'Erro ao deixar de seguir usuário.';
     if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ error?: string }>;
        errorMessage = axiosError.response?.data?.error || axiosError.message;
    } else if (error instanceof Error) {
        errorMessage = error.message;
    }
    throw new Error(errorMessage);
  }
};

export const likeProfile = async (userId: number | string) => {
  try {
    const { data } = await apiClient.post(`/${userId}/like`);
    return data;
  } catch (error: unknown) {
    console.error('Erro ao curtir perfil:', error);
    let errorMessage = 'Erro ao curtir perfil.';
     if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ error?: string }>;
        errorMessage = axiosError.response?.data?.error || axiosError.message;
    } else if (error instanceof Error) {
        errorMessage = error.message;
    }
    throw new Error(errorMessage);
  }
};

export const unlikeProfile = async (userId: number | string) => {
  try {
    await apiClient.delete(`/${userId}/unlike`);
    return true;
  } catch (error: unknown) {
    console.error('Erro ao descurtir perfil:', error);
    let errorMessage = 'Erro ao descurtir perfil.';
     if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ error?: string }>;
        errorMessage = axiosError.response?.data?.error || axiosError.message;
    } else if (error instanceof Error) {
        errorMessage = error.message;
    }
    throw new Error(errorMessage);
  }
};


/**
 * Deleta um vídeo do usuário logado.
 * @param videoId - O ID do vídeo a ser deletado.
 */
export const deleteVideo = async (videoId: number | string) => {
  try {
    const api = await getMainApiClient(); // A função agora garante que retorna AxiosInstance
    // DELETE /api/users/videos/:id
    const response = await api.delete(`/users/videos/${videoId}`);

    if (response.status === 200 || response.status === 204) {
      console.log(`Vídeo ${videoId} deletado com sucesso.`);
      return true; // Sucesso
    } else {
      console.error('Erro inesperado ao deletar vídeo:', response);
      throw new Error(response.data?.message || 'Erro inesperado do servidor.');
    }

  } catch (error: unknown) {
    console.error('Erro na chamada API para deletar vídeo:', error);
    let errorMessage = 'Falha ao deletar vídeo.';
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message?: string }>;
        errorMessage = axiosError.response?.data?.message || axiosError.message;
    } else if (error instanceof Error) {
        errorMessage = error.message;
    }
    throw new Error(errorMessage);
  }
};