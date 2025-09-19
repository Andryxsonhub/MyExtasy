// Arquivo: src/components/PostList.tsx

import React from 'react';
import PostCard from './PostCard';

interface Post {
  id: number;
  content: string;
  createdAt: string;
}

interface PostListProps {
  posts: Post[];
}

const PostList: React.FC<PostListProps> = ({ posts }) => {
  return (
    <div className="space-y-6">
      {posts.length > 0 ? (
        posts.map(post => <PostCard key={post.id} post={post} />)
      ) : (
        <p className="text-gray-400 text-center py-8">Nenhuma publicação encontrada.</p>
      )}
    </div>
  );
};

export default PostList;