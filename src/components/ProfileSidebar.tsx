// src/components/ProfileSidebar.tsx (VERSÃO ATUALIZADA - Números clicáveis)

import React from 'react';
import { ChevronRight } from 'lucide-react';
// Garantir que a interface MonthlyStats em types.ts tenha 'likesReceived' e 'followers'
import type { UserData, MonthlyStats } from '../types/types';

// Definindo o tipo para a função de callback
export type StatType = 'followers' | 'following' | 'likers'; // Adicione 'following' se for implementado

interface ProfileSidebarProps {
  user: UserData;
  onViewCertificationClick: () => void;
  onViewStatsClick: () => void;
  // Nova prop para lidar com o clique nas estatísticas
  onStatClick: (statType: StatType, userId: number) => void;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
  user,
  onViewCertificationClick,
  onViewStatsClick,
  onStatClick // Recebe a nova função
}) => {
  const certificationLevel = user.certificationLevel ?? 0;

  // Usa um tipo mais específico para stats, incluindo os campos que esperamos
  const stats: Partial<MonthlyStats> = user.monthlyStats ?? {
    visits: 0,
    commentsReceived: 0,
    commentsMade: 0,
    likesReceived: 0, // Valor padrão
    followers: 0,     // Valor padrão
  };

  // Função auxiliar para tornar o código mais limpo
  const handleStatItemClick = (statType: StatType) => {
      // Só chama a função se o usuário realmente existir (evita erros)
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
        <button onClick={onViewCertificationClick} className="text-primary text-sm font-semibold mt-4 flex items-center w-full justify-end hover:underline">
          <span>Ver tudo</span>
          <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>

      {/* Bloco de Estatísticas (Atualizado com onClick) */}
      <div className="bg-card p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-white">Estatísticas do mês</h3>
          {/* O botão "Ver tudo" pode continuar abrindo o modal antigo de stats gerais */}
          <button onClick={onViewStatsClick} className="text-primary text-sm font-semibold hover:underline">Ver tudo</button>
        </div>

        <ul className="space-y-3">
          {/* Visitas (Não clicável por enquanto) */}
          <li className="flex justify-between items-center text-sm">
            <span className="text-gray-400">Visitas recebidas</span>
            <span className="text-white font-semibold">{stats.visits ?? 0}</span>
          </li>
          {/* Comentários (Não clicável por enquanto) */}
          <li className="flex justify-between items-center text-sm">
            <span className="text-gray-400">Comentários recebidos</span>
            <span className="text-white font-semibold">{stats.commentsReceived ?? 0}</span>
          </li>
          <li className="flex justify-between items-center text-sm">
            <span className="text-gray-400">Comentários feitos</span>
            <span className="text-white font-semibold">{stats.commentsMade ?? 0}</span>
          </li>

          {/* ==============================================
               MODIFICAÇÃO AQUI: Números clicáveis
              ============================================== */}

          {/* Curtidas Recebidas (Clicável) */}
          <li className="flex justify-between items-center text-sm">
            <span className="text-gray-400">Curtidas recebidas</span>
            {/* Adiciona um botão ou div com onClick */}
            <button
              onClick={() => handleStatItemClick('likers')}
              className="text-white font-semibold hover:text-primary hover:underline cursor-pointer"
              disabled={(stats.likesReceived ?? 0) === 0} // Desabilita se for 0
            >
              {stats.likesReceived ?? 0}
            </button>
          </li>

          {/* Seguidores (Clicável) */}
          <li className="flex justify-between items-center text-sm">
            <span className="text-gray-400">Seguidores</span>
            {/* Adiciona um botão ou div com onClick */}
             <button
              onClick={() => handleStatItemClick('followers')}
              className="text-white font-semibold hover:text-primary hover:underline cursor-pointer"
              disabled={(stats.followers ?? 0) === 0} // Desabilita se for 0
            >
              {stats.followers ?? 0}
            </button>
          </li>

          {/* Seguindo (Adicionar se necessário) */}
          {/*
          <li className="flex justify-between items-center text-sm">
            <span className="text-gray-400">Seguindo</span>
            <button
              onClick={() => handleStatItemClick('following')}
              className="text-white font-semibold hover:text-primary hover:underline cursor-pointer"
              disabled={(stats.following ?? 0) === 0}
            >
              {stats.following ?? 0}
            </button>
          </li>
          */}
           {/* ==============================================
               FIM DA MODIFICAÇÃO
              ============================================== */}

        </ul>
      </div>
    </div>
  );
};

export default ProfileSidebar;