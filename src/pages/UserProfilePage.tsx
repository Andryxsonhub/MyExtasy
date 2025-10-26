// src/pages/UserProfilePage.tsx
// --- VERSÃO FINAL COMPLETA COM CORREÇÃO DE CACHE BUSTING (C02) ---

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import api from '../services/api';
import Layout from '../components/Layout';
import ProfileHeader from '../components/ProfileHeader';
import ProfileTabs from '../components/ProfileTabs';
import ProfileSidebar, { StatType } from '../components/ProfileSidebar'; // Importar StatType
import CreatePost from '../components/CreatePost';
import EditProfileModal from '../components/EditProfileModal';
import PostList from '../components/PostList';
import type { Post, UserData, Photo, Video } from '../types/types'; // Garantir que UserData esteja atualizado
import UploadPhotoModal from '../components/UploadPhotoModal';
import UploadVideoModal from '../components/UploadVideoModal';
import AboutTabContent from '../components/tabs/AboutTabContent';
import PhotosTabContent from '../components/tabs/PhotosTabContent';
import VideosTabContent from '../components/tabs/VideosTabContent';
import CertificationModal from '../components/CertificationModal';
import StatsModal from '../components/StatsModal';
import DetailedStatsModal from '../components/DetailedStatsModal'; // <-- 1. IMPORTAR O NOVO MODAL
import { useAuth } from '../contexts/AuthProvider';
import { fetchMyStats } from '../services/interactionApi';

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

  // States dos Modais Antigos (sem alteração)
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

  // --- 2. NOVOS ESTADOS PARA O MODAL DETALHADO ---
  const [isDetailedStatsModalOpen, setIsDetailedStatsModalOpen] = useState(false);
  const [detailedStatType, setDetailedStatType] = useState<StatType | null>(null);

  // --- 3. FUNÇÃO PARA ABRIR O MODAL DETALHADO ---
  const openDetailedStatsModal = (statType: StatType) => {
    // Pegamos o ID do perfil atual, seja ele o 'userId' da URL ou o ID do usuário logado
    const targetUserId = userId ? parseInt(userId, 10) : loggedInUser?.id;
    if (targetUserId) {
        setDetailedStatType(statType);
        setIsDetailedStatsModalOpen(true);
    } else {
        console.error("Não foi possível determinar o ID do usuário para o modal de estatísticas.");
    }
  };

  const closeDetailedStatsModal = () => {
    setIsDetailedStatsModalOpen(false);
    setDetailedStatType(null); // Limpa o tipo ao fechar
  };
  // --- FIM DAS NOVAS ADIÇÕES DE ESTADO/FUNÇÃO ---

  // fetchData (Atualizado para buscar stats e aplicar Cache Busting)
  const fetchData = useCallback(async () => {
    const isViewingOwnProfile = !!(location.pathname === '/meu-perfil' || (userId && loggedInUser && parseInt(userId, 10) === loggedInUser.id));
    setIsMyProfile(isViewingOwnProfile);
    const targetId = isViewingOwnProfile ? null : userId; // ID do perfil sendo visto
    const profileUrl = isViewingOwnProfile ? '/users/profile' : `/users/profile/${targetId}`; // Busca dados próprios ou públicos
    const postsUrl = isViewingOwnProfile ? '/posts' : `/posts/user/${targetId}`;
    const photosUrl = isViewingOwnProfile ? '/users/photos' : `/users/user/${targetId}/photos`;
    const videosUrl = isViewingOwnProfile ? '/users/videos' : `/users/user/${targetId}/videos`;

    try {
      setIsLoading(true); setError(null);
      const [profileResponse, postsResponse, photosResponse, videosResponse] = await Promise.all([
        api.get(profileUrl), api.get(postsUrl), api.get(photosUrl), api.get(videosUrl)
      ]);
      
      let completeProfileData = profileResponse.data;

      // Se for o MEU perfil, busca as estatísticas adicionais
      if (isViewingOwnProfile) {
        try {
          const statsData = await fetchMyStats(); // Esta função busca /interactions/my-stats
          completeProfileData = {
            ...completeProfileData,
            monthlyStats: {
              ...(completeProfileData.monthlyStats || {}), 
              likesReceived: statsData.likesReceived, 
              followers: statsData.followers 
            }
          };
        } catch (statsError) {
          console.error("Erro ao buscar estatísticas da sidebar:", statsError);
            completeProfileData.monthlyStats = {
                ...(completeProfileData.monthlyStats || {}),
                likesReceived: 0,
                followers: 0
           };
        }
      }

      setProfileData(completeProfileData);
      setPosts(postsResponse.data);
      
      // *************************************************************************
      // SOLUÇÃO C02 FORÇADA: Adiciona parâmetro de cache aleatório para contornar cache de CORS
      const cacheBuster = `v=${Date.now()}`;
      const photosWithCacheBuster: Photo[] = photosResponse.data.map((photo: Photo) => ({
        ...photo,
        url: photo.url.includes('?') 
          ? `${photo.url}&${cacheBuster}` 
          : `${photo.url}?${cacheBuster}`
      }));

      setPhotos(photosWithCacheBuster); // <--- ATUALIZADO
      // *************************************************************************
      
      setVideos(videosResponse.data);
    } catch (err) {
      setError('Erro ao carregar dados do perfil.'); console.error('Erro fetchData:', err);
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

  // --- O ID do usuário para o modal detalhado ---
  const detailedStatsUserId = userId ? parseInt(userId, 10) : loggedInUser?.id;

  return (
    <Layout>
      <div className="container mx-auto px-4 pt-24 pb-12">
        {isLoading && <p className="text-center text-white">Carregando...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        
        {profileData && <ProfileHeader user={profileData} onEditClick={isMyProfile ? openEditModal : () => {}} onCoverUploadSuccess={isMyProfile ? fetchData : () => {}} isMyProfile={isMyProfile} />}

        {!isLoading && !error && profileData && (
          <div className="mt-8 flex flex-col md:flex-row gap-8">
            {/* Conteúdo Principal (Tabs) */}
            <div className="w-full md:w-2/3">
              <div className="bg-card p-6 rounded-lg shadow-lg">
                <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />
                <div className="mt-6">
                  {isMyProfile && activeTab === 'posts' && <CreatePost userProfilePicture={profileData.profilePictureUrl} onPostCreated={fetchData} />}
                  {activeTab === 'posts' && <div className={isMyProfile ? "mt-8" : ""}><PostList posts={posts} /></div>}
                  {activeTab === 'about' && <AboutTabContent user={profileData} />}
                  {activeTab === 'photos' && <PhotosTabContent photos={photos} onAddPhotoClick={isMyProfile ? openUploadPhotoModal : () => {}} isMyProfile={isMyProfile} onDeleteSuccess={fetchData} />}
                  {activeTab === 'videos' &&
                    <VideosTabContent
                      videos={videos}
                      onAddVideoClick={isMyProfile ? openUploadVideoModal : () => {}}
                      isMyProfile={isMyProfile}
                      onDeleteSuccess={fetchData}
                    />
                  }
                </div>
              </div>
            </div>

            {/* Sidebar (Agora recebe a função onStatClick) */}
            <div className="w-full md:w-1/3 self-start md:sticky md:top-24"> 
              <ProfileSidebar
                  user={profileData}
                  onViewCertificationClick={isMyProfile ? openCertificationModal : () => {}} 
                  onViewStatsClick={isMyProfile ? openStatsModal : () => {}} 
                  onStatClick={openDetailedStatsModal} 
              />
            </div>
          </div>
        )}
      </div>
      
      {/* Modais Antigos */}
      {isMyProfile && profileData && (
        <>
          <EditProfileModal isOpen={isEditModalOpen} onClose={closeEditModal} currentUser={profileData} onUpdateSuccess={handleUpdateSuccess} />
          <UploadPhotoModal isOpen={isUploadPhotoModalOpen} onClose={closeUploadPhotoModal} onUploadSuccess={fetchData} />
          <UploadVideoModal isOpen={isUploadVideoModalOpen} onClose={closeUploadVideoModal} onUploadSuccess={fetchData} />
          <CertificationModal isOpen={isCertificationModalOpen} onClose={closeCertificationModal} user={profileData} />
          <StatsModal isOpen={isStatsModalOpen} onClose={closeStatsModal} user={profileData} />
        </>
      )}

      {/* --- 4. RENDERIZAR O NOVO MODAL --- */}
      {detailedStatsUserId && detailedStatType && (
        <DetailedStatsModal
          isOpen={isDetailedStatsModalOpen}
          onClose={closeDetailedStatsModal}
          userId={detailedStatsUserId}
          statType={detailedStatType}
        />
      )}
    </Layout>
  );
};

export default UserProfilePage;