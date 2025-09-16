import React from 'react';
import Layout from '@/components/Layout';

const Sobre = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 pt-20 text-center">
        <h1 className="text-4xl font-extrabold text-white mb-4">Sobre Nós</h1>
        <p className="text-lg text-gray-400">
          Somos a maior comunidade brasileira para casais que buscam novas experiências,
          conexões autênticas e momentos inesquecíveis no mundo do swing.
        </p>
      </div>
    </Layout>
  );
};

export default Sobre;
