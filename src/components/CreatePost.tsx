// Arquivo: src/components/CreatePost.tsx (VERSÃO CORRIGIDA E SIMPLIFICADA)

import React, { useState } from 'react';
import api from '@/services/api'; // ALTERAÇÃO 1: Importa a instância 'api'

const CreatePost: React.FC = () => {
  const [content, setContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // A verificação de conteúdo vazio continua importante
    if (!content.trim()) {
      setError('Você não pode criar uma publicação vazia.');
      return;
    }

    // ALTERAÇÃO 2: A lógica de pegar o token e criar o cabeçalho foi REMOVIDA.
    // O nosso 'api.ts' agora faz isso automaticamente para nós!

    setIsPosting(true);
    setError(null);

    try {
      // ALTERAÇÃO 3: A chamada para a API agora é extremamente simples.
      // A URL base e o token de autorização são adicionados закулисно.
      await api.post('/posts', { content: content });
      
      setContent('');
      // Idealmente, aqui você sinalizaria ao componente pai para recarregar a lista de posts.
      // window.location.reload(); // Uma solução simples, mas não ideal, para recarregar a página.
      
    } catch (err) {
      setError('Ocorreu um erro ao criar a publicação. Tente novamente.');
      console.error('Erro ao criar post:', err);
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="w-full">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Compartilhe aqui prazer com fotos, vídeos e textos picantes!"
          className="w-full bg-gray-800 border border-gray-700 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white transition-colors"
          rows={3}
          disabled={isPosting}
        />
      </div>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      
      <div className="flex justify-end mt-4">
        <button 
          type="submit" 
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg transition-colors disabled:bg-purple-900 disabled:cursor-not-allowed"
          disabled={isPosting || !content.trim()}
        >
          {isPosting ? 'Publicando...' : 'Publicar'}
        </button>
      </div>
    </form>
  );
};

export default CreatePost;