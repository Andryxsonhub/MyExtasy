// src/pages/Lives.tsx (VERSÃO 100% COMPLETA E CORRIGIDA)

import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Link } from 'react-router-dom';
import { Video, Wifi } from 'lucide-react';
import api from '@/services/api';
import LiveControls from '@/components/LiveControls';
import { io } from 'socket.io-client';

interface LiveUser {
  id: number;
  name: string;
  profilePictureUrl: string | null;
}

const Lives: React.FC = () => {
  const [liveUsers, setLiveUsers] = useState<LiveUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLiveUsers = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/lives/active');
        if (Array.isArray(response.data)) {
          setLiveUsers(response.data);
        }
      } catch (error) {
        console.error("Erro ao buscar usuários ao vivo:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLiveUsers();
  }, []);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:3333');

    socket.on('live_started', (newLiveUser: LiveUser) => {
      setLiveUsers((currentUsers) => {
        if (!currentUsers.some(user => user.id === newLiveUser.id)) {
          return [...currentUsers, newLiveUser];
        }
        return currentUsers;
      });
    });

    socket.on('live_stopped', (data: { userId: number }) => {
      setLiveUsers((currentUsers) => currentUsers.filter(user => user.id !== data.userId));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Layout>
      <div className="bg-background text-foreground min-h-screen">
        <div className="container mx-auto px-4 pt-24 pb-12">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold text-white mb-2">Lives</h1>
            <p className="text-lg text-gray-400">
              Acompanhe nossas transmissões ao vivo ou comece a sua!
            </p>
          </div>

          <div className="mb-12 max-w-lg mx-auto">
            <LiveControls />
          </div>

          {isLoading ? (
            <p className="text-center text-white">Carregando lives...</p>
          ) : liveUsers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {liveUsers.map(user => (
                // AQUI ESTÁ A CORREÇÃO PRINCIPAL DESTE ARQUIVO
                <Link to={`/live/live-${user.id}`} key={user.id} className="group block bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300">
                  <div className="relative">
                    <img
                      src={user.profilePictureUrl || `https://i.pravatar.cc/400?u=${user.id}`}
                      alt={`Live de ${user.name}`}
                      className="w-full h-auto aspect-video object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 text-sm font-bold rounded flex items-center gap-1">
                      <Wifi size={16} />
                      <span>AO VIVO</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-white truncate group-hover:text-primary">{`Live de ${user.name}`}</h3>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center h-[40vh] text-gray-500">
              <Video className="w-16 h-16 mb-4" />
              <h2 className="text-2xl font-bold text-white">Nenhuma live no momento</h2>
              <p className="mt-2">Que tal ser o primeiro a começar?</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Lives;