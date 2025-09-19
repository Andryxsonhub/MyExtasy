// src/components/ProfileHeader.tsx (Versão 100% Dinâmica)

import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin } from 'lucide-react';

// Função para calcular há quanto tempo algo aconteceu (ex: "Membro há 5 minutos")
const timeSince = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " anos";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " meses";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " dias";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " horas";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutos";
    return Math.floor(seconds) + " segundos";
}

// 1. Atualizamos a interface para receber os novos dados do backend
interface UserData {
  name: string;
  location: string | null;
  profilePictureUrl: string | null;
  gender: string | null;
  createdAt: string; // O Prisma envia datas como string no JSON
  lastSeenAt: string | null;
}

interface ProfileHeaderProps {
  user: UserData;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user }) => {
  // Convertemos as datas de string para objeto Date para podermos usá-las
  const memberSinceDate = new Date(user.createdAt);
  const lastSeenDate = user.lastSeenAt ? new Date(user.lastSeenAt) : null;

  return (
    <div className="bg-card rounded-lg shadow-lg overflow-hidden">
      <div className="h-48 bg-gradient-to-r from-purple-600 to-indigo-700 relative" />
      <div className="p-6">
        <div className="flex items-end -mt-24">
          <Avatar className="w-36 h-36 border-4 border-card">
            <AvatarImage src={user.profilePictureUrl || undefined} alt={user.name} />
            <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>

          <div className="ml-6 flex-grow">
            <h1 className="text-3xl font-bold text-white">{user.name}</h1>
            <div className="flex items-center text-sm text-gray-400 mt-1">
              {/* 2. Usamos os dados reais vindos do backend */}
              {user.gender && <span>{user.gender}</span>}
              {user.gender && user.location && <span className="mx-2">•</span>}
              {user.location && (
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{user.location}</span>
                </div>
              )}
            </div>
          </div>

          <div className="text-right">
            <Button variant="secondary">Editar perfil</Button>
            <p className="text-xs text-gray-500 mt-2">
              {/* 3. Usamos a função 'timeSince' para mostrar dados dinâmicos */}
              Membro há {timeSince(memberSinceDate)}
              {lastSeenDate && ` - Último acesso há ${timeSince(lastSeenDate)}`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;