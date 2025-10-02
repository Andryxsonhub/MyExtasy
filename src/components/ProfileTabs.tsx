// src/components/ProfileTabs.tsx (VERSÃO FINAL LIMPA)

// ALTERAÇÃO: Removemos o '{ useState }' que não estava sendo usado.
import React from 'react';
import './ProfileTabs.css';

interface ProfileTabsProps {
  activeTab: string;
  onTabChange: (tabName: string) => void;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { name: 'Publicações', id: 'posts' },
    { name: 'Sobre', id: 'about' },
    { name: 'Fotos', id: 'photos' },
    { name: 'Vídeos', id: 'videos' },
  ];

  return (
    <div className="profile-tabs-container">
      <div className="profile-tabs-nav">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProfileTabs;