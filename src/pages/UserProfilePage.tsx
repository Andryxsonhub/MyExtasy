// src/pages/UserProfilePage.tsx (VERSÃO COMPLETA E FINAL COM VÍDEOS)

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
import UploadVideoModal from '../components/UploadVideoModal'; // 1. IMPORTAMOS O NOVO MODAL

// Definimos os tipos para uma Foto e um Vídeo
interface Photo {
  id: number; url: string; description: string | null; createdAt: string;
}
interface Video {
  id: number; url: string; description: string | null; createdAt: string;
}

const UserProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [videos, setVideos] = useState<Video[]>([]); // 2. CRIAMOS O ESTADO PARA VÍDEOS
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('posts');

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const openEditModal = () => setIsEditModalOpen(true);
  const closeEditModal = () => setIsEditModalOpen(false);

  const [isUploadPhotoModalOpen, setIsUploadPhotoModalOpen] = useState(false);
  const openUploadPhotoModal = () => setIsUploadPhotoModalOpen(true);
  const closeUploadPhotoModal = () => setIsUploadPhotoModalOpen(false);
  
  // 3. ADICIONAMOS O CONTROLE PARA O MODAL DE VÍDEO
  const [isUploadVideoModalOpen, setIsUploadVideoModalOpen] = useState(false);
  const openUploadVideoModal = () => setIsUploadVideoModalOpen(true);
  const closeUploadVideoModal = () => setIsUploadVideoModalOpen(false);

  const fetchData = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {  
      navigate('/entrar');  
      return;  
    }
    try {
      setError(null);
      
      // 4. ATUALIZAMOS A BUSCA PARA INCLUIR OS VÍDEOS
      const [profileResponse, postsResponse, photosResponse, videosResponse] = await Promise.all([
        api.get('/users/profile'),
        api.get('/posts'),
        api.get('/users/photos'),
        api.get('/users/videos') // <-- A NOVA CHAMADA DE API!
      ]);
      
      setUserData(profileResponse.data);
      setPosts(postsResponse.data);
      setPhotos(photosResponse.data);
      setVideos(videosResponse.data); // <-- GUARDAMOS OS VÍDEOS NO ESTADO

    } catch (err) {
      setError('Erro ao carregar os dados do perfil.');
      console.error('Erro ao buscar dados:', err);
    } finally {
      if (isLoading) setIsLoading(false);
    }
  };
  
  const handleUpdateSuccess = (updatedUser: UserData) => { setUserData(updatedUser); };

  useEffect(() => {
    setIsLoading(true);
    fetchData();
  }, [navigate]);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

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
                <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />
                <div className="mt-6">
                  {/* Abas de Posts e Sobre (sem mudanças) */}
                  {activeTab === 'posts' && ( <> <CreatePost userProfilePicture={userData.profilePictureUrl} onPostCreated={fetchData} /> <div className="mt-8"> <PostList posts={posts} /> </div> </> )}
                  {activeTab === 'about' && ( <div> <p className="text-white">Informações detalhadas do usuário virão aqui.</p> </div> )}
                  
                  {/* Aba de Fotos (sem mudanças) */}
                  {activeTab === 'photos' && (
                    <div>
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-2xl font-bold text-white">Minhas Fotos</h3>
                        <Button onClick={openUploadPhotoModal}> <PlusCircle className="w-4 h-4 mr-2" /> Adicionar Nova Foto </Button>
                      </div>
                      {photos.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                          {photos.map((photo) => ( <div key={photo.id} className="relative aspect-square bg-gray-800 rounded-lg overflow-hidden"> <img src={`${API_URL}${photo.url}`} alt={photo.description || 'Foto do usuário'} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" /> </div> ))}
                        </div>
                      ) : (
                        <div className="text-center text-gray-500 py-16 border-2 border-dashed border-gray-700 rounded-lg"> <p>Nenhuma foto publicada ainda.</p> <p className="text-sm mt-1">Que tal adicionar a primeira?</p> </div>
                      )}
                    </div>
                  )}

                  {/* 5. ATUALIZAMOS A VISUALIZAÇÃO DA ABA DE VÍDEOS */}
                  {activeTab === 'videos' && (
                     <div>
                       <div className="flex justify-between items-center mb-6">
                         <h3 className="text-2xl font-bold text-white">Meus Vídeos</h3>
                         <Button onClick={openUploadVideoModal}> <PlusCircle className="w-4 h-4 mr-2" /> Adicionar Novo Vídeo </Button>
                       </div>
                       {videos.length > 0 ? (
                         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                           {videos.map((video) => (
                             <div key={video.id} className="relative aspect-video bg-black rounded-lg overflow-hidden">
                               <video src={`${API_URL}${video.url}`} controls className="w-full h-full object-contain" />
                             </div>
                           ))}
                         </div>
                       ) : (
                         <div className="text-center text-gray-500 py-16 border-2 border-dashed border-gray-700 rounded-lg"> <p>Nenhum vídeo publicado ainda.</p> <p className="text-sm mt-1">Que tal adicionar o primeiro?</p> </div>
                       )}
                     </div>
                  )}
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/3"> <ProfileSidebar /> </div>
          </div>
        )}
      </div>
      
      {/* Modais existentes (sem mudanças) */}
      <EditProfileModal isOpen={isEditModalOpen} onClose={closeEditModal} currentUser={userData} onUpdateSuccess={handleUpdateSuccess} />
      <UploadPhotoModal isOpen={isUploadPhotoModalOpen} onClose={closeUploadPhotoModal} onUploadSuccess={fetchData} />
      
      {/* 6. ADICIONAMOS O NOVO MODAL DE VÍDEO À PÁGINA */}
      <UploadVideoModal isOpen={isUploadVideoModalOpen} onClose={closeUploadVideoModal} onUploadSuccess={fetchData} />
    </Layout>
  );
};

export default UserProfilePage;