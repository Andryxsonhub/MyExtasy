// src/pages/UserProfilePage.tsx (VERSÃO ATUALIZADA)

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Layout from '../components/Layout';
import ProfileHeader from '../components/ProfileHeader';
import ProfileTabs from '../components/ProfileTabs';
import ProfileSidebar from '../components/ProfileSidebar';
import CreatePost from '../components/CreatePost';
import EditProfileModal from '../components/EditProfileModal';
import PostList from '../components/PostList';
import type { Post, UserData, Photo, Video } from '../types/types';
import UploadPhotoModal from '../components/UploadPhotoModal';
import UploadVideoModal from '../components/UploadVideoModal';
import AboutTabContent from '../components/tabs/AboutTabContent';
import PhotosTabContent from '../components/tabs/PhotosTabContent';
import VideosTabContent from '../components/tabs/VideosTabContent';
import CertificationModal from '../components/CertificationModal';
import StatsModal from '../components/StatsModal'; // NOVO: Importa o modal de estatísticas

const UserProfilePage: React.FC = () => {
  const navigate = useNavigate();
  
  const [userData, setUserData] = useState<UserData | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('posts');

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const openEditModal = () => setIsEditModalOpen(true);
  const closeEditModal = () => setIsEditModalOpen(false);
  
  const [isUploadPhotoModalOpen, setIsUploadPhotoModalOpen] = useState(false);
  const openUploadPhotoModal = () => setIsUploadPhotoModalOpen(true);
  const closeUploadPhotoModal = () => setIsUploadPhotoModalOpen(false);
  
  const [isUploadVideoModalOpen, setIsUploadVideoModalOpen] = useState(false);
  const openUploadVideoModal = () => setIsUploadVideoModalOpen(true);
  const closeUploadVideoModal = () => setIsUploadVideoModalOpen(false);

  const [isCertificationModalOpen, setIsCertificationModalOpen] = useState(false);
  const openCertificationModal = () => setIsCertificationModalOpen(true);
  const closeCertificationModal = () => setIsCertificationModalOpen(false);

  // NOVO: Estado e funções para o modal de estatísticas
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const openStatsModal = () => setIsStatsModalOpen(true);
  const closeStatsModal = () => setIsStatsModalOpen(false);

  const fetchData = useCallback(async () => {
    const token = localStorage.getItem('authToken');
    if (!token) { navigate('/entrar'); return; }
    try {
      setError(null);
      const [profileResponse, postsResponse, photosResponse, videosResponse] = await Promise.all([
        api.get('/users/profile'),
        api.get('/posts'),
        api.get('/users/photos'),
        api.get('/users/videos')
      ]);
      setUserData(profileResponse.data);
      setPosts(postsResponse.data);
      setPhotos(photosResponse.data);
      setVideos(videosResponse.data);
    } catch (err) {
      setError('Erro ao carregar os dados do perfil.');
      console.error('Erro ao buscar dados:', err);
    }
  }, [navigate]);
  
  const handleUpdateSuccess = (updatedUser: UserData) => { setUserData(updatedUser); };

  useEffect(() => {
    setIsLoading(true);
    fetchData().finally(() => setIsLoading(false));
  }, [fetchData]);

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
                <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />
                <div className="mt-6">
                  {activeTab === 'posts' && ( <> <CreatePost userProfilePicture={userData.profilePictureUrl} onPostCreated={fetchData} /> <div className="mt-8"> <PostList posts={posts} /> </div> </> )}
                  {activeTab === 'about' && <AboutTabContent user={userData} />}
                  {activeTab === 'photos' && <PhotosTabContent photos={photos} onAddPhotoClick={openUploadPhotoModal} />}
                  {activeTab === 'videos' && <VideosTabContent videos={videos} onAddVideoClick={openUploadVideoModal} />}
                </div>
              </div>
            </div>
            {/* NOVO: Passamos a nova função openStatsModal para o sidebar */}
            <div className="w-full md:w-1/3"> 
              <ProfileSidebar 
                user={userData} 
                onViewCertificationClick={openCertificationModal} 
                onViewStatsClick={openStatsModal}
              /> 
            </div>
          </div>
        )}
      </div>
      
      {/* Modais existentes */}
      <EditProfileModal isOpen={isEditModalOpen} onClose={closeEditModal} currentUser={userData} onUpdateSuccess={handleUpdateSuccess} />
      <UploadPhotoModal isOpen={isUploadPhotoModalOpen} onClose={closeUploadPhotoModal} onUploadSuccess={fetchData} />
      <UploadVideoModal isOpen={isUploadVideoModalOpen} onClose={closeUploadVideoModal} onUploadSuccess={fetchData} />
      <CertificationModal isOpen={isCertificationModalOpen} onClose={closeCertificationModal} user={userData} />

      {/* NOVO: Renderizamos o nosso novo modal de estatísticas */}
      <StatsModal isOpen={isStatsModalOpen} onClose={closeStatsModal} user={userData} />
    </Layout>
  );
};

export default UserProfilePage;