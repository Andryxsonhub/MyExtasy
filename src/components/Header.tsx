// src/components/Header.tsx (Versão Corrigida)

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthProvider';
import newLogo from '../assets/logo_sem_fundo_limpo.png';
import axios from 'axios';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Header: React.FC = () => {
  const { isLoggedIn, setIsLoggedIn, user, setUser } = useAuth();
  const navigate = useNavigate();
  
  const homeLink = isLoggedIn ? '/home' : '/';

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:3001/api/auth/logout', {}, { withCredentials: true });
    } catch (error) {
      console.error("Erro no logout:", error);
    } finally {
      localStorage.removeItem('authToken');
      setIsLoggedIn(false);
      setUser(null);
      navigate('/');
    }
  };

  return (
    <header className="bg-background/95 fixed top-0 w-full z-50 border-b border-border">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        
        <NavLink to={homeLink} className="flex items-center space-x-3">
          <img src={newLogo} alt="MyExtasyClub Logo" className="h-8 flex-shrink-0" />
          <span className="text-xl font-bold text-white mt-0.5 hidden sm:inline">MyExtasyClub</span>
        </NavLink>

        {/* --- NAVEGAÇÃO DESKTOP NA ORDEM CORRETA --- */}
        {isLoggedIn && (
          <nav className="hidden md:flex items-center space-x-6">
              <NavLink to="/home" className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'text-white hover:text-gray-300'}`}>Home</NavLink>
              {/* MUDANÇA 1: Rota corrigida aqui */}
              <NavLink to="/meu-perfil" className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'text-white hover:text-gray-300'}`}>Meu Perfil</NavLink>
              <NavLink to="/explorar" className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'text-white hover:text-gray-300'}`}>Explorar</NavLink>
              <NavLink to="/lives" className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'text-white hover:text-gray-300'}`}>Lives</NavLink>
              <NavLink to="/planos" className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'text-white hover:text-gray-300'}`}>Planos</NavLink>
              <NavLink to="/sugestoes" className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'text-white hover:text-gray-300'}`}>Sugestões</NavLink>
          </nav>
        )}
        
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            // --- AVATAR E BOTÃO DE SAIR ---
            <>
              <Button onClick={handleLogout} variant="ghost" className="text-white hidden sm:inline-flex">Sair</Button>
              {/* MUDANÇA 2: Rota do avatar corrigida aqui */}
              <NavLink to="/meu-perfil">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user?.photos?.[0]?.value} alt={user?.username} />
                  <AvatarFallback>{user?.username?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
              </NavLink>
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
  );
};

export default Header;