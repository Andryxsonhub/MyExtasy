// src/components/Header.tsx
// --- ★★★ ATUALIZADO: Ícone de Mensagens adicionado ao lado do Sino ★★★ ---

import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthProvider'; 
import newLogo from '@/assets/logo_sem_fundo_limpo.png'; // Mantido apenas para fallback de deslogado
import PimentaShopModal from '@/components/PimentaShopModal';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, X, Bell, Heart, MessageCircle, LogOut } from 'lucide-react';

// Dados simulados de notificação para visualização (depois ligaremos na API)
const MOCK_NOTIFICATIONS = [
  { id: 1, type: 'like', text: 'Loirinhabdsm curtiu sua foto.', time: '2 min', read: false },
  { id: 2, type: 'comment', text: 'Casal_hot comentou no seu vídeo.', time: '1h', read: false },
  { id: 3, type: 'like', text: 'Pedro_22 curtiu seu perfil.', time: '3h', read: true },
];

const Header: React.FC = () => {
  const { isLoggedIn, user, logout } = useAuth(); 
  const navigate = useNavigate();
  const [isShopOpen, setShopOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Controle do menu de notificações
  const [isNotificationsOpen, setNotificationsOpen] = useState(false);
  const unreadCount = MOCK_NOTIFICATIONS.filter(n => !n.read).length;

  const homeLink = isLoggedIn ? '/home' : '/';
  const finalAvatarUrl = user?.profilePictureUrl || undefined;

  return (
    <> 
      <header className="bg-background/95 fixed top-0 w-full z-50 border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          
          {/* ========================================================
              LADO ESQUERDO: Avatar do Perfil (se logado) ou Logo
             ======================================================== */}
          <div className="flex items-center space-x-3">
            {isLoggedIn ? (
               <NavLink to="/meu-perfil" className="flex items-center gap-2 group">
                 <Avatar className="h-10 w-10 border-2 border-transparent group-hover:border-primary transition-all">
                   <AvatarImage src={finalAvatarUrl} alt={user?.name} />
                   <AvatarFallback>{user?.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                 </Avatar>
                 {/* Opcional: Mostrar nome ao lado do avatar */}
                 <span className="text-sm font-bold text-white hidden sm:block group-hover:text-primary transition-colors">
                    {user?.name?.split(' ')[0]}
                 </span>
               </NavLink>
            ) : (
              // Se NÃO estiver logado, mantemos o logo padrão
              <NavLink to={homeLink} className="flex items-center space-x-3">
                <img src={newLogo} alt="MyExtasyClub Logo" className="h-8 flex-shrink-0" />
                <span className="text-xl font-bold text-white mt-0.5 hidden sm:inline">MyExtasyClub</span>
              </NavLink>
            )}
          </div>

          {/* ========================================================
              MENU CENTRAL (Desktop)
             ======================================================== */}
          {isLoggedIn && (
            <nav className="hidden md:flex items-center space-x-6 absolute left-1/2 transform -translate-x-1/2">
                <NavLink to="/home" className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'text-white hover:text-gray-300'}`}>Home</NavLink>
                <NavLink to="/explorar" className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'text-white hover:text-gray-300'}`}>Explorar</NavLink>
                <NavLink to="/lives" className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'text-white hover:text-gray-300'}`}>Lives</NavLink>
                <NavLink to="/planos" className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'text-white hover:text-gray-300'}`}>Planos</NavLink>
            </nav>
          )}
          
          {/* ========================================================
              LADO DIREITO: CHAT -> SINO -> Pimentas -> Comprar -> SAIR
             ======================================================== */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {isLoggedIn ? (
              <>
                {/* 0. BOTÃO DE MENSAGENS (CHAT) */}
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-white hover:bg-white/10"
                    onClick={() => navigate('/mensagens')}
                    title="Mensagens"
                >
                    <MessageCircle className="h-6 w-6" />
                </Button>

                {/* 1. SINO DE NOTIFICAÇÕES */}
                <div className="relative">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="relative text-white hover:bg-white/10"
                        onClick={() => setNotificationsOpen(!isNotificationsOpen)}
                    >
                        <Bell className="h-6 w-6" />
                        {unreadCount > 0 && (
                            <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-background animate-pulse" />
                        )}
                    </Button>

                    {/* DROPDOWN DE NOTIFICAÇÕES */}
                    {isNotificationsOpen && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setNotificationsOpen(false)}></div>
                            <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-lg shadow-xl z-50 overflow-hidden" style={{ marginRight: '-50px' }}>
                                <div className="p-3 border-b border-border flex justify-between items-center bg-muted/50">
                                    <h3 className="font-semibold text-sm">Notificações</h3>
                                    {unreadCount > 0 && <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">{unreadCount} novas</span>}
                                </div>
                                <div className="max-h-[300px] overflow-y-auto">
                                    {MOCK_NOTIFICATIONS.length > 0 ? (
                                        MOCK_NOTIFICATIONS.map((notif) => (
                                            <div key={notif.id} className={`p-3 border-b border-border/50 hover:bg-muted/50 transition-colors cursor-pointer flex gap-3 ${!notif.read ? 'bg-primary/5' : ''}`}>
                                                <div className={`mt-1 h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${notif.type === 'like' ? 'bg-pink-500/10 text-pink-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                                    {notif.type === 'like' ? <Heart size={14} fill="currentColor" /> : <MessageCircle size={14} />}
                                                </div>
                                                <div>
                                                    <p className="text-sm text-foreground leading-tight">{notif.text}</p>
                                                    <span className="text-xs text-muted-foreground mt-1 block">{notif.time}</span>
                                                </div>
                                                {!notif.read && <div className="mt-2 h-1.5 w-1.5 rounded-full bg-primary shrink-0"></div>}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-8 text-center text-muted-foreground text-sm">
                                            Nenhuma notificação.
                                        </div>
                                    )}
                                </div>
                                <div className="p-2 border-t border-border bg-muted/30">
                                    <Button variant="ghost" size="sm" className="w-full text-xs h-8">Ver todas</Button>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* 2. Saldo de Pimentas */}
                <div className="flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-full border border-gray-700">
                  <span className="text-lg" role="img" aria-label="pimenta">🌶️</span>
                  <span className="text-sm font-bold text-white">{user?.pimentaBalance ?? 0}</span>
                </div>
                
                {/* 3. Botão Comprar */}
                <Button 
                  onClick={() => setShopOpen(true)} 
                  variant="destructive" 
                  size="sm"
                  className="bg-pink-600 hover:bg-pink-700 text-white font-bold hidden sm:inline-flex items-center"
                >
                  <span className="hidden lg:inline">Comprar</span>
                  <span className="lg:hidden">+</span>
                </Button>

                {/* 4. BOTÃO SAIR */}
                <Button 
                    onClick={logout} 
                    variant="ghost" 
                    size="icon" 
                    className="text-gray-400 hover:text-white hover:bg-white/10 hidden md:inline-flex ml-1"
                    title="Sair"
                >
                    <LogOut className="h-5 w-5" />
                </Button>
                
                {/* 5. Menu Hamburguer Mobile */}
                <div className="md:hidden">
                  <Button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} variant="ghost" size="icon">
                    {isMobileMenuOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
                   </Button>
                </div>
              </>
            ) : (
              // Visitante (Não logado)
              <div className="flex items-center space-x-2">
                <NavLink to="/entrar"><Button variant="ghost" className="text-white">Entrar</Button></NavLink>
                <NavLink to="/cadastrar"><Button>Cadastrar</Button></NavLink>
              </div>
            )}
          </div>
        </div>

        {/* MENU MOBILE EXPANDIDO */}
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
              <NavLink to="/mensagens" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => `block text-center py-2 text-base flex items-center justify-center gap-2 ${isActive ? 'text-primary' : 'text-white'}`}><MessageCircle size={18} /> Mensagens</NavLink>
              <NavLink to="/meu-perfil" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => `block text-center py-2 text-base ${isActive ? 'text-primary' : 'text-white'}`}>Meu Perfil</NavLink>
              <NavLink to="/explorar" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => `block text-center py-2 text-base ${isActive ? 'text-primary' : 'text-white'}`}>Explorar</NavLink>
              <NavLink to="/lives" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => `block text-center py-2 text-base ${isActive ? 'text-primary' : 'text-white'}`}>Lives</NavLink>
              <NavLink to="/planos" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => `block text-center py-2 text-base ${isActive ? 'text-primary' : 'text-white'}`}>Planos</NavLink>
              <NavLink to="/sugestoes" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => `block text-center py-2 text-base ${isActive ? 'text-primary' : 'text-white'}`}>Sugestoes</NavLink>
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