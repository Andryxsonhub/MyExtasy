// src/services/pimentasApi.ts

import axios from 'axios';

// Reutilizamos a URL base da API que já configuramos
const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL
});

// Interface para definir o formato de um pacote de pimentas
interface PimentaPackage {
  id: number;
  name: string;
  priceInCents: number;
  pimentaAmount: number;
  createdAt: string;
}

// Função que busca a lista de pacotes da nossa API
export const fetchPimentaPackages = async (): Promise<PimentaPackage[]> => {
  try {
    const response = await api.get('/api/pimentas/packages');
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar pacotes de pimentas:", error);
    // Retorna um array vazio em caso de erro para não quebrar a interface
    return [];
  }
};