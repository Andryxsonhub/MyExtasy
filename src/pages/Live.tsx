// src/pages/Live.tsx (VERSÃO FINAL COM TEXTO DO PLAYER RESTAURADO)

import React, { useState, useEffect, FormEvent } from 'react';
import Layout from '@/components/Layout';
import { useParams } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '@/contexts/AuthProvider';

// Tipos (sem alterações)
interface UserData {
  id: string;
  username: string; 
}
interface ChatMessage {
  id: string;
  text: string;
  user: UserData;
}

// Mock data (sem alterações)
const mockLives = [
  { id: '1', title: 'Desenvolvendo a feature de chat ao vivo', streamerName: 'Dev_Master' },
  { id: '2', title: 'Analisando o design do novo perfil', streamerName: 'UX_Guru' },
  { id: '3', title: 'Sessão de Perguntas e Respostas', streamerName: 'Comunidade' },
];

const LivePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const selectedLive = mockLives.find(live => live.id === id);
  const { user } = useAuth();
  
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');

  // Hooks (todos sem alterações)
  useEffect(() => {
    if (user) {
      const newSocket = io('http://localhost:3333');
      setSocket(newSocket);
      return () => { newSocket.disconnect(); };
    }
  }, [user]);

  useEffect(() => {
    if (socket) {
      const handleNewMessage = (msg: ChatMessage) => {
        setMessages(prevMessages => [...prevMessages, msg]);
      };
      socket.on('chat message', handleNewMessage);
      return () => { socket.off('chat message', handleNewMessage); };
    }
  }, [socket]);

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && user && socket) {
      const messageData: ChatMessage = {
        id: new Date().getTime().toString(),
        text: inputValue,
        user: { id: user.id, username: user.username },
      };
      socket.emit('chat message', messageData);
      setMessages(prevMessages => [...prevMessages, messageData]);
      setInputValue('');
    }
  };

  if (!selectedLive) {
    return (
      <Layout>
        <div className="pt-20 text-center text-white">Live não encontrada.</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col md:flex-row h-screen bg-gray-900 text-white pt-16 md:pt-20">
        
        <div className="flex-grow flex flex-col p-4 overflow-y-auto">
          
          {/* A MUDANÇA ESTÁ AQUI DENTRO DESTA DIV */}
          <div className="w-full bg-black aspect-video flex-shrink-0 rounded-lg flex items-center justify-center">
            <span className="text-gray-500 text-lg">O player de vídeo aparecerá aqui</span>
          </div>

          <div className="mt-4">
            <h1 className="text-2xl font-bold">{selectedLive.title}</h1>
            <p className="text-gray-400">Streamer: {selectedLive.streamerName}</p>
          </div>
        </div>
        
        {/* Coluna Lateral: Chat ao Vivo (sem alterações) */}
        <div className="w-full md:w-80 lg:w-96 bg-gray-800 flex flex-col flex-shrink-0 border-l border-gray-700">
          <div className="p-4 border-b border-gray-700"><h2 className="text-xl font-semibold">Chat ao Vivo</h2></div>
          
          <div className="flex-grow p-4 space-y-4 overflow-y-auto">
            {messages.map((msg) => (
              <div key={msg.id} className="flex items-start gap-3">
                <span className={`font-bold ${user && msg.user.id === user.id ? 'text-green-400' : 'text-blue-400'}`}>
                  {user && msg.user.id === user.id ? 'Você' : msg.user.username}:
                </span> 
                <p className="break-words">{msg.text}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-700">
            <input 
              type="text" 
              placeholder={user ? "Digite sua mensagem..." : "Autenticando..."}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={!user || !socket}
              className="w-full p-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50" 
            />
            <button 
              type="submit" 
              disabled={!user || !socket || inputValue.trim() === ''}
              className="w-full mt-2 p-2 bg-purple-600 rounded-lg font-bold hover:bg-purple-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              Enviar
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default LivePage;