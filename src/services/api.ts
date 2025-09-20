// Arquivo: src/services/api.ts (VERSÃO TURBINADA COM INTERCEPTOR)

import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

// A MÁGICA ACONTECE AQUI (INTERCEPTOR)
// Isso vai ser executado ANTES de TODA requisição que usar a instância 'api'
api.interceptors.request.use(
  (config) => {
    // 1. Pega o token do localStorage
    const token = localStorage.getItem('authToken');
    
    // 2. Se o token existir, adiciona ao cabeçalho de autorização
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // 3. Retorna a configuração atualizada para a requisição prosseguir
    return config;
  },
  (error) => {
    // Em caso de erro na configuração, rejeita a promessa
    return Promise.reject(error);
  }
);

export default api;