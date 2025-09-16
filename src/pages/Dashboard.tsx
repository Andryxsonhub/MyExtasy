// src/pages/Dashboard.tsx

import React, { useState, ChangeEvent, useEffect, useRef } from 'react';
import UserProfile from '../components/UserProfile';
import LikeButton from '../components/LikeButton';
import axios from 'axios'; // NOVO: Importamos o axios
import { jwtDecode } from 'jwt-decode'; // NOVO: Para decodificar o token e pegar o ID do usuário

// NOVO: Definindo um tipo para o objeto de usuário
interface User {
  id: string;
  name: string;
  email: string;
  bio: string;
  profilePictureUrl: string;
}

// ... (seus dados DUMMY_UPLOADS podem permanecer se você quiser)
const DUMMY_UPLOADS = [
  // ...
];

const Dashboard = () => {
  // --- ESTADOS NOVOS PARA DADOS REAIS ---
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const avatarInputRef = useRef<HTMLInputElement>(null); // Ref para o input de arquivo do avatar

  // --- Estados existentes ---
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploadedItems, setUploadedItems] = useState(DUMMY_UPLOADS);

  // NOVO: useEffect para buscar os dados do usuário quando o componente carregar
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('Token não encontrado, usuário não autenticado.');
        setIsLoading(false);
        // Opcional: redirecionar para a página de login
        return;
      }

      try {
        // Decodificamos o token para pegar o ID do usuário
        const decodedToken: { userId: string } = jwtDecode(token);
        const userId = decodedToken.userId;

        // Buscamos os dados do usuário na API
        const response = await axios.get(`http://localhost:3001/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setUser(response.data);
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // NOVO: Função para lidar com a seleção e upload da nova foto de perfil
  const handleAvatarChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('Você precisa estar logado para mudar a foto.');
      return;
    }

    // Criamos um FormData para enviar o arquivo
    const formData = new FormData();
    formData.append('avatar', file); // 'avatar' é o nome que o backend (multer) espera

    try {
      // Enviamos a imagem para o backend
      const response = await axios.post('http://localhost:3001/api/users/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      // Atualizamos o estado do usuário com a nova URL da imagem vinda do backend
      setUser(prevUser => {
        if (!prevUser) return null;
        // Construímos a URL completa para a nova imagem
        const newAvatarUrl = `http://localhost:3001${response.data.avatarUrl}`;
        return { ...prevUser, profilePictureUrl: newAvatarUrl };
      });

      alert(response.data.message);

    } catch (error) {
      console.error('Erro ao fazer upload do avatar:', error);
      alert('Ocorreu um erro ao enviar a nova foto.');
    }
  };

  // ... (suas funções handleFileChange, handleUpload, handleLike permanecem iguais) ...
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => { /* ...código existente... */ };
  const handleUpload = () => { /* ...código existente... */ };
  const handleLike = (itemId: number) => { /* ...código existente... */ };


  // --- Renderização do Componente ---
  if (isLoading) {
    return <div className="text-center pt-48">Carregando perfil...</div>;
  }

  if (!user) {
    return <div className="text-center pt-48">Não foi possível carregar os dados do usuário. Por favor, faça login novamente.</div>;
  }
  
  const contentCount = uploadedItems.length;

  return (
    <div className="bg-background min-h-screen pt-24 text-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-extrabold text-foreground mb-4">Seu Painel</h1>
          <p className="text-lg text-muted-foreground">
            Gerencie seu perfil, fotos e vídeos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Seção de Perfil de Usuário ATUALIZADA */}
          <div className="md:col-span-1">
            {/* Input de arquivo escondido para o avatar */}
            <input
              type="file"
              accept="image/*"
              ref={avatarInputRef}
              onChange={handleAvatarChange}
              style={{ display: 'none' }}
            />
            {/* O componente de perfil agora é clicável para acionar o input */}
            <div 
              className="cursor-pointer group relative"
              onClick={() => avatarInputRef.current?.click()}
            >
              <UserProfile
                name={user.name}
                email={user.email}
                bio={user.bio}
                profilePictureUrl={user.profilePictureUrl}
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 rounded-lg flex items-center justify-center">
                <p className="text-white opacity-0 group-hover:opacity-100 font-bold">Trocar Foto</p>
              </div>
            </div>
          </div>

          {/* Seção de Upload e Conteúdo (seu código existente) */}
          <div className="md:col-span-2">
            {/* ... Seu card de Upload de Arquivos ... */}
            {/* ... Seu card de Conteúdo ... */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;