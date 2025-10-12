// src/components/tabs/AboutTabContent.tsx
import React from 'react';
import { Info } from 'lucide-react';
import type { UserData } from '../../types/types';

const ProfileDetailSection: React.FC<{ title: string; content: string | null | undefined }> = ({ title, content }) => {
    if (!content) return null;
    return (
      <div className="mb-8">
        <h3 className="text-xl font-bold text-pink-400 mb-3 border-b-2 border-gray-700 pb-2">{title}</h3>
        <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{content}</p>
      </div>
    );
};
  
const TagsSection: React.FC<{ title: string; content: string | null | undefined }> = ({ title, content }) => {
    if (!content) return null;
    let tags: string[] = [];
    try {
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) { tags = parsed; } 
      else { tags = content.split(',').map(tag => tag.trim()); }
    } catch {
      tags = content.split(',').map(tag => tag.trim());
    }
    const validTags = tags.filter(Boolean);
    if (validTags.length === 0) return null;
    return (
      <div className="mb-8">
        <h3 className="text-xl font-bold text-pink-400 mb-3 border-b-2 border-gray-700 pb-2">{title}</h3>
        <div className="flex flex-wrap gap-3">
          {validTags.map((tag, index) => (
            <span key={index} className="bg-gray-700 text-gray-200 text-sm font-medium px-4 py-2 rounded-full shadow-md">
              {tag.replace(/["[]]/g, '')}
            </span>
          ))}
        </div>
      </div>
    );
};

interface AboutTabContentProps {
    user: UserData;
}

const AboutTabContent: React.FC<AboutTabContentProps> = ({ user }) => {
    const hasAboutInfo = user.bio || user.interests || user.desires || user.fetishes;

    if (!hasAboutInfo) {
        return (
            <div className="text-center text-gray-500 py-16 border-2 border-dashed border-gray-700 rounded-lg">
                <Info className="mx-auto w-12 h-12 text-gray-600 mb-4" />
                <h3 className="text-lg font-semibold text-white">Informações não preenchidas</h3>
                <p className="mt-1">Edite seu perfil para compartilhar mais sobre você.</p>
            </div>
        );
    }

    return (
        <div>
            <ProfileDetailSection title="Biografia" content={user.bio} />
            <TagsSection title="Interesses" content={user.interests} />
            <TagsSection title="Desejos" content={user.desires} />
            <TagsSection title="Fetiches" content={user.fetishes} />
        </div>
    );
};
  
export default AboutTabContent;