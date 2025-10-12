// src/components/ProfileSidebar.tsx (VERSÃO ATUALIZADA)

import React from 'react';
import { ChevronRight } from 'lucide-react';
import type { UserData } from '../types/types';

interface ProfileSidebarProps {
  user: UserData;
  onViewCertificationClick: () => void;
  onViewStatsClick: () => void; // NOVO: Prop para o clique das estatísticas
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ user, onViewCertificationClick, onViewStatsClick }) => {
  const certificationLevel = user.certificationLevel ?? 0;
  const stats = user.monthlyStats ?? { visits: 0, commentsReceived: 0, commentsMade: 0 };

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-card p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-white">Nível de certificação</h3>
          <span className="text-sm font-bold text-primary">{certificationLevel}% completo</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div className="bg-primary h-2.5 rounded-full" style={{ width: `${certificationLevel}%` }}></div>
        </div>
        <button onClick={onViewCertificationClick} className="text-primary text-sm font-semibold mt-4 flex items-center w-full justify-end hover:underline">
          <span>Ver tudo</span>
          <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>

      <div className="bg-card p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-white">Estatísticas do mês</h3>
          {/* O botão agora chama a nova função */}
          <button onClick={onViewStatsClick} className="text-primary text-sm font-semibold hover:underline">Ver tudo</button>
        </div>
        <ul className="space-y-3">
          <li className="flex justify-between items-center text-sm">
            <span className="text-gray-400">Visitas recebidas</span>
            <span className="text-white font-semibold">{stats.visits}</span>
          </li>
          <li className="flex justify-between items-center text-sm">
            <span className="text-gray-400">Comentários recebidos</span>
            <span className="text-white font-semibold">{stats.commentsReceived}</span>
          </li>
          <li className="flex justify-between items-center text-sm">
            <span className="text-gray-400">Comentários feitos</span>
            <span className="text-white font-semibold">{stats.commentsMade}</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ProfileSidebar;