// src/components/Header.tsx

import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { useAuth } from '../hooks/useAuth';
import { Menu, X } from 'lucide-react';
import newLogo from '../assets/logo_sem_fundo_limpo.png';

const Header: React.FC = () => {
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const navigate = useNavigate();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // CORREÇÃO 2: O link da logo agora aponta para /home quando logado
  const homeLink = isLoggedIn ? '/home' : '/';

  const handleLogout = () => {
    localStorage.removeItem('authToken');  
    setIsLoggedIn(false);
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  const handleNavClick = (path: string) => {
    setIsMobileMenuOpen(false);
    navigate(path);
  };

  return (
    <header className="bg-background/95 fixed top-0 w-full z-50 border-b border-border mb-16">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        
        {/* Logo e Nome do Site */}
        <NavLink to={homeLink} className="flex items-center space-x-3" onClick={() => setIsMobileMenuOpen(false)}>
          <img src={newLogo} alt="MyExtasyClub Logo" className="h-8 flex-shrink-0" />
          <span className="text-xl font-bold text-white mt-0.5">MyExtasyClub</span>
        </NavLink>

        {/* --- NAVEGAÇÃO DESKTOP CORRIGIDA --- */}
        <nav className="hidden md:flex items-center space-x-6">
          {isLoggedIn && (
            <>
              {/* CORREÇÃO 1: O link da Home foi adicionado de volta */}
              <NavLink to="/home" className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'text-white hover:text-gray-300'}`}>Home</NavLink>
              
              <NavLink to="/dashboard" className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'text-white hover:text-gray-300'}`}>Meu Perfil</NavLink>
              <NavLink to="/explorar" className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'text-white hover:text-gray-300'}`}>Explorar</NavLink>
              <NavLink to="/lives" className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'text-white hover:text-gray-300'}`}>Lives</NavLink>
              <NavLink to="/planos" className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'text-white hover:text-gray-300'}`}>Planos</NavLink>
              <NavLink to="/sugestoes" className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'text-white hover:text-gray-300'}`}>Sugestões</NavLink>
            </>
          )}
        </nav>
        
        {/* Botões de Entrar/Sair */}
        <div className="hidden md:flex items-center space-x-2">
            {isLoggedIn ? (
                <Button onClick={handleLogout} variant="ghost" className="text-white">Sair</Button>
            ) : (
                <>
                    <NavLink to="/entrar"><Button variant="ghost" className="text-white">Entrar</Button></NavLink>
                    <NavLink to="/cadastrar"><Button>Cadastrar</Button></NavLink>
                </>
            )}
        </div>

        {/* Menu Mobile */}
        <div className="md:hidden">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white">
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Estrutura do menu mobile (sem alterações na lógica) */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background border-t border-border">
          {/* Adicione os links aqui se quiser que apareçam no menu mobile também */}
        </div>
      )}
    </header>
  );
};

export default Header;