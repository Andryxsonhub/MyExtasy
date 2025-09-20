// src/pages/Explorar.tsx (VERSÃO COMPLETA E CORRIGIDA)

import React, { useState, useEffect } from 'react';
import api from '@/services/api'; // ALTERAÇÃO 1: Importa a instância 'api'
import Layout from '@/components/Layout';
import ContentCard from '@/components/ContentCard';

// Interface completa para o objeto Post, incluindo o userid
interface Post {
  id: number;
  userid: number;
  media_type: 'image' | 'video';
  media_url: string;
  author_name: string;
  author_avatar_url: string | null;
  likes_count: number;
}

const Explorar = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        // ALTERAÇÃO 2: Usa 'api.get' com a rota simplificada
        const response = await api.get('/posts');
        setPosts(response.data);
      } catch (err) {
        setError('Não foi possível carregar o conteúdo. Tente novamente mais tarde.');
        console.error('Erro ao buscar posts:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleLike = async (postId: number) => {
    // Lógica de UI otimista (atualiza a tela antes da resposta do servidor)
    setPosts(currentPosts =>
      currentPosts.map(post =>
        post.id === postId ? { ...post, likes_count: post.likes_count + 1 } : post
      )
    );
    try {
      // ALTERAÇÃO 3: Usa 'api.post' com a rota simplificada
      await api.post(`/posts/${postId}/like`);
    } catch (error) {
      console.error('Erro ao curtir o post:', error);
      // Reverte a curtida na UI se a chamada falhar
      setPosts(currentPosts =>
        currentPosts.map(post =>
          post.id === postId ? { ...post, likes_count: post.likes_count - 1 } : post
        )
      );
    }
  };

  return (
    <Layout>
      <div className="bg-background text-foreground min-h-screen">
        <div className="container mx-auto px-4 pt-24 pb-12">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold text-white mb-2">Explorar</h1>
            <p className="text-lg text-gray-400">
              Descubra fotos e vídeos incríveis de outros usuários.
            </p>
          </div>

          {isLoading && <p className="text-center text-white">Carregando...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}

          {!isLoading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {posts.map((post) => (
                <ContentCard
                  key={post.id}
                  post={post}
                  onLike={() => handleLike(post.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Explorar;