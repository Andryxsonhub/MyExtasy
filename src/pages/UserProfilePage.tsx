// frontend/src/pages/UserProfilePage.tsx (USANDO O SEU SIDEBAR)

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import ProfileHeader from '../components/ProfileHeader';
import ProfileTabs from '../components/ProfileTabs';
import ProfileSidebar from '../components/ProfileSidebar'; // <-- IMPORTA O SEU COMPONENTE

// ... (as interfaces UserData e Post continuam iguais) ...
interface UserData { id: number; name: string; email: string; bio: string | null; profilePictureUrl: string | null; location: string | null; gender: string | null; createdAt: string; lastSeenAt: string | null; }
interface Post { id: number; content: string; createdAt: string; }


const UserProfilePage: React.FC = () => {
  // ... (toda a lógica de busca de dados continua a mesma) ...
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState('posts');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const handleEditClick = () => { console.log("Botão de editar perfil clicado!"); };
  useEffect(() => { const fetchData = async () => { const token = localStorage.getItem('authToken'); if (!token) { navigate('/entrar'); return; } try { setIsLoading(true); setError(null); const [profileResponse, postsResponse] = await Promise.all([ api.get('/users/profile'), api.get('/posts') ]); const apiData = profileResponse.data; const formattedUserData: UserData = { id: apiData.id, name: apiData.name, email: apiData.email, bio: apiData.bio, profilePictureUrl: apiData.profile_picture_url, location: apiData.location, gender: apiData.gender, createdAt: apiData.createdAt, lastSeenAt: apiData.lastSeenAt, }; setUserData(formattedUserData); setPosts(postsResponse.data); } catch (err) { console.error("Erro ao buscar dados do perfil:", err); setError("Não foi possível carregar seu perfil. Tente novamente mais tarde."); } finally { setIsLoading(false); } }; fetchData(); }, [navigate]);
  const renderTabContent = () => { switch (activeTab) { case 'posts': if (posts.length === 0 && !isLoading) { return <div className="text-center text-gray-400 p-8">Nenhuma publicação ainda.</div>; } return ( <div className="space-y-4"> {posts.map((post) => ( <div key={post.id} className="bg-card border border-border rounded-lg p-4 text-white"> <p>{post.content}</p> <small className="text-gray-500">{new Date(post.createdAt).toLocaleString('pt-BR')}</small> </div> ))} </div> ); case 'about': return <div className="text-white p-4">Conteúdo da seção Sobre aqui...</div>; case 'photos': return <div className="text-white p-4">Conteúdo de Fotos aqui...</div>; case 'videos': return <div className="text-white p-4">Conteúdo de Vídeos aqui...</div>; default: return null; } };
  if (isLoading) { return <div className="text-center text-white p-12">Carregando perfil...</div>; }
  if (error) { return <div className="text-center text-red-500 p-12">{error}</div>; }


  return (
    <div className="profile-page-container bg-background text-foreground min-h-screen">
      <div className="container mx-auto px-4 py-8">
        
        {userData && (
          <ProfileHeader 
            user={userData}
            onEditClick={handleEditClick}
          />
        )}

        <div className="mt-8 flex flex-col md:flex-row gap-8">

          <div className="w-full md:w-2/3 lg:w-3/4">
            <ProfileTabs 
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
            <div className="tab-content-container mt-4">
              {renderTabContent()}
            </div>
          </div>

          <div className="w-full md:w-1/3 lg:w-1/4">
            <ProfileSidebar />
          </div>
          
        </div>

      </div>
    </div>
  );
};

export default UserProfilePage;

