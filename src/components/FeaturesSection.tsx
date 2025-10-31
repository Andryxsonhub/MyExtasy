// src/components/FeaturesSection.tsx

import React, { useState, Fragment } from 'react';
import { Camera, ShieldCheck, MapPin, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react'; 
import { FaTimes } from 'react-icons/fa'; 

// ---
// CONFIGURE SUAS URLs AQUI
// ---
// ATENÇÃO: Você ainda precisa trocar esta URL pela sua IMAGEM DE CAPA (miniatura)
const THUMBNAIL_URL = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500'; // <-- TROQUE PELA SUA THUMBNAIL

// VÍDEO ATUALIZADO (da pasta /public)
const VIDEO_URL = '/anuncio.mp4'; 
// ---

const features = [
  {
    icon: <Camera size={40} className="text-purple-600" />,
    title: 'Fotos e vídeos amadores',
    description: 'Pessoas como você compartilhando o tesão de verdade!',
  },
  {
    icon: <ShieldCheck size={40} className="text-purple-600" />,
    title: 'Seguro e discreto',
    description: 'Sua privacidade é prioridade. Você no controle de quem pode ver o seu conteúdo.',
  },
  {
    icon: <MapPin size={40} className="text-purple-600" />,
    title: 'Pessoas perto de você',
    description: 'Encontre pessoas perto de você e com os mesmos interesses!',
  },
  {
    icon: <UserPlus size={40} className="text-purple-600" />,
    title: 'Comece hoje! Crie seu perfil grátis',
    description: 'O que você está esperando? Junte-se a nós agora mesmo!',
  },
];

const FeaturesSection = () => {
  const [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <section className="bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800">O que te espera no MyExtasyClub</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Coluna de Features */}
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
            <div className="bg-white p-6 rounded-lg shadow-md text-center sm:col-span-2">
                 <Link to="/cadastrar">
                    <button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:opacity-90 transition-opacity">
                        Criar minha conta grátis!
                    </button>
                 </Link>
            </div>
          </div>

          {/* COLUNA DO VÍDEO (GATILHO) */}
          <div 
            onClick={openModal} 
            className="relative group w-full max-w-sm mx-auto cursor-pointer" 
          >
            <img 
              src={THUMBNAIL_URL} // <-- Usando a variável da thumbnail
              alt="Boas-vindas ao MyExtasyClub" 
              className="w-full h-auto rounded-lg shadow-2xl"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-lg">
              <button className="bg-white/30 backdrop-blur-sm p-4 rounded-full text-white group-hover:bg-white/50 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <p className="absolute bottom-4 left-0 right-0 text-center text-white font-bold">Bem-vindo(a) ao MyExtasyClub</p>
          </div>
        </div>
      </div>

      {/* O MODAL DE VÍDEO */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
          
          {/* Overlay de fundo */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-75" />
          </Transition.Child>

          {/* Conteúdo do Modal */}
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="relative w-full max-w-4xl transform overflow-hidden rounded-lg bg-black shadow-xl transition-all">
                  
                  <button
                    onClick={closeModal}
                    className="absolute top-2 right-2 z-10 p-2 text-white opacity-70 hover:opacity-100"
                  >
                    <FaTimes className="h-6 w-6" /> {/* Ícone de fechar */}
                  </button>

                  {/* Player de Vídeo */}
                  <div className="aspect-video"> 
                    <video
                      className="w-full h-full"
                      src={VIDEO_URL} // <-- VÍDEO ATUALIZADO
                      controls
                      autoPlay
                      loop
                    >
                      Seu navegador não suporta a tag de vídeo.
                    </video>
                  </div>

                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </section>
  );
};

export default FeaturesSection;