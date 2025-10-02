// src/pages/UserProfilePage.tsx (VERSÃO ABSOLUTAMENTE COMPLETA E FINAL)

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Layout from '../components/Layout';
import ProfileHeader from '../components/ProfileHeader';
import ProfileTabs from '../components/ProfileTabs';
import ProfileSidebar from '../components/ProfileSidebar';
import CreatePost from '../components/CreatePost';
import EditProfileModal from '../components/EditProfileModal';
import PostList from '../components/PostList';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import type { UserData, Post } from '../types/types';
import UploadPhotoModal from '../components/UploadPhotoModal';

const UserProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('posts');

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const openEditModal = () => setIsEditModalOpen(true);
  const closeEditModal = () => setIsEditModalOpen(false);

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const openUploadModal = () => setIsUploadModalOpen(true);
  const closeUploadModal = () => setIsUploadModalOpen(false);

  const fetchData = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) { 
      navigate('/entrar'); 
      return; 
    }
    
    try {
      // Não resetamos o loading aqui para a atualização ser mais suave
      setError(null);
      
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
      // Garantimos que o loading inicial termine
      if (isLoading) setIsLoading(false);
    }
  };
  
  const handleUpdateSuccess = (updatedUser: UserData) => { 
    setUserData(updatedUser); 
  };

  useEffect(() => {
    // Definimos isLoading como true apenas na primeira carga
    setIsLoading(true);
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
                  onTabChange={setActiveTab}
                />
                <div className="mt-6">
                  {activeTab === 'posts' && (
                    <>
                      <CreatePost 
                        userProfilePicture={userData.profilePictureUrl}
                        onPostCreated={fetchData}
                      />
                      <div className="mt-8">
                        <PostList posts={posts} />
                      </div>
                    </>
                  )}
                  
                  {activeTab === 'about' && (
                    <div>
                      <p className="text-white">Informações detalhadas do usuário virão aqui.</p>
                    </div>
                  )}
                  
                  {activeTab === 'photos' && (
                    <div>
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-2xl font-bold text-white">Minhas Fotos</h3>
                        <Button onClick={openUploadModal}>
                          <PlusCircle className="w-4 h-4 mr-2" />
                          Adicionar Nova Foto
                        </Button>
                      </div>
                      <div className="text-center text-gray-500 py-16 border-2 border-dashed border-gray-700 rounded-lg">
                        <p>Nenhuma foto publicada ainda.</p>
                        <p className="text-sm mt-1">Que tal adicionar a primeira?</p>
                      </div>
                    </div>
                  )}

                   {activeTab === 'videos' && (
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-6">Meus Vídeos</h3>
                      <div className="text-center text-gray-500 py-16 border-2 border-dashed border-gray-700 rounded-lg">
                        <p>Nenhum vídeo publicado ainda.</p>
                      </div>
                    </div>
                  )}
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
      
      <UploadPhotoModal 
        isOpen={isUploadModalOpen} 
        onClose={closeUploadModal}
        onUploadSuccess={fetchData} 
      />
    </Layout>
  );
};

export default UserProfilePage;