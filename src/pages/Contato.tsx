import React from 'react';
import Layout from '@/components/Layout';

const Contato = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 pt-20 text-center">
        <h1 className="text-4xl font-extrabold text-white mb-4">Fale Conosco</h1>
        <p className="text-lg text-gray-400">
          Entre em contato conosco através do nosso e-mail. Teremos prazer em ajudar!
        </p>
      </div>
    </Layout>
  );
};

export default Contato;
