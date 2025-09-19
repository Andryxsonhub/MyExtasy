// Arquivo: src/components/CreatePost.tsx (VERSÃO COMPLETA E FUNCIONAL)

import React, { useState } from 'react';
import axios from 'axios';

const CreatePost: React.FC = () => {
  // 1. Estado para guardar o texto da publicação
  const [content, setContent] = useState('');
  // 2. Estados para dar feedback visual ao usuário
  const [isPosting, setIsPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 3. Função principal que lida com o envio do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Previne que a página recarregue ao enviar

    const token = localStorage.getItem('authToken');
    if (!content.trim()) {
      setError('Você não pode criar uma publicação vazia.');
      return;
    }
    if (!token) {
      setError('Você precisa estar logado para publicar.');
      return;
    }

    setIsPosting(true);
    setError(null);

    try {
      // 4. A chamada para a nossa nova API no backend!
      await axios.post(
        'http://localhost:3001/api/posts',
        { content: content }, // Enviamos o texto no corpo da requisição
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // 5. Se deu tudo certo, limpamos o campo de texto.
      setContent('');
      // No futuro, aqui é onde avisaríamos a lista de posts para se atualizar!
      
    } catch (err) {
      setError('Ocorreu um erro ao criar a publicação. Tente novamente.');
      console.error('Erro ao criar post:', err);
    } finally {
      setIsPosting(false); // Garante que o botão volte ao normal, mesmo se der erro
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="w-full">
        {/* O textarea agora é controlado pelo nosso estado 'content' */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Compartilhe aqui prazer com fotos, vídeos e textos picantes!"
          className="w-full bg-gray-800 border border-gray-700 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white transition-colors"
          rows={3}
          disabled={isPosting} // Desabilita enquanto está publicando
        />
      </div>

      {/* Mostra a mensagem de erro, se houver */}
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      
      <div className="flex justify-end mt-4">
        <button 
          type="submit" 
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg transition-colors disabled:bg-purple-900 disabled:cursor-not-allowed"
          // Desabilita o botão se estiver postando ou se o campo estiver vazio
          disabled={isPosting || !content.trim()}
        >
          {isPosting ? 'Publicando...' : 'Publicar'}
        </button>
      </div>
    </form>
  );
};

export default CreatePost;