// src/pages/UserProfilePage.tsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Layout from '@/components/Layout';
import UserProfile from '@/components/UserProfile'; // Importamos o seu componente de perfil

// Interface para definir o formato dos dados do usuário que virão da API
interface UserData {
  id: number;
  name: string;
  email: string;
  bio: string | null; // A bio pode ser nula
  profile_picture_url: string | null;
}

const UserProfilePage: React.FC = () => {
  // useParams pega o 'userId' da URL (ex: /profile/4)
  const { userId } = useParams<{ userId: string }>(); 
  
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Função para buscar os dados do usuário na API
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        // Chamada para uma nova rota de API que ainda vamos criar
        const response = await axios.get(`http://localhost:3001/api/users/${userId}`);
        setUserData(response.data);
      } catch (err) {
        setError('Usuário não encontrado ou erro ao carregar o perfil.');
        console.error('Erro ao buscar perfil do usuário:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]); // Roda o efeito sempre que o userId na URL mudar

  return (
    <Layout>
      <div className="container mx-auto px-4 pt-24 pb-12">
        {isLoading && <p className="text-center text-white">Carregando perfil...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        
        {/* Se os dados foram carregados com sucesso, renderiza o seu componente UserProfile */}
        {userData && (
          <UserProfile 
            name={userData.name}
            email={userData.email}
            bio={userData.bio || 'Este usuário ainda não adicionou uma bio.'}
            profilePictureUrl={userData.profile_picture_url || 'https://avatar.iran.liara.run/public'}
          />
        )}
      </div>
    </Layout>
  );
};

export default UserProfilePage;