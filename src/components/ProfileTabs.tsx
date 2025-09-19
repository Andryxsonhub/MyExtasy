// Arquivo: src/components/ProfileTabs.tsx (AGORA INTERATIVO)

import React from 'react';

interface ProfileTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({ activeTab, setActiveTab }) => {
  const tabs = ['Publicações', 'Sobre', 'Fotos', 'Videos', 'Amigos', 'Estatísticas'];

  return (
    <div className="border-b border-gray-700">
      <nav className="-mb-px flex space-x-8" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${
                activeTab === tab
                  ? 'border-purple-500 text-purple-400'
                  : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
              }
            `}
          >
            {tab}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default ProfileTabs;