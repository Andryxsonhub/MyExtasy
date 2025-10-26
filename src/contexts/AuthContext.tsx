// src/contexts/AuthContext.ts (VERSÃO FINAL CORRIGIDA)

import { createContext } from 'react';
// 1. Importa o tipo principal do seu 'types.ts'
import type { AuthContextType } from '../types/types'; 

/**
 * Cria o Contexto.
 * O tipo (AuthContextType) vem do types.ts e garante que o 'user'
 * será do tipo UserData (com 'following' e 'blockedUsers').
 */
export const AuthContext = createContext<AuthContextType | undefined>(undefined);