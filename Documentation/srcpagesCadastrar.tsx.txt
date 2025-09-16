// src/pages/Cadastrar.tsx

import React from 'react';
import Layout from '@/components/Layout';
import RegistrationFlow from '@/components/registration/RegistrationFlow'; // O novo componente "cérebro"

const Cadastrar = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[calc(100vh-150px)] relative">
        {/* A página agora apenas renderiza o fluxo de registo */}
        <RegistrationFlow />
      </div>
    </Layout>
  );
};

export default Cadastrar;

