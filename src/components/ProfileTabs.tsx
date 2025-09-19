// src/components/ProfileTabs.tsx

import React, { useState } from 'react';

const TABS = ['Publicações', 'Sobre', 'Fotos', 'Vídeos', 'Amigos', 'Estatísticas'];

const ProfileTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Publicações');

  return (
    <div className="border-b border-border">
      <nav className="-mb-px flex space-x-6" aria-label="Tabs">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
              ${
                activeTab === tab
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-300'
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