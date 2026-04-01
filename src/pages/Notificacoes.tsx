// src/pages/Notificacoes.tsx
// --- ★★★ ATUALIZADO: Clique para abrir os detalhes da notificação em uma janela ★★★ ---

import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Heart, MessageCircle, UserPlus, Bell, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Tipagem para o TypeScript não reclamar
type Notification = {
  id: number;
  type: string;
  text: string;
  time: string;
  read: boolean;
};

// Usando dados falsos (Mock) temporariamente
const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: 1, type: 'like', text: 'Loirinhabdsm curtiu sua foto.', time: '2 min', read: false },
  { id: 2, type: 'comment', text: 'Casal_hot comentou no seu vídeo.', time: '1h', read: false },
  { id: 3, type: 'follow', text: 'Marcela_99 começou a seguir você.', time: '2h', read: false },
  { id: 4, type: 'like', text: 'Pedro_22 curtiu seu perfil.', time: '3h', read: true },
  { id: 5, type: 'system', text: 'Bem-vindo ao MyExtasyClub! Complete seu perfil.', time: '1 dia', read: true },
];

const Notificacoes: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  
  // Estado para controlar qual notificação está aberta na janela (Modal)
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  // Função disparada ao clicar em uma notificação específica
  const handleNotificationClick = (notif: Notification) => {
    // 1. Marca essa notificação específica como lida
    if (!notif.read) {
      setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
    }
    // 2. Abre a janela com os detalhes dela
    setSelectedNotification(notif);
  };

  // Função para fechar a janela
  const closeNotification = () => {
    setSelectedNotification(null);
  };

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

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Layout>
      <div className="container mx-auto px-4 pt-24 pb-12 max-w-3xl min-h-screen">
        
        {/* Cabeçalho da Página */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white">Notificações</h1>
            <p className="text-gray-400 mt-1">Fique por dentro do que acontece no seu perfil.</p>
          </div>
          {unreadCount > 0 && (
            <Button onClick={markAllAsRead} variant="outline" className="border-border text-gray-300 hover:text-white">
              Marcar todas como lidas
            </Button>
          )}
        </div>

        {/* Lista de Notificações */}
        <div className="bg-card border border-border rounded-lg overflow-hidden shadow-lg">
          {notifications.length > 0 ? (
            notifications.map((notif) => (
              <div 
                key={notif.id} 
                onClick={() => handleNotificationClick(notif)}
                className={`p-4 border-b border-border/50 hover:bg-muted/50 transition-colors cursor-pointer flex gap-4 items-start ${!notif.read ? 'bg-primary/5' : ''}`}
              >
                {/* Ícone Redondo */}
                <div className={`mt-1 h-12 w-12 rounded-full flex items-center justify-center shrink-0 ${getColorClass(notif.type)}`}>
                  {getIcon(notif.type)}
                </div>
                
                {/* Texto da Notificação */}
                <div className="flex-1">
                  <p className={`text-base leading-snug ${!notif.read ? 'text-white font-semibold' : 'text-gray-300'}`}>
                    {notif.text}
                  </p>
                  <span className="text-sm text-muted-foreground mt-1 block">{notif.time}</span>
                </div>

                {/* Bolinha de "Não lida" */}
                {!notif.read && (
                  <div className="mt-2 h-2.5 w-2.5 rounded-full bg-primary shrink-0 shadow-[0_0_8px_rgba(233,30,99,0.5)]"></div>
                )}
              </div>
            ))
          ) : (
            <div className="p-12 text-center flex flex-col items-center">
              <Bell className="h-16 w-16 text-muted-foreground mb-4 opacity-20" />
              <h3 className="text-xl font-semibold text-white mb-2">Tudo tranquilo por aqui</h3>
              <p className="text-gray-400">Você não tem novas notificações no momento.</p>
            </div>
          )}
        </div>

      </div>

      {/* ★★★ JANELA MODAL DE DETALHES ★★★ */}
      {selectedNotification && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4 animate-in fade-in duration-200"
          onClick={closeNotification} // Fecha ao clicar fora da caixa
        >
          <div 
            className="bg-[#121212] border border-[#333] rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()} // Impede que o clique dentro da caixa feche o modal
          >
            {/* Topo do Modal */}
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

            {/* Corpo do Modal */}
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

            {/* Rodapé do Modal */}
            <div className="p-4 border-t border-[#333] bg-[#1a1a1a] flex justify-center">
              <Button onClick={closeNotification} className="w-full bg-[#333] hover:bg-[#444] text-white">
                Fechar
              </Button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Notificacoes;