// src/services/api.js (VERSÃO DE DEPURAÇÃO)

import axios from 'axios';

const baseURL = `${import.meta.env.VITE_API_URL || 'https://myextasyclub-backend.onrender.com'}/api`;

const api = axios.create({
  baseURL: baseURL,
});

// Interceptor de Requisição (Onde a mágica deveria acontecer)
api.interceptors.request.use(
  (config) => {
    // --- NOSSO ESPIÃO ESTÁ AQUI ---
    console.log('--- INTERCEPTOR DE REQUISIÇÃO ATIVADO ---');
    console.log('URL da Requisição:', config.url);
    
    const token = localStorage.getItem('authToken');
    
    if (token) {
      console.log('✅ Token encontrado no localStorage. Adicionando ao cabeçalho.');
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.log('❌ ATENÇÃO: Nenhum token encontrado no localStorage no momento da requisição.');
    }
    console.log('-----------------------------------------');
    // --- FIM DO ESPIÃO ---
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de Resposta (Não precisa mudar, mas deixamos aqui)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("Erro 401: Token inválido ou expirado. Deslogando.");
      localStorage.removeItem('authToken');
      if (window.location.pathname !== '/entrar') {
        window.location.href = '/entrar';
      }
    }
    return Promise.reject(error);
  }
);

export default api;