// frontend/src/components/ProfileTabs.tsx

import React, { useState } from 'react';
import './ProfileTabs.css'; // Vamos criar este arquivo CSS em seguida

interface ProfileTabsProps {
  activeTab: string; // Para controlar qual aba está ativa (recebido de fora)
  onTabChange: (tabName: string) => void; // Para notificar o componente pai sobre a mudança de aba
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({ activeTab, onTabChange }) => {
  // Array de objetos para configurar nossas abas de forma fácil
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
      {/* Conteúdo da aba ativa será renderizado pelo componente pai */}
    </div>
  );
};

export default ProfileTabs;