// src/components/ProfileSidebar.tsx
// --- ATUALIZADO (Fase 6: Adiciona Bloco de Gerenciamento de Conta) ---

import React from 'react';
// --- NOVO: Importa ícones para o novo bloco ---
import { ChevronRight, Settings, AlertTriangle } from 'lucide-react';
import type { UserData, MonthlyStats } from '../types/types';

export type StatType = 'followers' | 'following' | 'likers'; 

interface ProfileSidebarProps {
  user: UserData;
  onViewCertificationClick: () => void;
  onViewStatsClick: () => void;
  onStatClick: (statType: StatType, userId: number) => void;
  // --- NOVAS PROPS ADICIONADAS ---
  isMyProfile: boolean; // Precisamos saber se este é o perfil do dono
  onOpenAccountModal: () => void; // Função para abrir o novo modal
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
  user,
  onViewCertificationClick,
  onViewStatsClick,
  onStatClick,
  isMyProfile, // Recebe a nova prop
  onOpenAccountModal // Recebe a nova prop
}) => {
  const certificationLevel = user.certificationLevel ?? 0;

  const stats: Partial<MonthlyStats> = user.monthlyStats ?? {
    visits: 0,
    commentsReceived: 0,
    commentsMade: 0,
    likesReceived: 0, 
    followers: 0,     
  };

  const handleStatItemClick = (statType: StatType) => {
      if(user?.id) {
          onStatClick(statType, user.id);
      } else {
          console.warn("ID do usuário não encontrado para abrir modal de estatísticas.");
      }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Bloco de Certificação (Sem alteração) */}
      <div className="bg-card p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-white">Nível de certificação</h3>
          <span className="text-sm font-bold text-primary">{certificationLevel}% completo</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div className="bg-primary h-2.5 rounded-full" style={{ width: `${certificationLevel}%` }}></div>
        </div>
        {/* Só mostra "Ver tudo" se for o perfil do próprio usuário */}
        {isMyProfile && (
          <button onClick={onViewCertificationClick} className="text-primary text-sm font-semibold mt-4 flex items-center w-full justify-end hover:underline">
            <span>Ver tudo</span>
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        )}
      </div>

      {/* Bloco de Estatísticas (Sem alteração) */}
      <div className="bg-card p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-white">Estatísticas do mês</h3>
          {/* Só mostra "Ver tudo" se for o perfil do próprio usuário */}
          {isMyProfile && (
            <button onClick={onViewStatsClick} className="text-primary text-sm font-semibold hover:underline">Ver tudo</button>
          )}
        </div>

        <ul className="space-y-3">
          <li className="flex justify-between items-center text-sm">
            <span className="text-gray-400">Visitas recebidas</span>
            <span className="text-white font-semibold">{stats.visits ?? 0}</span>
          </li>
          <li className="flex justify-between items-center text-sm">
            <span className="text-gray-400">Comentários recebidos</span>
            <span className="text-white font-semibold">{stats.commentsReceived ?? 0}</span>
          </li>
          <li className="flex justify-between items-center text-sm">
            <span className="text-gray-400">Comentários feitos</span>
            <span className="text-white font-semibold">{stats.commentsMade ?? 0}</span>
          </li>
          <li className="flex justify-between items-center text-sm">
            <span className="text-gray-400">Curtidas recebidas</span>
            <button
              onClick={() => handleStatItemClick('likers')}
              className="text-white font-semibold hover:text-primary hover:underline cursor-pointer"
              disabled={(stats.likesReceived ?? 0) === 0} 
            >
              {stats.likesReceived ?? 0}
            </button>
          </li>
          <li className="flex justify-between items-center text-sm">
            <span className="text-gray-400">Seguidores</span>
             <button
              onClick={() => handleStatItemClick('followers')}
              className="text-white font-semibold hover:text-primary hover:underline cursor-pointer"
              disabled={(stats.followers ?? 0) === 0} 
            >
              {stats.followers ?? 0}
            </button>
          </li>
        </ul>
      </div>

      {/* --- ★★★ NOVO BLOCO (Fase 6) ★★★ --- */}
      {/* Este bloco só aparece se for o SEU perfil */}
      {isMyProfile && (
        <div className="bg-card p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-bold text-white mb-4">Configurações</h3>
          <button 
            onClick={onOpenAccountModal}
            className="text-gray-400 text-sm font-semibold mt-2 flex items-center w-full justify-between hover:text-primary group"
          >
            <span>Gerenciamento da Conta</span>
            <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
          </button>
          
          {/* Você pode adicionar outros botões de configuração aqui depois, 
              como "Notificações" ou "Privacidade" */}

        </div>
      )}
      {/* --- ★★★ FIM DO NOVO BLOCO ★★★ --- */}

    </div>
  );
};

export default ProfileSidebar;
