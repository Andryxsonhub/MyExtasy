import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthProvider';
import { Send, ArrowLeft, MessageCircle } from 'lucide-react';

type UserData = {
  id: number;
  name: string;
  username: string;
  profile?: { avatarUrl: string | null };
};

type Conversation = {
  user: UserData;
  lastMessage: { content: string; createdAt: string; read: boolean };
  unreadCount: number;
};

type Message = {
  id: number;
  content: string;
  authorId: number;
  receiverId: number;
  createdAt: string;
};

export function Chat() {
  const { user } = useAuth(); 
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const targetUserId = searchParams.get('userId'); 

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const { data } = await api.get('/messages/conversations');
        setConversations(data);
      } catch (error) {
        console.error("Erro ao carregar lista de conversas:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, []);

  useEffect(() => {
    if (targetUserId) {
      const fetchTargetUser = async () => {
        try {
          const { data } = await api.get(`/users/profile/${targetUserId}`);
          setSelectedUser(data);
        } catch (error) {
          console.error("Erro ao buscar usuário do chat:", error);
        }
      };
      fetchTargetUser();
    }
  }, [targetUserId]);

  useEffect(() => {
    if (!selectedUser) return;
    
    const fetchHistory = async () => {
      try {
        const { data } = await api.get(`/messages/conversation/${selectedUser.id}`);
        setMessages(data);
      } catch (error) {
        console.error("Erro ao carregar mensagens:", error);
      }
    };
    fetchHistory();
  }, [selectedUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ★★★ FUNÇÃO ATUALIZADA COM O DETETIVE DE ERROS ★★★
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    try {
      const { data } = await api.post('/messages/send', { 
        receiverId: selectedUser.id,
        content: newMessage 
      });
      
      setMessages((prev) => [...prev, data.message]);
      setNewMessage('');
      
      const refreshConversations = await api.get('/messages/conversations');
      setConversations(refreshConversations.data);

    } catch (error: any) {
      console.error("Erro ao enviar mensagem:", error);
      
      // Captura a mensagem real de erro que o seu backend mandou
      const backendError = error.response?.data?.error || error.response?.data?.message || "Erro desconhecido no servidor.";
      
      // Mostra o erro real na tela
      alert(`Aviso do Sistema: ${backendError}`);
    }
  };

  const getAvatar = (userData: UserData) => {
    if (userData.profile?.avatarUrl) {
      return <img src={userData.profile.avatarUrl} alt={userData.name || 'User'} className="w-full h-full object-cover" />;
    }
    return <div className="w-full h-full flex items-center justify-center text-lg text-white font-bold">{userData.name?.charAt(0) || 'U'}</div>;
  };

  if (loading) return <div className="bg-[#121212] h-screen flex justify-center items-center text-[#e91e63]">Carregando conversas...</div>;

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#121212] text-white font-sans w-full overflow-hidden">
      
      <div className="hidden md:flex w-[300px] shrink-0 border-r border-[#333] bg-[#0a0a0a] flex-col">
        <div className="p-5 border-b border-[#333] flex items-center">
          <button onClick={() => navigate(-1)} className="mr-3 text-gray-400 hover:text-white transition-colors" title="Voltar">
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-2xl font-bold m-0 text-[#e91e63]">Mensagens</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3">
          {conversations.length === 0 ? (
            <p className="text-center text-gray-500 mt-5">Nenhuma conversa ainda.</p>
          ) : (
            conversations.map((conv) => (
              <div 
                key={conv.user.id}
                onClick={() => setSelectedUser(conv.user)}
                className={`p-3 rounded-lg cursor-pointer flex items-center mb-2 transition-colors ${selectedUser?.id === conv.user.id ? 'bg-[#2a2a2a]' : 'hover:bg-[#1a1a1a]'}`}
              >
                <div className="w-11 h-11 rounded-full bg-[#444] mr-3 shrink-0 overflow-hidden">
                  {getAvatar(conv.user)}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="m-0 font-bold truncate">{conv.user.name || conv.user.username}</p>
                  <p className="m-0 text-[13px] text-gray-400 truncate">{conv.lastMessage?.content || 'Nova conversa'}</p>
                </div>
                {conv.unreadCount > 0 && (
                  <div className="bg-[#e91e63] text-white text-[12px] px-2 py-0.5 rounded-full ml-2">
                    {conv.unreadCount}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col h-full w-full bg-[#121212] relative">
        
        <div className="p-4 border-b border-[#333] bg-[#1a1a1a] flex items-center shrink-0">
          <button onClick={() => navigate(-1)} className="mr-4 text-gray-400 md:hidden hover:text-white" title="Voltar">
             <ArrowLeft size={24} />
          </button>
          
          {selectedUser ? (
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-[#444] shrink-0 border border-[#333]">
                   {getAvatar(selectedUser)}
                </div>
                <h3 className="m-0 font-bold text-lg truncate">{selectedUser.name || selectedUser.username}</h3>
             </div>
          ) : (
             <h2 className="text-xl font-bold text-[#e91e63] md:hidden">Mensagens</h2>
          )}
        </div>

        <div className="flex md:hidden overflow-x-auto p-3 bg-[#0a0a0a] border-b border-[#333] gap-4 shrink-0 items-start scrollbar-hide">
            {conversations.length === 0 && !selectedUser && (
               <p className="text-sm text-gray-500 w-full text-center py-2">Nenhuma conversa ainda.</p>
            )}
            {conversations.map(conv => (
                <div 
                  key={conv.user.id} 
                  onClick={() => setSelectedUser(conv.user)}
                  className="relative flex flex-col items-center gap-1 cursor-pointer shrink-0 w-[60px]"
                >
                   <div className={`w-14 h-14 rounded-full p-0.5 border-2 ${selectedUser?.id === conv.user.id ? 'border-[#e91e63]' : 'border-transparent'}`}>
                      <div className="w-full h-full rounded-full overflow-hidden bg-[#444] flex items-center justify-center">
                          {getAvatar(conv.user)}
                      </div>
                   </div>
                   <span className="text-[11px] text-gray-400 w-full truncate text-center">
                      {conv.user.name?.split(' ')[0] || conv.user.username}
                   </span>
                   {conv.unreadCount > 0 && (
                      <span className="absolute top-0 right-1 bg-[#e91e63] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-[#0a0a0a]">
                         {conv.unreadCount}
                      </span>
                   )}
                </div>
            ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col bg-[#121212]">
          {!selectedUser ? (
             <div className="flex-1 flex justify-center items-center flex-col opacity-50">
                <MessageCircle size={60} className="mb-4" />
                <h2 className="text-lg text-center">Selecione uma conversa acima para começar</h2>
             </div>
          ) : messages.length === 0 ? (
             <p className="text-center text-gray-500 mt-10">Inicie a conversa! Envie a primeira mensagem. 🔥</p>
          ) : (
            messages.map((msg) => {
              const isMe = msg.authorId === user?.id;
              return (
                <div key={msg.id} className={`mb-4 flex flex-col max-w-[85%] sm:max-w-[75%] ${isMe ? 'self-end items-end' : 'self-start items-start'}`}>
                  <div className={`px-4 py-2.5 inline-block break-words text-[15px] ${isMe ? 'bg-[#e91e63] text-white rounded-[18px_4px_18px_18px]' : 'bg-[#2a2a2a] text-white rounded-[4px_18px_18px_18px]'}`}>
                    {msg.content}
                  </div>
                  <div className={`text-[11px] text-gray-500 mt-1 ${isMe ? 'text-right' : 'text-left'}`}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {selectedUser && (
          <div className="p-3 sm:p-4 border-t border-[#333] bg-[#1a1a1a] shrink-0">
            <form onSubmit={handleSendMessage} className="flex items-center gap-2 w-full max-w-4xl mx-auto">
              <input 
                type="text" 
                placeholder="Digite a mensagem..." 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 bg-[#2a2a2a] text-white rounded-full px-5 py-3.5 outline-none border border-transparent focus:border-[#e91e63] transition-colors text-[15px]"
              />
              <button 
                type="submit"
                disabled={!newMessage.trim()}
                className="bg-[#e91e63] hover:bg-pink-600 disabled:bg-[#444] disabled:cursor-not-allowed text-white rounded-full w-12 h-12 flex items-center justify-center shrink-0 transition-colors"
                title="Enviar"
              >
                <Send size={20} className={newMessage.trim() ? "translate-x-[-1px] translate-y-[1px]" : ""} />
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}