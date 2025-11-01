// src/pages/Live.tsx
// --- ATUALIZADO (Fase 5: Corrige os caminhos de importação para '../') ---

import React, { useState, useEffect, FormEvent, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
// --- ★★★ CORREÇÃO: Caminhos revertidos para '../' ★★★ ---
import api from '../services/api';
import { useAuth } from '../contexts/AuthProvider';
import { Flame, ArrowLeft, SendHorizonal, Loader2, Gift } from 'lucide-react'; 
import { io, Socket } from 'socket.io-client';
import {
    LiveKitRoom,
    VideoTrack,
    AudioTrack,
    useTracks,
    ControlBar,
    useLocalParticipant,
} from '@livekit/components-react';
import '@livekit/components-styles';
import { Track } from 'livekit-client';
// --- MODIFICADO (1/4): Importa 'Message' (do types.ts) e renomeia ---
import type { UserData, Message as ChatMessage } from '../types/types';
// --- ★★★ FIM DA CORREÇÃO ★★★ ---
import { useToast } from "@/components/ui/use-toast"; // Este usa @/
import { Button } from '@/components/ui/button'; // Este usa @/
// --- NOVO: Importa o nosso novo Modal de Gorjetas ---
import LiveTipModal from '../components/LiveTipModal'; // Caminho relativo

// ======================================================================
// COMPONENTE 'LiveLayout' (Player) - (Sem alteração)
// ======================================================================
const LiveLayout = () => {
    const tracks = useTracks([Track.Source.Camera, Track.Source.Microphone]);
    const { localParticipant } = useLocalParticipant();
    const hostVideoTrack = tracks.find(trackRef => trackRef.participant.permissions?.canPublish === true && trackRef.source === Track.Source.Camera && !trackRef.participant.isLocal) ||
                           tracks.find(trackRef => trackRef.participant.permissions?.canPublish === true && trackRef.source === Track.Source.Camera && trackRef.participant.isLocal);
    const audioTracks = tracks.filter(trackRef => trackRef.source === Track.Source.Microphone);
    const isHost = localParticipant?.permissions?.canPublish === true;

    return (
        <div className="flex-grow flex flex-col bg-black relative w-full h-full overflow-hidden items-center justify-center">
            {hostVideoTrack ? (
                <VideoTrack trackRef={hostVideoTrack} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
            ) : (
                <div className="flex justify-center items-center h-full text-white text-lg font-semibold">
                    Aguardando o início da transmissão...
                </div>
            )}
            {audioTracks.map(trackRef => (
                <AudioTrack key={trackRef.participant.sid} trackRef={trackRef} />
            ))}
            {isHost && (
                <div className="absolute bottom-0 left-0 right-0 z-10 p-2">
                     <ControlBar controls={{ microphone: true, camera: true, screenShare: false, chat: false, leave: true }} />
                 </div>
            )}
        </div>
    );
};

// ======================================================================
// COMPONENTE 'LiveContent' (Vídeo + Chat) - (ATUALIZADO)
// ======================================================================
// (Interface ChatMessage local removida, agora usamos a global importada)

const LiveContent: React.FC = () => {
    const { roomName } = useParams<{ roomName: string }>();
    const { user } = useAuth(); // (Não precisamos mais do setUser aqui)
    const { toast } = useToast();
    const [socket, setSocket] = useState<Socket | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]); // Usa o tipo global
    const [inputValue, setInputValue] = useState('');
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const [isSocketConnected, setIsSocketConnected] = useState(false);
    // --- MODIFICADO (2/4): Remove o 'isTipping' ---
    // --- NOVO (3/4): Adiciona estado para controlar o NOVO modal de gorjeta ---
    const [isTipModalOpen, setIsTipModalOpen] = useState(false);

    useEffect(() => { /* Socket connection */
        if (user && roomName) {
            const socketUrl = import.meta.env.VITE_API_URL || 'http://localhost:3333';
            const newSocket = io(socketUrl, { transports: ['websocket', 'polling'] });
            setSocket(newSocket);
            newSocket.on('connect', () => { setIsSocketConnected(true); newSocket.emit('join_room', roomName); });
            newSocket.on('disconnect', () => setIsSocketConnected(false));
            newSocket.on('connect_error', (err) => { console.error('[LiveChat] Socket connection error:', err.message); setIsSocketConnected(false); });
            return () => { newSocket.disconnect(); };
        }
    }, [user, roomName]);
    useEffect(() => { /* Socket listener */
        if (socket) {
            // Esta função agora lida com mensagens NORMAIS e mensagens de GORJETA
            const handleNewMessage = (msg: ChatMessage) => { setMessages(prev => [...prev, msg]); };
            socket.on('chat message', handleNewMessage);
            return () => { socket.off('chat message', handleNewMessage); };
        }
    }, [socket]);
    useEffect(() => { /* Auto-scroll */
        if (chatContainerRef.current) { chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight; }
    }, [messages]);

    const handleSendMessage = (e: FormEvent) => { /* Send message */
        e.preventDefault();
        if (inputValue.trim() && user && socket && roomName && isSocketConnected) {
            // Usa a estrutura do 'types.ts/Message'
            const messageData: ChatMessage = { 
              id: `${socket.id}-${Date.now()}`, 
              content: inputValue, // 'content'
              // (author, authorId, etc. são preenchidos pelo tipo 'Message' global)
              author: { id: user.id, name: user.name || 'Usuário', profilePictureUrl: user.profilePictureUrl },
              authorId: user.id,
              receiverId: 0, // (Não é relevante para chat de live, mas o tipo pede)
              createdAt: new Date().toISOString(),
              read: false,
              isTip: false 
            };
            socket.emit('chat message', messageData, roomName);
            setMessages(prev => [...prev, messageData]); setInputValue('');
        }
    };

    // --- MODIFICADO: A função 'handleSendTip' foi MOVIDA para o LiveTipModal ---

    // Layout para Conteúdo da Live (Vídeo + Chat)
    return (
      // Usamos um Fragmento React (<>) para permitir que o Modal seja "irmão" do layout
      <> 
        <div className="flex flex-col md:flex-row h-full bg-black text-white overflow-hidden">

            {/* Área do Player de Vídeo (Sem alteração) */}
            <div className="w-full aspect-video flex-shrink-0 md:flex-1 md:h-full md:aspect-auto bg-black relative">
                <LiveLayout />
            </div>

            {/* Área do Chat (Atualizada) */}
            <div className="w-full flex-1 min-h-0 md:h-full md:flex-none md:w-80 lg:w-96 bg-gray-900 flex flex-col md:flex-shrink-0 border-l border-gray-700">
                {/* Cabeçalho (sem alteração) */}
                <div className="p-4 border-b border-gray-700 flex-shrink-0"> <h2 className="text-xl font-semibold text-white">Chat ao Vivo</h2> </div>
                {/* Mensagens (área de scroll) (Atualizado para usar 'content') */}
                <div ref={chatContainerRef} className="flex-grow p-4 space-y-3 overflow-y-auto min-h-0">
                     {!isSocketConnected && <p className="text-sm text-yellow-400 text-center">Conectando...</p>}
                     {isSocketConnected && messages.length === 0 && <p className="text-sm text-gray-500 text-center">Nenhuma mensagem.</p>}
                     {messages.map((msg) => ( 
                          <div key={msg.id.toString()} className={`flex items-start gap-2.5 text-sm ${msg.isTip ? 'justify-center' : ''}`}> 
                            {msg.isTip ? (
                                <p className="text-center font-bold text-yellow-400 bg-yellow-900/50 rounded-full px-3 py-1 text-xs">
                                    <Gift className="w-4 h-4 inline-block mr-1.5" />
                                    {/* Usa msg.author.name (vem do objeto 'author' que definimos) */}
                                    {user && msg.author.id === user.id ? 'Você' : msg.author.name || 'Anônimo'} {msg.content}
                                </p>
                            ) : (
                                <>
                                    <span className={`font-semibold flex-shrink-0 ${user && msg.author.id === user.id ? 'text-green-400' : 'text-blue-400'}`}> 
                                        {user && msg.author.id === user.id ? 'Você' : msg.author.name || 'Anônimo'}: 
                                    </span> 
                                    <p className="break-words text-gray-200">{msg.content}</p> 
                                </>
                            )}
                          </div> 
                        ))}
                 </div>
                 {/* Input (fixo na base do chat) */}
                 <div className="p-4 border-t border-gray-700 flex-shrink-0 bg-gray-800">
                     <div className="flex items-center justify-end text-xs text-yellow-500 mb-2"> <Flame className="w-3 h-3 mr-1" /> <span className="text-gray-400">Saldo:</span> <span className="font-bold ml-1">{user?.pimentaBalance ?? 0}</span> </div>
                     
                        {/* --- MODIFICADO (4/4): Formulário de Envio de Mensagem e Gorjeta --- */}
                        <form onSubmit={handleSendMessage} className="flex gap-2">
                          
                          {/* Botão de Abrir o Modal de Gorjeta */}
                          <Button 
                            type="button" // Importante: 'type="button"' para não submeter o formulário
                            size="icon" 
                            variant="outline"
                            onClick={() => setIsTipModalOpen(true)}
                            disabled={!user || !socket || !isSocketConnected}
                            className="p-2 bg-gray-700 border-gray-600 text-yellow-400 hover:bg-gray-600 hover:text-yellow-300 disabled:opacity-50 flex-shrink-0"
                          >
                            <Gift className="w-5 h-5" />
                          </Button>
                          
                          {/* Input da Mensagem */}
                         <input type="text" placeholder={!isSocketConnected ? "Conectando..." : "Sua mensagem..."} value={inputValue} onChange={(e) => setInputValue(e.target.value)} disabled={!user || !socket || !isSocketConnected} className="flex-grow p-2 rounded-md bg-gray-700 border border-gray-600 text-white text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 disabled:opacity-50" />
                          
                          {/* Botão de Enviar Mensagem */}
                         <Button type="submit" size="icon" disabled={!user || !socket || !isSocketConnected || inputValue.trim() === ''} className="p-2 bg-primary rounded-md font-semibold text-sm hover:bg-primary/90 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed flex-shrink-0"> 
                            <SendHorizonal className="w-5 h-5" />
                          </Button>
                     </form>

                        {/* --- REMOVIDO: Os botões de gorjeta (10, 50, 100) foram removidos daqui --- */}

                 </div>
            </div>
        </div>

        {/* --- NOVO (4/4): Renderiza o Modal de Gorjeta --- */}
        {/* (Passamos o roomName e o socket para o modal lidar com a lógica) */}
        {roomName && (
            <LiveTipModal 
                isOpen={isTipModalOpen}
                onClose={() => setIsTipModalOpen(false)}
                roomName={roomName}
                socket={socket}
            />
        )}
      </>
    );
};


