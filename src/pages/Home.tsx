// src/pages/Home.tsx

import Layout from '@/components/Layout'; // Assumindo que você tenha um Layout
import React from 'react';

const Home: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-24 text-white">
        <h1 className="text-4xl font-bold mb-4">Bem-vindo à Home!</h1>
        <p className="text-lg">Esta é a sua página principal após o login.</p>
        
        {/* Futuramente, você pode adicionar seus componentes aqui */}
        {/* Ex: <Feed /> <Stories /> <SugestoesDeAmigos /> */}
      </div>
    </Layout>
  );
};

export default Home;