// src/components/Layout.tsx (VERSÃO CORRIGIDA - Footer Removido)

import React, { ReactNode } from 'react';
// ALTERAÇÃO 1: REMOVIDO import do Header e Footer, pois são renderizados no App.tsx
// import Header from './Header';
// import Footer from './Footer'; 

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    // O div principal pode continuar, ele ajuda a garantir a estrutura
    // Removido min-h-screen e bg-background daqui, pois App.tsx já controla isso
    <div className="flex flex-col flex-grow"> 
      {/* Header não é mais necessário aqui */}
      {/* <Header /> */}
      {/* A main agora só contém os filhos, o App.tsx cuida do padding do Header */}
      <main className="flex-grow"> 
        {children}
      </main>
      {/* ALTERAÇÃO 2: A linha que renderizava o Footer foi REMOVIDA daqui */}
      {/* <Footer /> */}
    </div>
  );
};

export default Layout;