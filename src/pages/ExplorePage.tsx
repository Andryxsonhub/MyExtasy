// src/pages/ExplorePage.tsx (VERSÃO FINAL COM DADOS REAIS)

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthProvider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import ContentCard, { Post } from '../components/ContentCard'; 
import api from '../services/api'; // 1. IMPORTAMOS A API

// --- DADOS DE EXEMPLO (MOCK DATA) PARA USUÁRIOS ONLINE ---
// (Mantemos este por enquanto, até criarmos a API para ele)
const mockOnlineUsers = [
    { id: '1', username: 'loirinhalove', avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1587', gender: 'Mulher' },
    { id: '2', username: 'casal_quente', avatarUrl: 'https://images.unsplash.com/photo-1571560963321-b2613c4a20b9?q=80&w=1587', gender: 'Casal' },
    { id: '3', username: 'rmary', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1664', gender: 'Mulher' },
];
// ------------------------------------

const ExplorePage: React.FC = () => {
  const { user } = useAuth();
  
  // 2. CRIAMOS OS ESTADOS PARA GUARDAR OS POSTS, CARREGAMENTO E ERRO
  const [feedPosts, setFeedPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 3. USAMOS O useEffect PARA BUSCAR OS DADOS DA API QUANDO A PÁGINA CARREGA
  useEffect(() => {
    const fetchFeed = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await api.get('/posts/feed');
        setFeedPosts(response.data);
      } catch (err) {
        console.error("Erro ao buscar o feed:", err);
        setError("Não foi possível carregar o feed. Tente novamente mais tarde.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeed();
  }, []); // O array vazio [] garante que isso rode apenas uma vez

  const handleLike = (postId: number) => {
    console.log(`Curtiu o post ${postId}! (Funcionalidade a ser implementada)`);
  };

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Explorar Comunidade</h1>
      </div>
      
      <div className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Online agora</h2>
          <Link to="/online" className="text-sm text-primary hover:underline">Ver mais</Link>
        </div>
        <div className="flex space-x-4 overflow-x-auto pb-4">
          <div className="flex flex-col items-center flex-shrink-0 w-20 text-center">
            <button className="w-16 h-16 rounded-full bg-card border-2 border-dashed border-primary flex items-center justify-center mb-2 hover:bg-primary/20 transition-colors">
              <PlusCircle className="w-8 h-8 text-primary" />
            </button>
            <span className="text-xs text-gray-300 font-medium">Destaque-se</span>
          </div>
          {mockOnlineUsers.map((onlineUser) => (
            <Link to={`/profile/${onlineUser.id}`} key={onlineUser.id} className="flex flex-col items-center flex-shrink-0 w-20 text-center group">
              <Avatar className="w-16 h-16 mb-2 border-2 border-green-500 transition-transform group-hover:scale-105">
                <AvatarImage src={onlineUser.avatarUrl} alt={onlineUser.username} />
                <AvatarFallback>{onlineUser.username.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <p className="text-sm font-semibold text-white truncate w-full">{onlineUser.username}</p>
              <p className="text-xs text-gray-400">{onlineUser.gender}</p>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Destaques da Comunidade</h2>
        
        {/* 4. ADICIONAMOS A LÓGICA DE RENDERIZAÇÃO CONDICIONAL */}
        {isLoading && <p className="text-white text-center">Carregando feed...</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {feedPosts.map((post) => (
              <ContentCard
                key={`${post.media_type}-${post.id}`} // Chave única para evitar conflitos de ID entre fotos e vídeos
                post={post}
                onLike={() => handleLike(post.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;