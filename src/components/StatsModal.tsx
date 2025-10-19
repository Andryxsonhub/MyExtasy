// src/components/StatsModal.tsx
// --- CÓDIGO COMPLETO E ATUALIZADO (com Likes e Followers) ---

import React from 'react';
// 1. Importando os novos ícones
import { X, BarChart2, Eye, MessageSquare, Edit3, Heart, Users } from 'lucide-react';
import type { UserData } from '../types/types'; // Importa o tipo UserData atualizado

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserData | null;
}

const StatsModal: React.FC<StatsModalProps> = ({ isOpen, onClose, user }) => {
  if (!isOpen || !user) return null;

  // 2. Pegamos os dados de estatísticas, incluindo os novos campos (com fallback)
  const stats = user.monthlyStats ?? {
    visits: 0,
    commentsReceived: 0,
    commentsMade: 0,
    likesReceived: 0, // Adiciona fallback
    followers: 0,     // Adiciona fallback
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg shadow-xl w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X size={24} />
        </button>
        
        <div className="flex items-center mb-6">
            <BarChart2 className="w-6 h-6 text-pink-400 mr-3" />
            <h2 className="text-2xl font-bold text-white">Estatísticas do Mês</h2>
        </div>

        <p className="text-gray-400 mb-8">Este é um resumo da sua atividade e engajamento na plataforma durante o último mês.</p>

        <ul className="space-y-5">
          {/* Estatísticas Antigas (Sem alteração) */}
          <li className="flex items-center text-lg">
            <Eye className="w-5 h-5 text-gray-500 mr-4 flex-shrink-0" />
            <span className="text-white flex-grow">Visitas recebidas no seu perfil</span>
            <span className="font-bold text-pink-400">{stats.visits}</span>
          </li>
          <li className="flex items-center text-lg">
            <MessageSquare className="w-5 h-5 text-gray-500 mr-4 flex-shrink-0" />
            <span className="text-white flex-grow">Comentários recebidos</span>
            <span className="font-bold text-pink-400">{stats.commentsReceived}</span>
          </li>
          <li className="flex items-center text-lg">
            <Edit3 className="w-5 h-5 text-gray-500 mr-4 flex-shrink-0" />
            <span className="text-white flex-grow">Comentários que você fez</span>
            <span className="font-bold text-pink-400">{stats.commentsMade}</span>
          </li>

          {/* --- 3. NOVAS ESTATÍSTICAS ADICIONADAS AQUI --- */}
          <li className="flex items-center text-lg">
            <Heart className="w-5 h-5 text-gray-500 mr-4 flex-shrink-0" />
            <span className="text-white flex-grow">Curtidas recebidas</span>
            {/* Usamos '?? 0' como fallback extra, caso o campo não venha */}
            <span className="font-bold text-pink-400">{stats.likesReceived ?? 0}</span>
          </li>
          <li className="flex items-center text-lg">
            <Users className="w-5 h-5 text-gray-500 mr-4 flex-shrink-0" />
            <span className="text-white flex-grow">Seguidores</span>
            <span className="font-bold text-pink-400">{stats.followers ?? 0}</span>
          </li>
          {/* --- FIM DAS NOVAS ESTATÍSTICAS --- */}

        </ul>
      </div>
    </div>
  );
};

export default StatsModal;