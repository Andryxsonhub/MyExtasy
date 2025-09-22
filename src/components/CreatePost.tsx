// frontend/src/components/CreatePost.tsx

import React, { useState } from 'react';
import api from '../services/api';
import { Button } from './ui/button'; // Reutilizamos nosso componente de botão
import { SendHorizonal } from 'lucide-react'; // Ícone de envio

// Definimos as "propriedades" que este componente vai receber
interface CreatePostProps {
  userProfilePicture: string | null; // A URL da foto de perfil do usuário
  onPostCreated: () => void; // Uma função para ser chamada quando um post for criado com sucesso
}

const CreatePost: React.FC<CreatePostProps> = ({ userProfilePicture, onPostCreated }) => {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePostSubmit = async () => {
    // Impede o envio de posts vazios
    if (!content.trim()) {
      setError('A publicação não pode estar vazia.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Faz a chamada para a API para criar o post
      await api.post('/posts', { content });
      
      setContent(''); // Limpa a caixa de texto
      onPostCreated(); // Avisa o componente pai que um novo post foi criado

    } catch (err) {
      console.error("Erro ao criar post:", err);
      setError('Não foi possível criar a publicação. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="create-post-container bg-card border border-border rounded-lg p-4 mb-6">
      <div className="flex items-start space-x-4">
        {/* Foto de Perfil do Usuário */}
        <img
          src={userProfilePicture || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1780&auto=format&fit=crop'}
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

