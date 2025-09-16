// src/pages/Lives.tsx

import React from 'react';
import Layout from '@/components/Layout';
import { Video } from 'lucide-react'; // Importando um ícone

const Lives = () => {
  // No futuro, aqui você buscaria a lista de lives de uma API
  const activeLives: any[] = []; // Array vazio para simular nenhuma live no momento

  return (
    <Layout>
      <div className="bg-background text-foreground min-h-screen">
        {/* Adicionado padding-top (pt-24) para criar espaço para o header fixo */}
        <div className="container mx-auto px-4 pt-24 pb-12">
          {/* Título e Subtítulo */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold text-white mb-2">Lives</h1>
            <p className="text-lg text-gray-400">
              Acompanhe nossas transmissões ao vivo e eventos futuros.
            </p>
          </div>

          {/* Conteúdo da Página de Lives */}
          {activeLives.length > 0 ? (
            // Se houver lives, elas seriam renderizadas aqui
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Exemplo de como seria um card de live */}
              {/* {activeLives.map(live => <LiveCard key={live.id} {...live} />)} */}
            </div>
          ) : (
            // Mensagem para quando não houver lives
            <div className="flex flex-col items-center justify-center text-center h-[40vh] text-gray-500">
              <Video className="w-16 h-16 mb-4" />
              <h2 className="text-2xl font-bold text-white">Nenhuma live no momento</h2>
              <p className="text-gray-400 mt-2">
                Fique de olho para não perder nossas próximas transmissões!
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Lives;
