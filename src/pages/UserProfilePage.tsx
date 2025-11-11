// src/pages/UserProfilePage.tsx
// --- ★★★ CORREÇÃO 11/11 (v4): Corrigindo o typo 'isMyMProfile' -> 'isMyProfile' ★★★ ---

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, useLocation, Link } from 'react-router-dom'; 
import api from '@/services/api';
import Layout from '@/components/Layout';
import ProfileHeader from '@/components/ProfileHeader';
import ProfileTabs from '@/components/ProfileTabs';
import ProfileSidebar, { StatType } from '@/components/ProfileSidebar';
import CreatePost from '@/components/CreatePost';
import EditProfileModal from '@/components/EditProfileModal';
import PostList from '@/components/PostList';
import type { Post, UserData, Photo, Video } from '../types/types'; 
import UploadPhotoModal from '@/components/UploadPhotoModal';
import UploadVideoModal from '@/components/UploadVideoModal';
import AboutTabContent from '@/components/tabs/AboutTabContent';
import PhotosTabContent from '@/components/tabs/PhotosTabContent';
import VideosTabContent from '@/components/tabs/VideosTabContent';
import CertificationModal from '@/components/CertificationModal';
import StatsModal from '@/components/StatsModal';
import DetailedStatsModal from '@/components/DetailedStatsModal'; 
import ChatModal from '@/components/ChatModal'; 
import { useAuth } from '@/contexts/AuthProvider';
import { fetchMyStats } from '@/services/interactionApi';
import { useToast } from "@/components/ui/use-toast"; 
import AccountSettingsModal from '@/components/AccountSettingsModal';
import { Button } from '@/components/ui/button';

const UserProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const location = useLocation();
  const { user: loggedInUser, logout } = useAuth();
  const { toast } = useToast();

  const [profileData, setProfileData] = useState<UserData | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('posts');
  const [isMyProfile, setIsMyProfile] = useState(false);

  // ... (Todos os 'useState' e 'open/close' dos Modais permanecem iguais) ...
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
  const [isDetailedStatsModalOpen, setIsDetailedStatsModalOpen] = useState(false);
  const [detailedStatType, setDetailedStatType] = useState<StatType | null>(null);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const openAccountModal = () => setIsAccountModalOpen(true);
  const closeAccountModal = () => setIsAccountModalOpen(false);

  const openDetailedStatsModal = (statType: StatType) => {
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
    setDetailedStatType(null); 
  };
  const openChatModal = () => setIsChatModalOpen(true);
  const closeChatModal = () => setIsChatModalOpen(false);


  // fetchData
  const fetchData = useCallback(async () => {
    const isViewingOwnProfile = !!(location.pathname === '/meu-perfil' || (userId && loggedInUser && parseInt(userId, 10) === loggedInUser.id));
    setIsMyProfile(isViewingOwnProfile);
    const targetId = isViewingOwnProfile ? null : userId; 

    // Rotas Corrigidas (v3)
    const profileUrl = isViewingOwnProfile ? '/users/profile' : `/users/profile/${targetId}`; 
    const postsUrl = isViewingOwnProfile ? '/posts' : `/posts/user/${targetId}`; 
    const photosUrl = isViewingOwnProfile ? '/users/photos' : `/users/${targetId}/photos`;
    const videosUrl = isViewingOwnProfile ? '/users/videos' : `/users/${targetId}/videos`;

    try {
      setIsLoading(true); setError(null);
      
      const [profileResponse, postsResponse, photosResponse] = await Promise.all([
        api.get<UserData>(profileUrl), 
        api.get(postsUrl), 
        api.get(photosUrl) 
      ]);
      
      let completeProfileData = profileResponse.data;

      if (isViewingOwnProfile) {
        try {
          const statsData = await fetchMyStats(); 
          completeProfileData = {
            ...completeProfileData,
            monthlyStats: {
              visits: completeProfileData.monthlyStats?.visits || 0,
              commentsReceived: completeProfileData.monthlyStats?.commentsReceived || 0,
              commentsMade: completeProfileData.monthlyStats?.commentsMade || 0,
              likesReceived: statsData.likesReceived, 
              followers: statsData.followers 
            }
          };
        } catch (statsError) {
          console.error("Erro ao buscar estatísticas da sidebar:", statsError);
            completeProfileData.monthlyStats = {
              visits: 0,
              commentsReceived: 0,
              commentsMade: 0,
              likesReceived: 0,
              followers: 0
           };
        }
      }

      setProfileData(completeProfileData);
      setPosts(postsResponse.data);
      
      const cacheBuster = `v=${Date.now()}`;
      const photosWithCacheBuster: Photo[] = photosResponse.data.map((photo: Photo) => ({
        ...photo,
        url: photo.url.includes('?') 
          ? `${photo.url}&${cacheBuster}` 
          : `${photo.url}?${cacheBuster}`
      }));
      setPhotos(photosWithCacheBuster); 

      // 3. Verifica se tem permissão para ver vídeos
      if (completeProfileData.tipo_plano !== 'gratuito') {
        try {
          const videosResponse = await api.get(videosUrl); 
          setVideos(videosResponse.data);
        } catch (videoError) {
          console.warn("Não foi possível carregar vídeos (talvez o plano tenha expirado):", videoError);
          setVideos([]); 
        }
      } else {
        setVideos([]); 
      }

  } catch (err) {
      setError('Erro ao carregar dados do perfil.'); 
      console.error('Erro fetchData:', err);
    } finally { setIsLoading(false); }
  }, [navigate, userId, location.pathname, loggedInUser]);
  
  const handleUpdateSuccess = (updatedUser: UserData) => { setProfileData(updatedUser); };

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => {
    const registerView = async () => {
        if (profileData && !isMyProfile && userId) {
            try { await api.post(`/users/profile/${userId}/view`); }
            catch (error) { console.error("Erro registrar visita:", error); }
        }
    };
    registerView();
  }, [profileData, isMyProfile, userId]);

  const handleFreezeAccount = async () => {
    try {
      await api.post('/users/congelar');
      toast({ title: "Conta Congelada", description: "Sua conta foi congelada. Você será desconectado." });
      logout(); 
    } catch (error) {
      console.error('Falha ao congelar conta:', error);
      toast({ title: "Erro", description: "Não foi possível congelar sua conta.", variant: "destructive" });
      throw error; 
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await api.delete('/users/excluir');
      toast({ title: "Conta Excluída", description: "Sua conta foi excluída permanentemente. Você será desconectado." });
      logout(); 
    } catch (error) {
      console.error('Falha ao excluir conta:', error);
      toast({ title: "Erro", description: "Não foi possível excluir sua conta.", variant: "destructive" });
      throw error; 
    }
  };

  const detailedStatsUserId = userId ? parseInt(userId, 10) : loggedInUser?.id;

  return (
    <Layout>
      <div className="container mx-auto px-4 pt-24 pb-12">

        {isLoading && <p className="text-center text-white">Carregando...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        
        {profileData && (
          <ProfileHeader 
            user={profileData} 
            onEditClick={isMyProfile ? openEditModal : () => {}} 
            onCoverUploadSuccess={isMyProfile ? fetchData : () => {}} 
            isMyProfile={isMyProfile} 
            onOpenChatModal={openChatModal} 
          />
        )}

        {!isLoading && !error && profileData && (
          <div className="mt-8 flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-2/3">
              <div className="bg-card p-6 rounded-lg shadow-lg">
                <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />
                <div className="mt-6">
                  {isMyProfile && activeTab === 'posts' && <CreatePost userProfilePicture={profileData.profilePictureUrl} onPostCreated={fetchData} />}
                  
                  {/* ★★★ ESTA É A LINHA CORRIGIDA (de 'isMyMProfile' para 'isMyProfile') ★★★ */}
                  {activeTab === 'posts' && <div className={isMyProfile ? "mt-8" : ""}><PostList posts={posts} /></div>}
                  
                  {activeTab === 'about' && <AboutTabContent user={profileData} />}
                  
                  {activeTab === 'photos' && <PhotosTabContent photos={photos} onAddPhotoClick={isMyProfile ? openUploadPhotoModal : () => {}} isMyProfile={isMyProfile} onDeleteSuccess={fetchData} />}
                  
                  {activeTab === 'videos' && (
                    profileData.tipo_plano !== 'gratuito' ? (
                      <VideosTabContent
                        videos={videos}
                        onAddVideoClick={isMyProfile ? openUploadVideoModal : () => {}}
                        isMyProfile={isMyProfile}
                        onDeleteSuccess={fetchData}
                      />
                    ) : (
                      <div className="text-center py-12">
                        <h3 className="text-2xl font-bold text-white mb-4">Acesso Exclusivo para Assinantes</h3>
                        <p className="text-gray-400 mb-6 max-w-md mx-auto">Esta área é reservada para membros com um plano. Faça um upgrade para ver e partilhar vídeos exclusivos.</p>
                        <Button asChild className="bg-primary hover:bg-primary/90 text-white">
                          <Link to="/planos">Ver Planos</Link>
                        </Button>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>

      <div className="w-full md:w-1/3 self-start md:sticky md:top-24"> 
              <ProfileSidebar
                  user={profileData}
                  onViewCertificationClick={isMyProfile ? openCertificationModal : () => {}} 
                  onViewStatsClick={isMyProfile ? openStatsModal : () => {}} 
                  onStatClick={openDetailedStatsModal} 
                  isMyProfile={isMyProfile}
                  onOpenAccountModal={openAccountModal} 
              />
            </div>
          </div>
        )}
      </div>
      
      {isMyProfile && profileData && (
        <>
          <EditProfileModal isOpen={isEditModalOpen} onClose={closeEditModal} currentUser={profileData} onUpdateSuccess={handleUpdateSuccess} />
          <UploadPhotoModal isOpen={isUploadPhotoModalOpen} onClose={closeUploadPhotoModal} onUploadSuccess={fetchData} />
          <UploadVideoModal isOpen={isUploadVideoModalOpen} onClose={closeUploadVideoModal} onUploadSuccess={fetchData} />
          <CertificationModal isOpen={isCertificationModalOpen} onClose={closeCertificationModal} user={profileData} />
          <StatsModal isOpen={isStatsModalOpen} onClose={closeStatsModal} user={profileData} />
        </>
      )}

      {detailedStatsUserId && detailedStatType && (
        <DetailedStatsModal
          isOpen={isDetailedStatsModalOpen}
          onClose={closeDetailedStatsModal}
          userId={detailedStatsUserId}
          statType={detailedStatType}
        />
      )}

      {profileData && (
        <ChatModal 
          isOpen={isChatModalOpen}
          onClose={closeChatModal}
          targetUser={profileData} 
        />
      )}

      {isMyProfile && (
        <AccountSettingsModal 
          isOpen={isAccountModalOpen}
          onClose={closeAccountModal}
          onFreeze={handleFreezeAccount}
          onDelete={handleDeleteAccount}
        />
      )}
    </Layout>
  );
};

export default UserProfilePage;