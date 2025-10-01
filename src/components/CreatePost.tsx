// frontend/src/components/CreatePost.tsx (VERSÃO CORRIGIDA)

import React, { useState } from 'react';
import api from '../services/api';
import { Button } from './ui/button';
import { SendHorizonal } from 'lucide-react';

interface CreatePostProps {
  userProfilePicture: string | null;
  onPostCreated: () => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ userProfilePicture, onPostCreated }) => {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePostSubmit = async () => {
    if (!content.trim()) {
      setError('A publicação não pode estar vazia.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await api.post('/posts', { content });
      setContent('');
      onPostCreated();
    } catch (err) {
      console.error("Erro ao criar post:", err);
      setError('Não foi possível criar a publicação. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // ==========================================================
  // 1. CRIAMOS A URL COMPLETA DA IMAGEM (A MESMA LÓGICA DOS OUTROS COMPONENTES)
  // ==========================================================
  const fullImageUrl = userProfilePicture
    ? `${import.meta.env.VITE_API_URL}${userProfilePicture}`
    : null;

  return (
    <div className="create-post-container bg-card border border-border rounded-lg p-4 mb-6">
      <div className="flex items-start space-x-4">
        {/* Foto de Perfil do Usuário */}
        <img
          // ==========================================================
          // 2. USAMOS A URL COMPLETA NO 'src' DA IMAGEM
          // ==========================================================
          src={fullImageUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1780&auto=format&fit=crop'}
          alt="Foto de perfil"
          className="w-12 h-12 rounded-full object-cover"
        />
        {/* Caixa de Texto */}
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setError(null);
            }}
            placeholder="Compartilhe aqui prazer com fotos, vídeos e textos picantes!"
            className="w-full bg-transparent border-b border-border focus:outline-none focus:border-primary text-white resize-none p-2"
            rows={3}
            disabled={isLoading}
          />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
      </div>
      {/* Botão de Envio */}
      <div className="flex justify-end mt-4">
        <Button onClick={handlePostSubmit} disabled={isLoading}>
          {isLoading ? 'Publicando...' : (
            <>
              <SendHorizonal className="w-4 h-4 mr-2" />
              Publicar
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default CreatePost;