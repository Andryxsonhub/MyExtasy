// src/components/UserProfile.tsx

import React from 'react';

interface UserProfileProps {
  name: string;
  email: string;
  bio: string;
  profilePictureUrl: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ name, email, bio, profilePictureUrl }) => {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-8 text-white text-center">
      <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-pink-600 mb-6">
        <img 
          src={profilePictureUrl} 
          alt={`Foto de perfil de ${name}`} 
          className="w-full h-full object-cover" 
        />
      </div>
      <h2 className="text-2xl font-bold mb-2">{name}</h2>
      <p className="text-pink-400 mb-4">{email}</p>
      <p className="text-gray-400 text-sm italic">{bio}</p>
    </div>
  );
};

export default UserProfile;