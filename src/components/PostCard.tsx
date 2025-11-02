// Arquivo: src/components/PostCard.tsx
// --- ATUALIZADO (Muda o fundo de 'bg-gray-800' para 'bg-card') ---

import React from 'react';

interface Post {
  id: number;
  content: string;
  createdAt: string;
}

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    // ==========================================================
    // ★★★ ALTERAÇÃO DAS CORES (bg-card) ★★★
    // ==========================================================
    <div className="bg-card p-4 rounded-lg border border-border">
    {/* ========================================================== */}
      <p className="text-white whitespace-pre-wrap">{post.content}</p>
      <p className="text-xs text-gray-500 mt-2 text-right">
        {new Date(post.createdAt).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
      </p>
    </div>
  );
};

export default PostCard;

