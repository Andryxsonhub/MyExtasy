// src/pages/Lives.tsx (VERSÃO CORRIGIDA)

import React from 'react';
import Layout from '@/components/Layout';
import { Link } from 'react-router-dom';
import { Video, Wifi } from 'lucide-react';

const mockLives = [
  {
    id: '1',
    title: 'Desenvolvendo a feature de chat ao vivo',
    streamerName: 'Dev_Master',
    thumbnailUrl: 'https://via.placeholder.com/400x225.png/8B5CF6/FFFFFF?text=Live+de+C%C3%B3digo',
    category: 'Programação',
  },
  {
    id: '2',
    title: 'Analisando o design do novo perfil',
    streamerName: 'UX_Guru',
    thumbnailUrl: 'https://via.placeholder.com/400x225.png/10B981/FFFFFF?text=Live+de+Design',
    category: 'Design',
  },
  {
    id: '3',
    title: 'Sessão de Perguntas e Respostas',
    streamerName: 'Comunidade',
    thumbnailUrl: 'https://via.placeholder.com/400x225.png/F59E0B/FFFFFF?text=Q%26A+ao+Vivo',
    category: 'Bate-papo',
  },
];

const Lives = () => {
  return (
    <Layout>
      <div className="bg-background text-foreground min-h-screen">
        <div className="container mx-auto px-4 pt-24 pb-12">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold text-white mb-2">Lives</h1>
            <p className="text-lg text-gray-400">
              Acompanhe nossas transmissões ao vivo e eventos futuros.
            </p>
          </div>

          {mockLives.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {mockLives.map(live => (
                // A MUDANÇA ESTÁ AQUI ABAIXO
                <Link to={`/live/${live.id}`} key={live.id} className="group block bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300">
                  <div className="relative">
                    <img src={live.thumbnailUrl} alt={`Thumbnail da live ${live.title}`} className="w-full h-auto" />
                    <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 text-sm font-bold rounded flex items-center gap-1">
                      <Wifi size={16} />
                      <span>AO VIVO</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-white truncate group-hover:text-primary">{live.title}</h3>
                    <p className="text-gray-400 text-sm">{live.streamerName}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center h-[40vh] text-gray-500">
              <Video className="w-16 h-16 mb-4" />
              <h2 className="text-2xl font-bold text-white">Nenhuma live no momento</h2>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Lives;