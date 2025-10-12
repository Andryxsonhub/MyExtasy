// src/components/ProfileTabs.tsx (VERSÃO CORRIGIDA)

import React from 'react';
// Seu arquivo CSS pode ser importado via Tailwind ou um arquivo .css separado
// import './ProfileTabs.css'; 

// ALTERAÇÃO 1: Renomeamos 'onTabChange' para 'setActiveTab'
interface ProfileTabsProps {
  activeTab: string;
  setActiveTab: (tabName: string) => void; 
}

// ALTERAÇÃO 2: Recebemos 'setActiveTab' como propriedade
const ProfileTabs: React.FC<ProfileTabsProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { name: 'Publicações', id: 'posts' },
    { name: 'Sobre', id: 'about' },
    { name: 'Fotos', id: 'photos' },
    { name: 'Vídeos', id: 'videos' },
  ];

  return (
    <div className="border-b border-gray-700">
      <nav className="-mb-px flex space-x-8" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            // ALTERAÇÃO 3: Chamamos a função correta no clique
            onClick={() => setActiveTab(tab.id)}
            className={`${
              activeTab === tab.id
                ? 'border-pink-500 text-pink-400'
                : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
          >
            {tab.name}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default ProfileTabs;