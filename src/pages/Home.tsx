// src/pages/Home.tsx

import React from 'react';
import { useAuth } from '../contexts/AuthProvider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
// 1. IMPORTAMOS A INTERFACE 'Post' E O SEU ContentCard
import ContentCard, { Post } from '../components/ContentCard'; 

// --- DADOS DE EXEMPLO (MOCK DATA) ---
const mockOnlineUsers = [
    { id: '1', username: 'loirinhalove', avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1587', gender: 'Mulher' },
    { id: '2', username: 'casal_quente', avatarUrl: 'https://images.unsplash.com/photo-1571560963321-b2613c4a20b9?q=80&w=1587', gender: 'Casal' },
    { id: '3', username: 'rmary', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1664', gender: 'Mulher' },
    { id: '4', username: 'natali', avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1587', gender: 'Mulher' },
    { id: '5', username: 'mymy', avatarUrl: 'https://images.unsplash.com/photo-1531123414780-f74242c2b052?q=80&w=1587', gender: 'Mulher' },
];

// 2. DIZEMOS AO TYPESCRIPT QUE NOSSOS DADOS SEGUEM A REGRA 'Post[]' (uma lista de Posts)
const mockGridPosts: Post[] = [
  { id: 8, userid: 1, media_type: 'image', media_url: 'https://images.unsplash.com/photo-1597589827317-4c6d6e0a90bd?q=80&w=1480', author_name: 'andersonlove', author_avatar_url: 'https://randomuser.me/api/portraits/men/1.jpg', likes_count: 152 },
  { id: 9, userid: 2, media_type: 'image', media_url: 'https://images.unsplash.com/photo-1555952517-2e8e729e0b44?q=80&w=1587', author_name: 'srtahot2025', author_avatar_url: 'https://randomuser.me/api/portraits/women/1.jpg', likes_count: 231 },
  { id: 10, userid: 3, media_type: 'image', media_url: 'https://images.unsplash.com/photo-1519215830219-468f7f22a259?q=80&w=1587', author_name: 'prazeresdavida', author_avatar_url: 'https://randomuser.me/api/portraits/women/2.jpg', likes_count: 98 },
  { id: 11, userid: 4, media_type: 'image', media_url: 'https://images.unsplash.com/photo-1548545819-2708b5e94b28?q=80&w=1470', author_name: 'casal_aventura', author_avatar_url: 'https://randomuser.me/api/portraits/men/2.jpg', likes_count: 412 },
];
// ------------------------------------

const Home: React.FC = () => {
  const { user } = useAuth();

  const handleLike = (postId: number) => {
    console.log(`Curtiu o post ${postId}!`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* ... o resto do seu componente Home.tsx permanece igual ... */}
      {/* (vou omitir para focar na correção) */}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {mockGridPosts.map((post) => (
            <ContentCard
              key={post.id}
              post={post}
              onLike={() => handleLike(post.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;