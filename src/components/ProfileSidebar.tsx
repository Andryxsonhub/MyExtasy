// src/components/ProfileSidebar.tsx

import React from 'react';
import { ChevronRight } from 'lucide-react'; // Ícone de seta

const ProfileSidebar: React.FC = () => {
  return (
    <div className="flex flex-col gap-8">
      {/* Widget de Nível de Certificação */}
      <div className="bg-card p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-white">Nível de certificação</h3>
          <span className="text-sm font-bold text-primary">0% completo</span>
        </div>
        {/* Barra de Progresso Simples */}
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div className="bg-primary h-2.5 rounded-full" style={{ width: '0%' }}></div>
        </div>
        <button className="text-primary text-sm font-semibold mt-4 flex items-center w-full justify-end hover:underline">
          <span>Ver tudo</span>
          <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>

      {/* Widget de Estatísticas */}
      <div className="bg-card p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-white">Estatísticas do mês</h3>
          <button className="text-primary text-sm font-semibold hover:underline">Ver tudo</button>
        </div>
        <ul className="space-y-3">
          <li className="flex justify-between items-center text-sm">
            <span className="text-gray-400">Visitas recebidas</span>
            <span className="text-white font-semibold">0</span>
          </li>
          <li className="flex justify-between items-center text-sm">
            <span className="text-gray-400">Comentários recebidos</span>
            <span className="text-white font-semibold">0</span>
          </li>
          <li className="flex justify-between items-center text-sm">
            <span className="text-gray-400">Comentários feitos</span>
            <span className="text-white font-semibold">0</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ProfileSidebar;