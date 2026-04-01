import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom'; // <-- useNavigate adicionado!
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthProvider';

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
  const navigate = useNavigate(); // <-- Hook para fazer o botão voltar funcionar
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
        const { data } = await api.get(`/messages/${selectedUser.id}`);
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

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    try {
      const { data } = await api.post(`/messages/${selectedUser.id}`, { content: newMessage });
      
      setMessages((prev) => [...prev, data]);
      setNewMessage('');
      
      const refreshConversations = await api.get('/messages/conversations');
      setConversations(refreshConversations.data);

    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      alert("Erro ao enviar. Tente novamente.");
    }
  };

  const getAvatar = (userData: UserData) => {
    if (userData.profile?.avatarUrl) {
      return <img src={userData.profile.avatarUrl} alt={userData.name || 'User'} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />;
    }
    return <div style={{ fontSize: '18px', color: '#fff' }}>{userData.name?.charAt(0) || 'U'}</div>;
  };

  if (loading) return <div style={{ backgroundColor: '#121212', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#e91e63' }}>Carregando conversas...</div>;

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#121212', color: '#fff', fontFamily: 'sans-serif' }}>
      
      {/* LADO ESQUERDO: Lista de Conversas */}
      <div style={{ width: '300px', borderRight: '1px solid #333', backgroundColor: '#0a0a0a', display: 'flex', flexDirection: 'column' }}>
        
        {/* ★★★ TOPO COM BOTÃO DE VOLTAR ★★★ */}
        <div style={{ padding: '20px', borderBottom: '1px solid #333', display: 'flex', alignItems: 'center' }}>
          <button 
            onClick={() => navigate(-1)} // Volta para a página anterior
            style={{ 
              background: 'none', 
              border: 'none', 
              color: '#aaa', 
              cursor: 'pointer', 
              marginRight: '15px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              padding: '5px'
            }}
            title="Voltar"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: '#e91e63' }}>Mensagens</h2>
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
          {conversations.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#666', marginTop: '20px' }}>Nenhuma conversa ainda.</p>
          ) : (
            conversations.map((conv) => (
              <div 
                key={conv.user.id}
                onClick={() => setSelectedUser(conv.user)}
                style={{ 
                  padding: '15px', 
                  backgroundColor: selectedUser?.id === conv.user.id ? '#2a2a2a' : 'transparent', 
                  borderRadius: '8px', 
                  cursor: 'pointer', 
                  display: 'flex', 
                  alignItems: 'center', 
                  marginBottom: '5px',
                  transition: 'background-color 0.2s'
                }}
              >
                <div style={{ width: '45px', height: '45px', borderRadius: '50%', backgroundColor: '#444', marginRight: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {getAvatar(conv.user)}
                </div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <p style={{ margin: 0, fontWeight: 'bold', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    {conv.user.name || conv.user.username}
                  </p>
                  <p style={{ margin: 0, fontSize: '13px', color: '#aaa', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    {conv.lastMessage?.content || 'Nova conversa'}
                  </p>
                </div>
                {conv.unreadCount > 0 && (
                  <div style={{ backgroundColor: '#e91e63', color: '#fff', fontSize: '12px', padding: '2px 8px', borderRadius: '12px', marginLeft: '10px' }}>
                    {conv.unreadCount}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* LADO DIREITO: Área do Bate-Papo */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#121212' }}>
        
        {!selectedUser ? (
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
             <div style={{ fontSize: '60px', marginBottom: '20px' }}>💬</div>
             <h2 style={{ color: '#aaa' }}>Selecione uma conversa para começar</h2>
          </div>
        ) : (
          <>
            <div style={{ padding: '20px', borderBottom: '1px solid #333', backgroundColor: '#1a1a1a', display: 'flex', alignItems: 'center' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#444', marginRight: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                 {getAvatar(selectedUser)}
              </div>
              <h3 style={{ margin: 0, fontSize: '18px' }}>{selectedUser.name || selectedUser.username}</h3>
            </div>

            <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
              {messages.length === 0 ? (
                 <p style={{ textAlign: 'center', color: '#666', marginTop: '40px' }}>Inicie a conversa! Envie a primeira mensagem. 🔥</p>
              ) : (
                messages.map((msg) => {
                  const isMe = msg.authorId === user?.id;

                  return (
                    <div key={msg.id} style={{ textAlign: isMe ? 'right' : 'left', marginBottom: '15px', alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '75%' }}>
                      <div style={{ 
                        backgroundColor: isMe ? '#e91e63' : '#2a2a2a', 
                        color: '#fff', 
                        padding: '12px 18px', 
                        borderRadius: isMe ? '15px 0px 15px 15px' : '0px 15px 15px 15px', 
                        display: 'inline-block', 
                        lineHeight: '1.4', 
                        textAlign: 'left',
                        wordBreak: 'break-word'
                      }}>
                        {msg.content}
                      </div>
                      <div style={{ fontSize: '11px', color: '#666', marginTop: '5px', textAlign: isMe ? 'right' : 'left' }}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            <div style={{ padding: '20px', borderTop: '1px solid #333', backgroundColor: '#1a1a1a' }}>
              <form onSubmit={handleSendMessage} style={{ display: 'flex' }}>
                <input 
                  type="text" 
                  placeholder="Digite sua mensagem..." 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  style={{ flex: 1, padding: '15px 20px', borderRadius: '25px', border: 'none', backgroundColor: '#2a2a2a', color: '#fff', outline: 'none', fontSize: '16px' }}
                />
                <button 
                  type="submit"
                  disabled={!newMessage.trim()}
                  style={{ marginLeft: '15px', padding: '0 30px', borderRadius: '25px', border: 'none', backgroundColor: newMessage.trim() ? '#e91e63' : '#555', color: '#fff', cursor: newMessage.trim() ? 'pointer' : 'not-allowed', fontWeight: 'bold', fontSize: '16px', transition: '0.2s' }}
                >
                  Enviar
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}