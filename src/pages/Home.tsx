// src/pages/Home.tsx

import React from 'react';
import { useAuth } from '../contexts/AuthProvider'; // Importa o hook para pegar dados do usuário

const Home: React.FC = () => {
  const { user } = useAuth(); // Pega os dados do usuário logado

  return (
    <div className="container mx-auto px-4 py-12 text-white">
      <h1 className="text-4xl font-bold mb-4">
        {/* Mostra uma mensagem de boas-vindas personalizada */}
        Bem-vindo(a), {user?.displayName || user?.username || 'Usuário'}!
      </h1>
      <p className="text-lg">Esta é a sua página principal após o login.</p>
    </div>
  );
};

export default Home;