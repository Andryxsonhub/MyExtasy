// src/components/StatsModal.tsx

import React from 'react';
import { X, BarChart2, Eye, MessageSquare, Edit3 } from 'lucide-react';
import type { UserData } from '../types/types';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserData | null;
}

const StatsModal: React.FC<StatsModalProps> = ({ isOpen, onClose, user }) => {
  if (!isOpen || !user) return null;

  // Pegamos os dados de estatísticas do objeto do usuário
  const stats = user.monthlyStats ?? { visits: 0, commentsReceived: 0, commentsMade: 0 };

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
        </ul>
      </div>
    </div>
  );
};

export default StatsModal;