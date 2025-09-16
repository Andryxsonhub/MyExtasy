// src/components/LikeButton.tsx

import React from 'react';
import { Heart } from 'lucide-react'; // Ícone de coração

interface LikeButtonProps {
  likes: number;
  onLike: () => void;
}

const LikeButton: React.FC<LikeButtonProps> = ({ likes, onLike }) => {
  return (
    <button 
      onClick={onLike} 
      className="flex items-center space-x-1 bg-pink-600 text-white text-sm px-3 py-1 rounded-full hover:bg-pink-700 transition-colors"
    >
      <Heart size={16} fill="white" /> {/* Coração preenchido */}
      <span>{likes}</span>
    </button>
  );
};

export default LikeButton;