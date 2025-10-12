// src/components/Layout.tsx (VERSÃO FINAL E CORRETA)

import React, { ReactNode } from 'react';
import Header from './Header';
// ALTERAÇÃO 1: Importamos o Footer para poder usá-lo
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      {/* ALTERAÇÃO 2: Descomentamos a linha para renderizar o Footer */}
      <Footer />
    </div>
  );
};

export default Layout;