// ======================================================================
// COMPONENTE 'LivePage' (Página Principal) - (Limpo)
// ======================================================================
const LivePage: React.FC = () => {
    const { roomName } = useParams<{ roomName: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [token, setToken] = useState<string | null>(null);
    const [wsUrl, setWsUrl] = useState<string | null>(null);
    const [isLoadingToken, setIsLoadingToken] = useState(true);

    useEffect(() => { /* Fetch Token */
        const fetchToken = async () => {
            setIsLoadingToken(true);
            if (user && roomName) {
                try {
                    const response = await api.get(`/lives/token/${roomName}`);
                    setToken(response.data.token); setWsUrl(response.data.wsUrl);
                } catch (error: any) {
                    console.error('Erro ao buscar token:', error);
                    alert(`Não foi possível conectar (${error?.response?.data?.message || error.message}).`);
                    navigate('/lives');
                } finally { setIsLoadingToken(false); }
            } else { setIsLoadingToken(false); }
        };
        fetchToken();
    }, [user, navigate, roomName]);

    const handleDisconnected = async () => { /* Handle Disconnect */
        console.log("LiveKit desconectado...");
        try { await api.post('/lives/stop'); }
        catch(error: any) { if (error?.response?.status !== 404) console.warn("Stop falhou:", error); }
        finally { navigate('/lives'); }
    };

    const handleLiveKitError = (error: Error) => { /* Handle Error */
        console.error("[LiveKit ERROR]:", error);
        alert(`Erro LiveKit: ${error.message}.`);
    };

    if (isLoadingToken) { /* Loading */
        return <div className="flex justify-center items-center h-screen pt-16 bg-background text-white"> Conectando... </div>;
    }
    if (!token || !wsUrl) { /* Error */
         return <div className="flex flex-col justify-center items-center h-screen pt-16 bg-background text-white"> <p className="mb-4">Erro ao obter dados.</p> <button onClick={() => navigate('/lives')} className="text-primary hover:underline flex items-center"> <ArrowLeft size={16} className="mr-1" /> Voltar </button> </div>;
    }

    // Render LiveKitRoom
    return (
        <div className="h-[calc(100vh-theme(space.16))] pt-16 bg-background overflow-hidden">
            <LiveKitRoom
                video={true} audio={true} token={token} serverUrl={wsUrl} data-lk-theme="default"
                style={{ height: '100%' }} className="w-full"
                onDisconnected={handleDisconnected} onError={handleLiveKitError}
            >
                <LiveContent />
            </LiveKitRoom>
        </div>
    );
};

export default LivePage;
