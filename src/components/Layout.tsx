// src/components/Layout.tsx (VERSÃO FINAL E CORRETA)

import React, { ReactNode } from 'react';
import Header from './Header';
// Se você tiver um componente de Footer, descomente a linha abaixo
// import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      {/* O padding-top (pt-16) agora mora aqui, para compensar a altura do Header fixo */}
      <main className="flex-grow pt-16">
        {children}
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default Layout;