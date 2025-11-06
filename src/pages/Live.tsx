// src/pages/Live.tsx
// --- CORREÇÃO FINAL (Layout h-screen + Socket Auth + Scroll do Chat) ---

import React, { useState, useEffect, FormEvent, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '@/services/api';
import { useAuth } from '@/contexts/AuthProvider';
import { Flame, ArrowLeft, SendHorizontal, Loader2, Gift } from 'lucide-react';
import { io } from "socket.io-client";
import type { Socket } from "socket.io-client";
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
import type { Message as ChatMessage } from '@/types/types';
import { useToast } from "@/components/ui/use-toast";
import { Button } from '@/components/ui/button';
import LiveTipModal from '@/components/LiveTipModal';

// ======================================================================
// COMPONENTE 'LiveLayout' (Player)
// (Não precisa de alteração)
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


// ======================================================================
// COMPONENTE 'LiveContent' (Vídeo + Chat)
// (Este código está 100% correto para o layout e o chat)
// ======================================================================
const LiveContent: React.FC = () => {
    const { roomName } = useParams<{ roomName: string }>();
    const { user } = useAuth(); 
    const [socket, setSocket] = useState<Socket | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]); 
    const [inputValue, setInputValue] = useState('');
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const [isSocketConnected, setIsSocketConnected] = useState(false);
    const [isTipModalOpen, setIsTipModalOpen] = useState(false);
    
    const isGratuito = !user?.tipo_plano || user.tipo_plano === 'gratuito';

    useEffect(() => { /* Socket connection */
        if (user && roomName) {
            const socketUrl = import.meta.env.VITE_API_URL || 'http://localhost:3333';
            const token = localStorage.getItem('authToken'); 
            console.log("!!!! [DEBUG DO SOCKET] TENTANDO CONECTAR COM ESTE TOKEN:", token ? token.slice(0, 10) + '...' : 'TOKEN ESTÁ NULO');

            const newSocket = io(socketUrl, { 
              transports: ['websocket', 'polling'],
              auth: { token: token }
            });

            setSocket(newSocket);
            newSocket.on('connect', () => { setIsSocketConnected(true); newSocket.emit('join_room', roomName); });
            newSocket.on('disconnect', () => setIsSocketConnected(false));
            
            newSocket.on('connect_error', (err: Error) => { 
                console.error('[LiveChat] Socket connection error:', err.message); 
                setIsSocketConnected(false); 
            });
            
            return () => { newSocket.disconnect(); };
        }
    }, [user, roomName]);

    useEffect(() => { /* Socket listener */
        if (socket) {
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
        if (inputValue.trim() && user && socket && roomName && isSocketConnected && !isGratuito) {
            const messageData: ChatMessage = { 
                id: `${socket.id}-${Date.now()}`, 
                content: inputValue,
                author: { id: user.id, name: user.name || 'Usuário', profilePictureUrl: user.profilePictureUrl },
                authorId: user.id,
                receiverId: 0, 
                createdAt: new Date().toISOString(),
                read: false,
                isTip: false
            };
            socket.emit('chat message', messageData, roomName);
            setMessages(prev => [...prev, messageData]); setInputValue('');
        }
    };

    return (
    <> 
        {/* Este é o layout que funciona no PC (md:flex-row) e Mobile (flex-col) */}
        <div className="flex flex-col md:flex-row h-full bg-black text-white overflow-hidden">

            {/* Área do Player de Vídeo */}
            <div className="w-full aspect-video flex-shrink-0 md:flex-1 md:h-full md:aspect-auto bg-black relative min-w-0">
                <LiveLayout />
            </div>

            {/* Área do Chat (A Estrutura Correta) */}
            <div className="w-full flex-1 min-h-0 md:h-full md:flex-none md:w-80 lg:w-96 bg-card flex flex-col md:flex-shrink-0 border-l border-border">
                {/* Cabeçalho (Não cresce) */}
                <div className="p-4 border-b border-border flex-shrink-0">
                  <h2 className="text-xl font-semibold text-white">Chat ao Vivo</h2>
                </div>
                
                {/* Lista de Mensagens (Cresce e Rola) */}
                <div ref={chatContainerRef} className="flex-grow p-4 space-y-3 overflow-y-auto min-h-0">
                    {!isSocketConnected && <p className="text-sm text-yellow-400 text-center">Conectando...</p>}
                    {isSocketConnected && messages.length === 0 && <p className="text-sm text-gray-500 text-center">Nenhuma mensagem.</p>}
                    {messages.map((msg) => ( 
                        <div key={msg.id.toString()} className={`flex items-start gap-2.5 text-sm ${msg.isTip ? 'justify-center' : ''}`}>
                            {msg.isTip ? (
                                <p className="text-center font-bold text-yellow-400 bg-yellow-900/50 rounded-full px-3 py-1 text-xs">
                                    <Gift className="w-4 h-4 inline-block mr-1.5" />
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
                
                {/* Input (Não cresce) */}
            	 <div className="p-4 border-t border-border flex-shrink-0 bg-card">
                    <div className="flex items-center justify-end text-xs text-yellow-500 mb-2"> <Flame className="w-3 h-3 mr-1" /> <span className="text-gray-400">Saldo:</span> <span className="font-bold ml-1">{user?.pimentaBalance ?? 0}</span> </div>
                    
      	           <form onSubmit={handleSendMessage} className="flex gap-2">
    	                 
        	               {/* Botão de Presente (Permitido para gratuitos) */}
    	                   <Button 
          	                 type="button" 
        	                 size="icon" 
          	                 variant="outline"
      	                     onClick={() => setIsTipModalOpen(true)}
      	                     disabled={!user || !socket || !isSocketConnected} 
      	                     className="p-2 bg-card border-border text-yellow-400 hover:bg-background hover:text-yellow-300 disabled:opacity-50 flex-shrink-0"
  	                     >
    	                       <Gift className="w-5 h-5" />
  	                   </Button>
      	               
        	               {/* Input de Chat (Bloqueado para gratuitos) */}
          	             <input 
  	                         type="text" 
    	                       placeholder={isGratuito ? "Faça upgrade para conversar!" : !isSocketConnected ? "Conectando..." : "Sua mensagem..."}
        	                   value={inputValue} 
  	                         onChange={(e) => setInputValue(e.target.value)} 
    	                       disabled={!user || !socket || !isSocketConnected || isGratuito}
    	                       className="flex-grow p-2 rounded-md bg-transparent border-b border-border text-white text-sm focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
           	         />
     	               
      	                 {/* Botão de Enviar (Bloqueado para gratuitos) */}
        	               <Button 
  	             	         type="submit" 
  	             	         size="icon" 
      	         	         disabled={!user || !socket || !isSocketConnected || inputValue.trim() === '' || isGratuito} 
     	         	 	       className="p-2 bg-primary rounded-md font-semibold text-sm hover:bg-primary/90 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed flex-shrink-0"
    	           	       > 
        	     	           <SendHorizontal className="w-5 h-5" />
  	         	         </Button>
  	       	       </form>
      	   	     </div>
    	     	 </div>
  	     </div>

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
// COMPONENTE 'LivePage' (Página Principal)
// (Este é o componente que o App.tsx renderiza)
// ======================================================================
const LivePage: React.FC = () => {
    const { roomName } = useParams<{ roomName: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [token, setToken] = useState<string | null>(null);
    const [wsUrl, setWsUrl] = useState<string | null>(null);
    const [isLoadingToken, setIsLoadingToken] = useState(true);
    const { toast } = useToast();

    useEffect(() => { /* Fetch Token */
        const fetchToken = async () => {
            setIsLoadingToken(true);
            if (user && roomName) {
                try {
                    const response = await api.get(`/lives/token/${roomName}`);
                    setToken(response.data.token); setWsUrl(response.data.wsUrl);
                } catch (error: any) {
                    console.error('Erro ao buscar token:', error);
                    toast({
                        title: "Erro ao conectar",
                    description: `Não foi possível conectar (${error?.response?.data?.message || error.message}).`,
                        variant: "destructive",
                    });
                    navigate('/lives');
                } finally { setIsLoadingToken(false); }
            } else { setIsLoadingToken(false); }
        };
        fetchToken();
    }, [user, navigate, roomName, toast]); 

    const handleDisconnected = async () => { /* Handle Disconnect */
        console.log("LiveKit desconectado...");
        try { await api.post('/lives/stop'); }
        catch(error: any) { if (error?.response?.status !== 404) console.warn("Stop falhou:", error); }
        finally { navigate('/lives'); }
    };

    const handleLiveKitError = (error: Error) => { /* Handle Error */
        console.error("[LiveKit ERROR]:", error);
        toast({
            title: "Erro na Live",
            description: `Erro LiveKit: ${error.message}.`,
            variant: "destructive",
        });
    };

    if (isLoadingToken) { /* Loading */
        // O 'pt-16' aqui é para centralizar o "Conectando..."
        // já que o Header está escondido (pelo App.tsx)
        return <div className="flex justify-center items-center h-screen bg-background text-white"> Conectando... </div>;
   }
    if (!token || !wsUrl) { /* Error */
         return <div className="flex flex-col justify-center items-center h-screen bg-background text-white"> <p className="mb-4">Erro ao obter dados.</p> <button onClick={() => navigate('/lives')} className="text-primary hover:underline flex items-center"> <ArrowLeft size={16} className="mr-1" /> Voltar </button> </div>;
    }

    // --- ★★★ CORREÇÃO DO LAYOUT PC/MOBILE (Principal) ★★★ ---
    // 'h-screen' -> Ocupa 100% da tela (viewport)
    // 'flex flex-col' -> Permite que o chat cresça
    return (
        <div className="h-screen flex flex-col bg-background overflow-hidden">
            <LiveKitRoom
                video={true} audio={true} token={token} serverUrl={wsUrl} data-lk-theme="default"
                style={{ height: 'auto' }} // Deixa o Tailwind (className) controlar
            	   // 'flex-grow' -> Ocupa o espaço que sobrou do 'flex-col'
          	 	 // 'min-h-0' -> Permite o 'flex-grow' funcionar com 'overflow'
                className="w-full flex-grow min-h-0" 
               onDisconnected={handleDisconnected} onError={handleLiveKitError}
          	>
          	     <LiveContent />
            </LiveKitRoom>
        </div>
    );
};

export default LivePage;