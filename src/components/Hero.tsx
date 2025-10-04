// src/components/Hero.tsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  const handleRegistrationSubmit = (event: React.FormEvent) => {
    event.preventDefault(); // Impede o recarregamento da página
    navigate('/cadastrar'); // Redireciona para a página de cadastro
  };

  return (
    <section 
    className="relative flex justify-center pt-12 pb-12 min-h-[calc(100vh-4rem)] bg-cover bg-center bg-no-repeat px-4"
    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1581704324202-def99403d98a?q=80&w=2070&auto=format&fit=crop')" }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      
      <div className="relative container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Lado Esquerdo: Texto */}
        <div className="text-white text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            Conecte-se com <span className="text-pink-500">Casais Liberais</span>
          </h1>
          <p className="mt-4 text-lg max-w-2xl">
            A maior comunidade brasileira para casais que buscam novas experiências, conexões autênticas e momentos inesquecíveis no mundo do swing.
          </p>
        </div>

        {/* Lado Direito: Formulário */}
        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-lg shadow-2xl max-w-sm mx-auto w-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Quero criar um perfil:</h2>
          {/* O formulário agora redireciona ao ser submetido */}
          <form onSubmit={handleRegistrationSubmit}>
            <div className="mb-4">
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Eu sou:</label>
              <select 
                id="gender" 
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 text-black"
              >
                {/* VALORES ATUALIZADOS AQUI */}
                <option value="">Selecione seu gênero</option>
                <option value="Homem">Homem</option>
                <option value="Mulher">Mulher</option>
                <option value="Casal (Ele/Ela)">Casal (Ele/Ela)</option>
                <option value="Casal (Ele/Ele)">Casal (Ele/Ele)</option>
                <option value="Casal (Ela/Ela)">Casal (Ela/Ela)</option>
                <option value="Transexual">Transexual</option>
                <option value="Crossdresser (CD)">Crossdresser (CD)</option>
                <option value="Travesti">Travesti</option>
              </select>
            </div>
            <button 
              type="submit"
              className="w-full bg-pink-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:bg-pink-700 transition-all duration-300"
            >
              Criar minha conta grátis!
            </button>
            <div className="text-center mt-4">
              <Link to="/entrar" className="text-sm text-gray-600 hover:underline">
                Já tenho cadastro
              </Link>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Hero;