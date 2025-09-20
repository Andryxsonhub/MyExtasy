// src/components/Header.tsx (VERSÃO FINAL E CORRIGIDA)

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthProvider';
import newLogo from '../assets/logo_sem_fundo_limpo.png';
import api from '../services/api'; // ALTERAÇÃO 1: Troca 'axios' por 'api'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Header: React.FC = () => {
  const { isLoggedIn, setIsLoggedIn, user, setUser } = useAuth();
  const navigate = useNavigate();
  
  const homeLink = isLoggedIn ? '/home' : '/';

  const handleLogout = async () => {
    try {
      // ALTERAÇÃO 2: A chamada de logout agora usa o 'api' padronizado.
      // A URL e as credenciais são tratadas automaticamente.
      await api.post('/auth/logout');
    } catch (error) {
      // Mesmo se a chamada falhar, o logout no frontend deve acontecer.
      console.error("Erro no logout do servidor, mas deslogando localmente:", error);
    } finally {
      // Esta parte é a mais importante para a experiência do usuário.
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