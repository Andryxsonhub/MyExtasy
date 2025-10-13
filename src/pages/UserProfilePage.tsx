// src/pages/UserProfilePage.tsx (VERSÃO 100% COMPLETA COM REGISTRO DE VISITA)

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
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
import StatsModal from '../components/StatsModal';
import { useAuth } from '../contexts/AuthProvider';

const UserProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const location = useLocation();
  const { user: loggedInUser } = useAuth();

  const [profileData, setProfileData] = useState<UserData | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('posts');
  const [isMyProfile, setIsMyProfile] = useState(false);

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

  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const openStatsModal = () => setIsStatsModalOpen(true);
  const closeStatsModal = () => setIsStatsModalOpen(false);

  const fetchData = useCallback(async () => {
    const isViewingOwnProfile = !!(location.pathname === '/meu-perfil' || (userId && loggedInUser && parseInt(userId, 10) === loggedInUser.id));
    setIsMyProfile(isViewingOwnProfile);

    const profileUrl = isViewingOwnProfile ? '/users/profile' : `/users/profile/${userId}`;
    const postsUrl = '/posts'; 
    const photosUrl = '/users/photos';
    const videosUrl = '/users/videos';

    try {
      setIsLoading(true);
      setError(null);
      
      const [profileResponse, postsResponse, photosResponse, videosResponse] = await Promise.all([
        api.get(profileUrl),
        api.get(postsUrl),
        api.get(photosUrl),
        api.get(videosUrl)
      ]);
      
      setProfileData(profileResponse.data);
      setPosts(postsResponse.data);
      setPhotos(photosResponse.data);
      setVideos(videosResponse.data);
      setVideos(videosResponse.data);

    } catch (err) {
      setError('Erro ao carregar os dados do perfil.');
      console.error('Erro ao buscar dados:', err);
      navigate('/explorar');
    } finally {
      setIsLoading(false);
    }
  }, [navigate, userId, location.pathname, loggedInUser]);
  
  const handleUpdateSuccess = (updatedUser: UserData) => { setProfileData(updatedUser); };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // NOVO useEffect PARA REGISTRAR A VISITA
  useEffect(() => {
    const registerView = async () => {
      // Condição: Se o perfil existe, não é o meu perfil, e o ID é válido...
      if (profileData && !isMyProfile && userId) {
        try {
          // ...faz uma chamada silenciosa para o backend para registrar a visita.
          await api.post(`/users/profile/${userId}/view`);
          console.log(`Visita registrada no perfil de ${profileData.name}`);
        } catch (error) {
          console.error("Não foi possível registrar a visita:", error);
        }
      }
    };
    // Chama a função de registro depois que os dados do perfil são carregados
    registerView();
  }, [profileData, isMyProfile, userId]);


  return (
    <Layout>
      <div className="container mx-auto px-4 pt-24 pb-12">
        {isLoading && <p className="text-center text-white">Carregando perfil...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        
        {profileData && <ProfileHeader 
                           user={profileData} 
                           onEditClick={isMyProfile ? openEditModal : () => {}} 
                           onCoverUploadSuccess={isMyProfile ? fetchData : () => {}}
                           isMyProfile={isMyProfile}
                         />}

        {!isLoading && !error && profileData && (
          <div className="mt-8 flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-2/3">
              <div className="bg-card p-6 rounded-lg shadow-lg">
                <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />
                <div className="mt-6">
                  {isMyProfile && activeTab === 'posts' && <CreatePost userProfilePicture={profileData.profilePictureUrl} onPostCreated={fetchData} />}
                  {activeTab === 'posts' && <div className={isMyProfile ? "mt-8" : ""}><PostList posts={posts} /></div>}
                  {activeTab === 'about' && <AboutTabContent user={profileData} />}
                  {activeTab === 'photos' && <PhotosTabContent photos={photos} onAddPhotoClick={isMyProfile ? openUploadPhotoModal : () => {}} isMyProfile={isMyProfile} />}
                  {activeTab === 'videos' && <VideosTabContent videos={videos} onAddVideoClick={isMyProfile ? openUploadVideoModal : () => {}} isMyProfile={isMyProfile} />}
                </div>
              </div>
            </div>
            {isMyProfile && <div className="w-full md:w-1/3"> 
              <ProfileSidebar 
                user={profileData} 
                onViewCertificationClick={openCertificationModal} 
                onViewStatsClick={openStatsModal}
              /> 
            </div>}
          </div>
        )}
      </div>
      
      {isMyProfile && (
          <>
            <EditProfileModal isOpen={isEditModalOpen} onClose={closeEditModal} currentUser={profileData} onUpdateSuccess={handleUpdateSuccess} />
            <UploadPhotoModal isOpen={isUploadPhotoModalOpen} onClose={closeUploadPhotoModal} onUploadSuccess={fetchData} />
            <UploadVideoModal isOpen={isUploadVideoModalOpen} onClose={closeUploadVideoModal} onUploadSuccess={fetchData} />
            <CertificationModal isOpen={isCertificationModalOpen} onClose={closeCertificationModal} user={profileData} />
            <StatsModal isOpen={isStatsModalOpen} onClose={closeStatsModal} user={profileData} />
          </>
      )}
    </Layout>
  );
};

export default UserProfilePage;