// src/components/Header.tsx (VERSÃO CORRIGIDA)
// Correção: Removido "hidden sm:" da classe do contador de pimentas para exibi-lo no mobile.

import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthProvider'; // <-- JÁ ESTAVA CORRETO
import newLogo from '../assets/logo_sem_fundo_limpo.png';
import api from '../services/api'; 
import PimentaShopModal from './PimentaShopModal';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  // 1. Pegamos a função 'logout' do nosso AuthProvider. Não precisamos mais do 'setUser'.
  const { isLoggedIn, user, logout } = useAuth(); 
  
  const navigate = useNavigate();
  const [isShopOpen, setShopOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const homeLink = isLoggedIn ? '/home' : '/';

  // 2. A função 'handleLogout' local foi REMOVIDA. 
  //    Não precisamos mais dela, pois vamos usar a função centralizada do AuthProvider.

  const avatarUrl = user?.profilePictureUrl
    ? `<img src={user.profilePictureUrl} />` // Nota: Isto pode estar errado. Se avatarUrl for usado em <AvatarImage src={avatarUrl}>, ele deve ser apenas a string da URL.
    : undefined;

  // CORREÇÃO: Se 'avatarUrl' for apenas a URL, o correto seria:
  const finalAvatarUrl = user?.profilePictureUrl || undefined;

  return (
    <> 
      <header className="bg-background/95 fixed top-0 w-full z-50 border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          
          <NavLink to={homeLink} className="flex items-center space-x-3">
            <img src={newLogo} alt="MyExtasyClub Logo" className="h-8 flex-shrink-0" />
            <span className="text-xl font-bold text-white mt-0.5 hidden sm:inline">MyExtasyClub</span>
          </NavLink>

          {isLoggedIn && (
            <nav className="hidden md:flex items-center space-x-6">
                <NavLink to="/home" className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'text-white hover:text-gray-300'}`}>Home</NavLink>
                <NavLink to="/meu-perfil" className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'text-white hover:text-gray-300'}`}>Meu Perfil</NavLink>
                <NavLink to="/explorar" className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'text-white hover:text-gray-300'}`}>Explorar</NavLink>
                <NavLink to="/lives" className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'text-white hover:text-gray-300'}`}>Lives</NavLink>
                <NavLink to="/planos" className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'text-white hover:text-gray-300'}`}>Planos</NavLink>
                <NavLink to="/sugestoes" className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'text-white hover:text-gray-300'}`}>Sugestoes</NavLink>
            </nav>
          )}
          
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                {/* ============================================================
                  AQUI ESTÁ A CORREÇÃO:
                  Removido "hidden" e "sm:flex" e deixado apenas "flex"
                  para o contador de pimentas aparecer no mobile.
                  ============================================================
                */}
                <div className="flex items-center gap-2 bg-black/30 px-3 py-1.5 rounded-full border border-gray-700">
                  <span className="text-xl" role="img" aria-label="pimenta">🌶️</span>
                  <span className="text-base font-bold text-white">{user?.pimentaBalance ?? 0}</span>
                </div>
                
                <Button 
                  onClick={() => setShopOpen(true)} 
                  variant="destructive" 
                  className="bg-pink-600 hover:bg-pink-700 text-white font-bold hidden sm:inline-flex items-center gap-2"
                >
                  Comprar Pimentas
                </Button>
                
                <NavLink to="/meu-perfil">
                  <Avatar className="h-9 w-9">
                    {/* Pequena correção aqui também: 
                      Passe a URL diretamente para 'src', em vez da string com <img> 
                    */}
                    <AvatarImage src={finalAvatarUrl} alt={user?.name} />
                    <AvatarFallback>{user?.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </NavLink>
                
                {/* 3. Usamos a função 'logout' diretamente aqui */}
                <Button onClick={logout} variant="ghost" className="text-white hidden sm:inline-flex">Sair</Button>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <NavLink to="/entrar"><Button variant="ghost" className="text-white">Entrar</Button></NavLink>
                <NavLink to="/cadastrar"><Button>Cadastrar</Button></NavLink>
              </div>
            )}
            {isLoggedIn && (
              <div className="md:hidden">
                <Button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} variant="ghost" size="icon">
                  {isMobileMenuOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
                </Button>
              </div>
            )}
          </div>
        </div>

        {isMobileMenuOpen && isLoggedIn && (
          <div className="md:hidden bg-background border-t border-border">
            <nav className="container mx-auto px-4 pt-4 pb-4 flex flex-col space-y-2">
              <Button 
                  onClick={() => {
                      setShopOpen(true);
                      setIsMobileMenuOpen(false);
                  }} 
                  className="w-full justify-center py-2 text-base bg-pink-600 text-white h-auto mb-2"
              >
                  Comprar Pimentas 🌶️
              </Button>
              <NavLink to="/home" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => `block text-center py-2 text-base ${isActive ? 'text-primary' : 'text-white'}`}>Home</NavLink>
              <NavLink to="/meu-perfil" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => `block text-center py-2 text-base ${isActive ? 'text-primary' : 'text-white'}`}>Meu Perfil</NavLink>
              <NavLink to="/explorar" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => `block text-center py-2 text-base ${isActive ? 'text-primary' : 'text-white'}`}>Explorar</NavLink>
              <NavLink to="/lives" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => `block text-center py-2 text-base ${isActive ? 'text-primary' : 'text-white'}`}>Lives</NavLink>
              <NavLink to="/planos" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => `block text-center py-2 text-base ${isActive ? 'text-primary' : 'text-white'}`}>Planos</NavLink>
              <NavLink to="/sugestoes" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => `block text-center py-2 text-base ${isActive ? 'text-primary' : 'text-white'}`}>Sugestoes</NavLink>
              {/* 3. E usamos a função 'logout' aqui também, para o menu mobile */}
              <Button onClick={() => { logout(); setIsMobileMenuOpen(false); }} variant="ghost" className="text-white justify-center py-2 h-auto text-base mt-2 border-t border-border rounded-none">Sair</Button>
            </nav>
          </div>
        )}
      </header>

      <PimentaShopModal 
        isOpen={isShopOpen} 
        onClose={() => setShopOpen(false)} 
      />
    </>
  );
};

export default Header;