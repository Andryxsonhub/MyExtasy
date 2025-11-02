import React, { useState, useEffect, FormEvent } from 'react';
// --- ★★★ Imports com @/ mantidos ★★★ ---
import api from '@/services/api'; 
import { useAuth } from '@/contexts/AuthProvider'; 
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// --- FIM DOS IMPORTS ---
import { Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// O tipo de um comentário que vem da nossa API
interface Comment {
  id: number;
  text: string;
  createdAt: string;
  author: {
    id: number;
    name: string;
    profilePictureUrl: string | null;
  };
}

interface CommentSectionProps {
  photoId: number;
}

const CommentSection: React.FC<CommentSectionProps> = ({ photoId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(false);

  // 1. Buscar os comentários quando o componente carregar
  useEffect(() => {
    const fetchComments = async () => {
      if (!photoId) return;
      setIsLoading(true);
      try {
        const response = await api.get<Comment[]>(`/media/photos/${photoId}/comments`);
        setComments(response.data);
      } catch (error) {
        console.error("Erro ao buscar comentários:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchComments();
  }, [photoId]);

  // 2. Enviar um novo comentário
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isPosting) return;

    setIsPosting(true);
    try {
      // Usamos a nova rota POST que criamos no backend
      const response = await api.post<Comment>(`/media/photos/${photoId}/comments`, {
        text: newComment,
      });
      
      // Adiciona o novo comentário no topo da lista (atualização otimista)
      setComments(prevComments => [response.data, ...prevComments]);
      setNewComment(''); // Limpa o input
    } catch (error) {
      console.error("Erro ao enviar comentário:", error);
      // @ts-ignore
      alert("Não foi possível enviar seu comentário.");
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* 3. Formulário para enviar comentário */}
      {/* ========================================================== */}
      {/* ★★★ ALTERAÇÃO DAS CORES (bg-transparent) ★★★ */}
      {/* ========================================================== */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-border">
        <div className="flex items-start space-x-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={user?.profilePictureUrl || undefined} />
            <AvatarFallback>{user?.name?.[0] || 'U'}</AvatarFallback>
          </Avatar>
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Escreva um comentário..."
            // Corrigido para o padrão (igual ao CreatePost.tsx)
            className="flex-1 bg-transparent border-b border-border focus:outline-none focus:border-primary text-white resize-none p-2"
            rows={2}
          />
          <Button type="submit" size="icon" disabled={isPosting || !newComment.trim()}>
            {isPosting ? '...' : <Send size={18} />}
          </Button>
        </div>
      </form>

      {/* 4. Lista de comentários */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <p className="text-gray-400 text-center">Carregando comentários...</p>
        ) : comments.length === 0 ? (
          <p className="text-gray-400 text-center">Nenhum comentário ainda. Seja o primeiro!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex items-start space-x-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={comment.author.profilePictureUrl || undefined} />
                <AvatarFallback>{comment.author.name[0] || 'U'}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                {/* ========================================================== */}
                {/* ★★★ ALTERAÇÃO DAS CORES (bg-card) ★★★ */}
                {/* ========================================================== */}
                {/* Corrigido de bg-gray-700 para bg-card */}
                <div className="bg-card rounded-lg px-4 py-2">
                  <span className="font-semibold text-white text-sm">{comment.author.name}</span>
                  <p className="text-gray-200 text-sm">{comment.text}</p>
                </div>
                <span className="text-xs text-gray-500 mt-1">
                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: ptBR })}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;

