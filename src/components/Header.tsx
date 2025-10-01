
// src/components/Header.tsx (VERSÃO COM CONTADOR DE PIMENTAS)

import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthProvider';
import newLogo from '../assets/logo_sem_fundo_limpo.png';
import api from '../services/api'; 

import PimentaShopModal from './PimentaShopModal';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Header: React.FC = () => {
  const { isLoggedIn, setIsLoggedIn, user, setUser } = useAuth();
  const navigate = useNavigate();
  const [isShopOpen, setShopOpen] = useState(false);

  const homeLink = isLoggedIn ? '/home' : '/';

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error("Erro no logout do servidor, mas deslogando localmente:", error);
    } finally {
      localStorage.removeItem('authToken');
      setIsLoggedIn(false);
      setUser(null);
      navigate('/');
    }
  };

  return (
    <> 
      <header className="bg-background/95 fixed top-0 w-full z-50 border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          
          <NavLink to={homeLink} className="flex items-center space-x-3">
            <img src={newLogo} alt="MyExtasyClub Logo" className="h-8 flex-shrink-0" />
            <span className="text-xl font-bold text-white mt-0.5 hidden sm:inline">MyExtasyClub</span>
          </NavLink>


          {/* --- NAVEGAÇÃO PARA USUÁRIOS LOGADOS --- */}
          {isLoggedIn && (
            <nav className="hidden md:flex items-center space-x-6">
                <NavLink to="/home" className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'text-white hover:text-gray-300'}`}>Home</NavLink>
                <NavLink to="/meu-perfil" className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'text-white hover:text-gray-300'}`}>Meu Perfil</NavLink>
                <NavLink to="/explorar" className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'text-white hover:text-gray-300'}`}>Explorar</NavLink>
                <NavLink to="/lives" className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'text-white hover:text-gray-300'}`}>Lives</NavLink>
                <NavLink to="/planos" className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'text-white hover:text-gray-300'}`}>Planos</NavLink>
                <NavLink to="/sugestoes" className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'text-white hover:text-gray-300'}`}>Sugestoes</NavLink>
                <NavLink to="/sobre" className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'text-white hover:text-gray-300'}`}>Sobre</NavLink>
            </nav>
          )}
          
          {/* --- NAVEGAÇÃO PARA VISITANTES --- */}
          {!isLoggedIn && (
            <nav className="hidden md:flex items-center space-x-6">
                <NavLink to="/sobre" className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'text-white hover:text-gray-300'}`}>Sobre</NavLink>
            </nav>
          )}
          
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              // --- AVATAR E BOTÕES LOGADOS ---
              <>
                {/* =========================================================
                == ALTERAÇÃO AQUI: Adição do contador de saldo de pimentas ==
                ==========================================================
                */}
                <div className="hidden sm:flex items-center gap-2 bg-black/30 px-3 py-1.5 rounded-full border border-gray-700">
                  <span className="text-xl" role="img" aria-label="pimenta">🌶️</span>
                  <span className="text-base font-bold text-white">{user?.pimentaBalance ?? 0}</span>
                </div>

                {/* BOTÃO PARA COMPRAR PIMENTAS */}
                <Button 
                  onClick={() => setShopOpen(true)} 
                  variant="destructive" 
                  className="bg-pink-600 hover:bg-pink-700 text-white font-bold hidden sm:inline-flex items-center gap-2"
                >
                  Comprar Pimentas
                </Button>
                
                <NavLink to="/meu-perfil">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user?.photos?.[0]?.value} alt={user?.username} />
                    <AvatarFallback>{user?.username?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </NavLink>

                <Button onClick={handleLogout} variant="ghost" className="text-white hidden sm:inline-flex">Sair</Button>

              </>
            ) : (
                // --- BOTÕES DE ENTRAR E CADASTRAR ---
                <div className="flex items-center space-x-2">
                  <NavLink to="/entrar"><Button variant="ghost" className="text-white">Entrar</Button></NavLink>
                  <NavLink to="/cadastrar"><Button>Cadastrar</Button></NavLink>
                </div>
              )}
          </div>

        </div>
      </header>

      {/* RENDERIZA O MODAL */}
      <PimentaShopModal 
        isOpen={isShopOpen} 
        onClose={() => setShopOpen(false)} 
      />
    </>
  );
};

export default Header;