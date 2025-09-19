// src/pages/UserProfilePage.tsx (Versão Completa com o CreatePost)

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '@/components/Layout';
import ProfileHeader from '@/components/ProfileHeader';
import ProfileTabs from '@/components/ProfileTabs';
import ProfileSidebar from '@/components/ProfileSidebar';
import CreatePost from '@/components/CreatePost'; // 1. IMPORTAMOS O NOVO COMPONENTE

// ... (interface UserData e a lógica do componente continuam iguais) ...
interface UserData {
  id: number;
  name: string;
  email: string;
  bio: string | null;
  profilePictureUrl: string | null;
  location: string | null;
}

const UserProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/entrar');
        return;
      }
      try {
        setIsLoading(true);
        const response = await axios.get('http://localhost:3001/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserData(response.data);
      } catch (err) {
        setError('Erro ao carregar o perfil.');
        console.error('Erro ao buscar perfil:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);


  return (
    <Layout>
      <div className="container mx-auto px-4 pt-24 pb-12">
        {isLoading && <p className="text-center text-white">Carregando seu perfil...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        
        {userData && <ProfileHeader user={userData} />}

        {!isLoading && !error && userData && (
          <div className="mt-8 flex flex-col md:flex-row gap-8">
            
            {/* --- Coluna Principal (Esquerda) --- */}
            <div className="w-full md:w-2/3">
              <div className="bg-card p-6 rounded-lg shadow-lg">
                <ProfileTabs />
                <div className="mt-6">
                   {/* 2. SUBSTITUÍMOS O TEXTO DE PLACEHOLDER PELO NOVO COMPONENTE */}
                   <CreatePost />
                   {/* Mais tarde, aqui também listaremos os posts existentes */}
                </div>
              </div>
            </div>

            {/* --- Barra Lateral (Direita) --- */}
            <div className="w-full md:w-1/3">
              <ProfileSidebar />
            </div>
            
          </div>
        )}
      </div>
    </Layout>
  );
};

export default UserProfilePage;