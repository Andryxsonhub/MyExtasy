import React from 'react';
import Layout from '@/components/Layout';

const Sobre = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 pt-24 text-center flex flex-col items-center">
        
        {/* Título Principal */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-10">
          Myextasyclub
        </h1>

        {/* Bloco de Texto (Com largura limitada para facilitar a leitura em telas grandes) */}
        <div className="max-w-3xl space-y-8 text-lg md:text-xl text-gray-300 leading-relaxed">
          
          <p>
            A <strong className="text-pink-500">Myextasyclub</strong> nasceu para oferecer experiências únicas, autênticas e fora do comum. 
            Somos mais do que uma empresa — somos um conceito que une exclusividade, conexão e liberdade de viver momentos intensos.
          </p>

          <p>
            Acreditamos que cada detalhe importa. Por isso, criamos ambientes, experiências e oportunidades pensadas para quem busca algo diferente, com personalidade e atitude.
          </p>

          {/* Frase de Efeito Final */}
          <div className="pt-6">
            <p className="font-bold text-2xl text-white">
              Aqui, o comum não tem espaço.
            </p>
            <p className="text-pink-500 font-bold text-xl mt-2">
              Myextasyclub é para quem quer sentir, viver e lembrar.
            </p>
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default Sobre;