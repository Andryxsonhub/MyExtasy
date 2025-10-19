// src/pages/UserProfilePage.tsx
// --- CÓDIGO 100% CORRIGIDO (Verificação Final onDeleteSuccess) ---

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
import { fetchMyStats } from '../services/interactionApi'; // Caminho corrigido

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

  // States dos Modais (sem alteração)
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

  // Função fetchData (sem alteração na lógica principal, busca stats se for meu perfil)
  const fetchData = useCallback(async () => {
    const isViewingOwnProfile = !!(location.pathname === '/meu-perfil' || (userId && loggedInUser && parseInt(userId, 10) === loggedInUser.id));
    setIsMyProfile(isViewingOwnProfile);
    const targetId = isViewingOwnProfile ? null : userId;
    const profileUrl = isViewingOwnProfile ? '/users/profile' : `/users/profile/${targetId}`;
    const postsUrl = isViewingOwnProfile ? '/posts' : `/posts/user/${targetId}`;
    const photosUrl = isViewingOwnProfile ? '/users/photos' : `/users/user/${targetId}/photos`;
    const videosUrl = isViewingOwnProfile ? '/users/videos' : `/users/user/${targetId}/videos`;

    try {
      setIsLoading(true); setError(null);
      const [profileResponse, postsResponse, photosResponse, videosResponse] = await Promise.all([
        api.get(profileUrl), api.get(postsUrl), api.get(photosUrl), api.get(videosUrl)
      ]);
      let completeProfileData = profileResponse.data;
      if (isViewingOwnProfile) {
        try {
          const statsData = await fetchMyStats();
          completeProfileData = {
            ...completeProfileData,
            monthlyStats: { ...(completeProfileData.monthlyStats || {}), likesReceived: statsData.likesReceived, followers: statsData.followers }
          };
        } catch (statsError) { console.error("Erro stats sidebar:", statsError); }
      }
      setProfileData(completeProfileData);
      setPosts(postsResponse.data);
      setPhotos(photosResponse.data);
      setVideos(videosResponse.data);
    } catch (err) {
      setError('Erro ao carregar dados.'); console.error('Erro fetchData:', err); navigate('/explorar');
    } finally { setIsLoading(false); }
  }, [navigate, userId, location.pathname, loggedInUser]);
  
  const handleUpdateSuccess = (updatedUser: UserData) => { setProfileData(updatedUser); };

  useEffect(() => { fetchData(); }, [fetchData]);

  // useEffect registerView (sem alteração)
  useEffect(() => {
    const registerView = async () => {
        if (profileData && !isMyProfile && userId) {
            try { await api.post(`/users/profile/${userId}/view`); }
            catch (error) { console.error("Erro registrar visita:", error); }
        }
    };
    registerView();
  }, [profileData, isMyProfile, userId]);

  return (
    <Layout>
      <div className="container mx-auto px-4 pt-24 pb-12">
        {isLoading && <p className="text-center text-white">Carregando...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        
        {profileData && <ProfileHeader user={profileData} onEditClick={isMyProfile ? openEditModal : () => {}} onCoverUploadSuccess={isMyProfile ? fetchData : () => {}} isMyProfile={isMyProfile} />}

        {!isLoading && !error && profileData && (
          <div className="mt-8 flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-2/3">
              <div className="bg-card p-6 rounded-lg shadow-lg">
                <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />
                <div className="mt-6">
                  {isMyProfile && activeTab === 'posts' && <CreatePost userProfilePicture={profileData.profilePictureUrl} onPostCreated={fetchData} />}
                  {activeTab === 'posts' && <div className={isMyProfile ? "mt-8" : ""}><PostList posts={posts} /></div>}
                  {activeTab === 'about' && <AboutTabContent user={profileData} />}
                  {activeTab === 'photos' && <PhotosTabContent photos={photos} onAddPhotoClick={isMyProfile ? openUploadPhotoModal : () => {}} isMyProfile={isMyProfile} onDeleteSuccess={fetchData} />}
                  
                  {/* --- VERIFIQUE ESTA LINHA --- */}
                  {activeTab === 'videos' &&
                    <VideosTabContent
                      videos={videos}
                      onAddVideoClick={isMyProfile ? openUploadVideoModal : () => {}}
                      isMyProfile={isMyProfile}
                      onDeleteSuccess={fetchData} // <-- GARANTA QUE ESTA PROP ESTÁ AQUI
                    />
                  }
                  {/* --- FIM DA VERIFICAÇÃO --- */}

                </div>
              </div>
            </div>
            {isMyProfile && <div className="w-full md:w-1/3"> 
              <ProfileSidebar user={profileData} onViewCertificationClick={openCertificationModal} onViewStatsClick={openStatsModal} /> 
            </div>}
          </div>
        )}
      </div>
      
      {/* Modais (sem alteração) */}
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