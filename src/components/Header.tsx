// src/components/Header.tsx
// --- ★★★ ATUALIZADO: Clique nas notificações do sininho abre o modal de detalhes ★★★ ---

import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthProvider'; 
import newLogo from '@/assets/logo_sem_fundo_limpo.png'; 
import PimentaShopModal from '@/components/PimentaShopModal';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, X, Bell, Heart, MessageCircle, LogOut, UserPlus } from 'lucide-react'; // <-- Adicionado UserPlus

// Tipagem das notificações
type Notification = {
  id: number;
  type: string;
  text: string;
  time: string;
  read: boolean;
};

// Dados simulados
const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: 1, type: 'like', text: 'Loirinhabdsm curtiu sua foto.', time: '2 min', read: false },
  { id: 2, type: 'comment', text: 'Casal_hot comentou no seu vídeo.', time: '1h', read: false },
  { id: 3, type: 'like', text: 'Pedro_22 curtiu seu perfil.', time: '3h', read: true },
];

const Header: React.FC = () => {
  const { isLoggedIn, user, logout } = useAuth(); 
  const navigate = useNavigate();
  const [isShopOpen, setShopOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Controle do menu de notificações e estado das notificações
  const [isNotificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  
  // Estado para controlar qual notificação está aberta na janela modal
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  const homeLink = isLoggedIn ? '/home' : '/';
  const finalAvatarUrl = user?.profilePictureUrl || undefined;

  // --- Funções de Estilo dos Ícones ---
  const getIcon = (type: string) => {
    switch (type) {
      case 'like': return <Heart size={18} fill="currentColor" />;
      case 'comment': return <MessageCircle size={18} />;
      case 'follow': return <UserPlus size={18} />;
      default: return <Bell size={18} />;
    }
  };

  const getColorClass = (type: string) => {
    switch (type) {
      case 'like': return 'bg-pink-500/10 text-pink-500';
      case 'comment': return 'bg-blue-500/10 text-blue-500';
      case 'follow': return 'bg-purple-500/10 text-purple-500';
      default: return 'bg-gray-500/10 text-gray-400';
    }
  };

  // --- Função do Clique na Notificação ---
  const handleNotificationClick = (notif: Notification) => {
    // 1. Marca como lida
    if (!notif.read) {
      setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
    }
    // 2. Fecha o menu flutuante do sininho
    setNotificationsOpen(false);
    // 3. Abre a janela grande com os detalhes
    setSelectedNotification(notif);
  };

  const closeNotification = () => {
    setSelectedNotification(null);
  };

  return (
    <> 
      <header className="bg-background/95 fixed top-0 w-full z-50 border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          
          <div className="flex items-center space-x-3">
            {isLoggedIn ? (
               <NavLink to="/meu-perfil" className="flex items-center gap-2 group">
                 <Avatar className="h-10 w-10 border-2 border-transparent group-hover:border-primary transition-all">
                   <AvatarImage src={finalAvatarUrl} alt={user?.name} />
                   <AvatarFallback>{user?.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                 </Avatar>
                 <span className="text-sm font-bold text-white hidden sm:block group-hover:text-primary transition-colors">
                    {user?.name?.split(' ')[0]}
                 </span>
               </NavLink>
            ) : (
              <NavLink to={homeLink} className="flex items-center space-x-3">
                <img src={newLogo} alt="MyExtasyClub Logo" className="h-8 flex-shrink-0" />
                <span className="text-xl font-bold text-white mt-0.5 hidden sm:inline">MyExtasyClub</span>
              </NavLink>
            )}
          </div>

          {isLoggedIn && (
            <nav className="hidden md:flex items-center space-x-6 absolute left-1/2 transform -translate-x-1/2">
                <NavLink to="/home" className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'text-white hover:text-gray-300'}`}>Home</NavLink>
                <NavLink to="/explorar" className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'text-white hover:text-gray-300'}`}>Explorar</NavLink>
                <NavLink to="/lives" className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'text-white hover:text-gray-300'}`}>Lives</NavLink>
                <NavLink to="/planos" className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'text-white hover:text-gray-300'}`}>Planos</NavLink>
            </nav>
          )}
          
          <div className="flex items-center space-x-3 sm:space-x-4">
            {isLoggedIn ? (
              <>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-white hover:bg-white/10"
                    onClick={() => navigate('/mensagens')}
                    title="Mensagens"
                >
                    <MessageCircle className="h-6 w-6" />
                </Button>

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

                    {isNotificationsOpen && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setNotificationsOpen(false)}></div>
                            <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-lg shadow-xl z-50 overflow-hidden" style={{ marginRight: '-50px' }}>
                                <div className="p-3 border-b border-border flex justify-between items-center bg-muted/50">
                                    <h3 className="font-semibold text-sm">Notificações</h3>
                                    {unreadCount > 0 && <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">{unreadCount} novas</span>}
                                </div>
                                <div className="max-h-[300px] overflow-y-auto">
                                    {notifications.length > 0 ? (
                                        notifications.map((notif) => (
                                            <div 
                                              key={notif.id} 
                                              onClick={() => handleNotificationClick(notif)} // <-- A MÁGICA DO CLIQUE AQUI
                                              className={`p-3 border-b border-border/50 hover:bg-muted/50 transition-colors cursor-pointer flex gap-3 ${!notif.read ? 'bg-primary/5' : ''}`}
                                            >
                                                <div className={`mt-1 h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${getColorClass(notif.type)}`}>
                                                    {getIcon(notif.type)}
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
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="w-full text-xs h-8"
                                      onClick={() => {
                                        setNotificationsOpen(false);
                                        navigate('/notificacoes');
                                      }}
                                    >
                                      Ver todas
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <div className="flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-full border border-gray-700">
                  <span className="text-lg" role="img" aria-label="pimenta">🌶️</span>
                  <span className="text-sm font-bold text-white">{user?.pimentaBalance ?? 0}</span>
                </div>
                
                <Button 
                  onClick={() => setShopOpen(true)} 
                  variant="destructive" 
                  size="sm"
                  className="bg-pink-600 hover:bg-pink-700 text-white font-bold hidden sm:inline-flex items-center"
                >
                  <span className="hidden lg:inline">Comprar</span>
                  <span className="lg:hidden">+</span>
                </Button>

                <Button 
                    onClick={logout} 
                    variant="ghost" 
                    size="icon" 
                    className="text-gray-400 hover:text-white hover:bg-white/10 hidden md:inline-flex ml-1"
                    title="Sair"
                >
                    <LogOut className="h-5 w-5" />
                </Button>
                
                <div className="md:hidden">
                  <Button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} variant="ghost" size="icon">
                    {isMobileMenuOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
                   </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <NavLink to="/entrar"><Button variant="ghost" className="text-white">Entrar</Button></NavLink>
                <NavLink to="/cadastrar"><Button>Cadastrar</Button></NavLink>
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

      {/* --- ★★★ JANELA MODAL DE DETALHES NO HEADER ★★★ --- */}
      {selectedNotification && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4 animate-in fade-in duration-200"
          onClick={closeNotification} 
        >
          <div 
            className="bg-[#121212] border border-[#333] rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()} 
          >
            <div className="p-4 border-b border-[#333] flex justify-between items-center bg-[#1a1a1a]">
              <h2 className="text-lg font-bold text-white flex items-center gap-3">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${getColorClass(selectedNotification.type)}`}>
                  {getIcon(selectedNotification.type)}
                </div>
                Detalhes
              </h2>
              <button onClick={closeNotification} className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 flex flex-col items-center text-center">
              <div className={`h-16 w-16 rounded-full flex items-center justify-center mb-4 ${getColorClass(selectedNotification.type)}`}>
                  {getIcon(selectedNotification.type)}
              </div>
              <p className="text-white text-lg leading-relaxed mb-4">
                {selectedNotification.text}
              </p>
              <span className="text-sm text-gray-500 bg-[#222] px-3 py-1 rounded-full">
                Recebida há {selectedNotification.time}
              </span>
            </div>

            <div className="p-4 border-t border-[#333] bg-[#1a1a1a] flex justify-center">
              <Button onClick={closeNotification} className="w-full bg-[#333] hover:bg-[#444] text-white">
                Fechar
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;