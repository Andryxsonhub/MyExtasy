// src/services/api.ts (VERSÃO FINAL CORRIGIDA PARA VITE)

import axios from 'axios';

// Em projetos Vite, as variáveis de ambiente são acessadas via `import.meta.env`
// e precisam do prefixo VITE_ para serem expostas no código do cliente.
const baseURL = import.meta.env.VITE_API_URL || 'https://myextasyclub-backend.onrender.com';

// Log para depuração. Verifique o console do navegador para confirmar qual URL está sendo usada.
console.log(`AMBIENTE: ${import.meta.env.MODE}`);
console.log(`API Base URL: ${baseURL}`);

const api = axios.create({
  baseURL: baseURL,
});

// Interceptor para adicionar o token de autenticação em cada requisição.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para tratar erros de autenticação (401), deslogando o utilizador.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("Erro 401: Token inválido ou expirado. A deslogar.");
      localStorage.removeItem('authToken');
      
      if (window.location.pathname !== '/entrar') {
          window.location.href = '/entrar';
      }
    }
    return Promise.reject(error);
  }
);

export default api;