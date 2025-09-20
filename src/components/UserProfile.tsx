// Arquivo: src/pages/UserProfilePage.tsx (VERSÃO FINAL E SIMPLIFICADA)

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; // ALTERAÇÃO 1: Importa a instância 'api'
import Layout from '../components/Layout';
import ProfileHeader from '../components/ProfileHeader';
import ProfileTabs from '../components/ProfileTabs';
import ProfileSidebar from '../components/ProfileSidebar';
import CreatePost from '../components/CreatePost';
import EditProfileModal from '../components/EditProfileModal';
import PostList from '../components/PostList';

// Interface para um único Post
interface Post {
  id: number;
  content: string;
  createdAt: string;
}

// Interface para os dados do Usuário
interface UserData {
  id: number; name: string; email: string; bio: string | null; profilePictureUrl: string | null; location: string | null; gender: string | null; createdAt: string; lastSeenAt: string | null;
}

const UserProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Publicações');

  const openEditModal = () => setIsEditModalOpen(true);
  const closeEditModal = () => setIsEditModalOpen(false);
  const handleUpdateSuccess = (updatedUser: UserData) => { setUserData(updatedUser); };

  useEffect(() => {
    const fetchData = async () => {
      // ALTERAÇÃO 2: Verificamos o token, mas não precisamos mais passá-lo manualmente!
      const token = localStorage.getItem('authToken');
      if (!token) { navigate('/entrar'); return; }
      
      try {
        setIsLoading(true);
        // ALTERAÇÃO 3: As linhas para criar o 'config' foram REMOVIDAS.
        // O interceptor do 'api.ts' vai cuidar disso automaticamente.

        // ALTERAÇÃO 4: As chamadas agora são muito mais limpas, sem URLs e sem 'config'.
        const [profileResponse, postsResponse] = await Promise.all([
          api.get('/users/profile'),
          api.get('/posts')
        ]);
        
        setUserData(profileResponse.data);
        setPosts(postsResponse.data);

      } catch (err) {
        setError('Erro ao carregar os dados do perfil.');
        console.error('Erro ao buscar dados:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  return (
    <Layout>
      <div className="container mx-auto px-4 pt-24 pb-12">
        {isLoading && <p className="text-center text-white">Carregando seu perfil...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        
        {userData && <ProfileHeader user={userData} onEditClick={openEditModal} />}

        {!isLoading && !error && userData && (
          <div className="mt-8 flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-2/3">
              <div className="bg-card p-6 rounded-lg shadow-lg">
                <ProfileTabs 
                  activeTab={activeTab} 
                  setActiveTab={setActiveTab} 
                />
                <div className="mt-6">
                    <CreatePost />
                    
                    <div className="mt-8">
                      {activeTab === 'Publicações' && <PostList posts={posts} />}
                      {activeTab === 'Sobre' && <div><p className="text-white">Informações detalhadas do usuário virão aqui.</p></div>}
                      {activeTab === 'Fotos' && <div><p className="text-white">A galeria de fotos virá aqui.</p></div>}
                    </div>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/3">
              <ProfileSidebar />
            </div>
          </div>
        )}
      </div>

      <EditProfileModal 
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        currentUser={userData}
        onUpdateSuccess={handleUpdateSuccess}
      />
    </Layout>
  );
};

export default UserProfilePage;