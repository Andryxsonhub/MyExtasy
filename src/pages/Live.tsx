// src/pages/Live.tsx
// --- ATUALIZAÇÃO (Fase 6): Corrige URL do Socket e Cores do Chat ---
// --- ATUALIZAÇÃO (Debug 7): Corrige imports para @/ ---
// --- ATUALIZAÇÃO (Debug 8): Corrige o tipo 'any' implícito (ts(7006)) ---
// --- ATUALIZAÇÃO (Debug 9): Corrige o typo 'e.targe.value' ---
// --- ATUALIZAÇÃO (Debug 10): Move 'useToast' para o 'LivePage' e substitui 'alert()' ---

import React, { useState, useEffect, FormEvent, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '@/services/api';
import { useAuth } from '@/contexts/AuthProvider';
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
import type { UserData, Message as ChatMessage } from '@/types/types';
import { useToast } from "@/components/ui/use-toast"; 
import { Button } from '@/components/ui/button'; 
import LiveTipModal from '@/components/LiveTipModal'; 

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
const LiveContent: React.FC = () => {
    const { roomName } = useParams<{ roomName: string }>();
    const { user } = useAuth(); 
    // const { toast } = useToast(); // <-- Removido daqui
    const [socket, setSocket] = useState<Socket | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]); // Usa o tipo global
    const [inputValue, setInputValue] = useState('');
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const [isSocketConnected, setIsSocketConnected] = useState(false);
    const [isTipModalOpen, setIsTipModalOpen] = useState(false);

    useEffect(() => { /* Socket connection */
        if (user && roomName) {
            
            // =======================================================
            // ▼▼▼ CORREÇÃO (Bug 3): URL do Socket (Porta) ▼▼▼
            // =======================================================
            // CORRIGIDO: Voltando para a porta 3333 que o seu log local usa
            const socketUrl = import.meta.env.VITE_API_URL || 'http://localhost:3333';
            // =======================================================
            // ▲▲▲ FIM DA CORREÇÃO ▲▲▲
            // =======================================================
            
            const newSocket = io(socketUrl, { transports: ['websocket', 'polling'] });
            setSocket(newSocket);
            newSocket.on('connect', () => { setIsSocketConnected(true); newSocket.emit('join_room', roomName); });
            newSocket.on('disconnect', () => setIsSocketConnected(false));
            
            // =======================================================
            // ▼▼▼ CORREÇÃO (Bug 2 e Bug 5): Adiciona o tipo 'Error' ao 'err' ▼▼▼
            // =======================================================
            newSocket.on('connect_error', (err: Error) => { // <-- TIPO ADICIONADO AQUI
                console.error('[LiveChat] Socket connection error:', err.message); 
                setIsSocketConnected(false); 
            });
            // =======================================================
            // ▲▲▲ FIM DA CORREÇÃO ▲▲▲
            // =======================================================
            
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
        if (inputValue.trim() && user && socket && roomName && isSocketConnected) {
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
        {/* ======================================================= */}
        {/* ▼▼▼ CORREÇÃO (Bug 4): Cores do Chat ▼▼▼ */}
        {/* ======================================================= */}
        <div className="flex flex-col md:flex-row h-full bg-black text-white overflow-hidden">

            {/* Área do Player de Vídeo (Sem alteração) */}
            <div className="w-full aspect-video flex-shrink-0 md:flex-1 md:h-full md:aspect-auto bg-black relative">
                <LiveLayout />
            </div>

            {/* Área do Chat (Cores Corrigidas) */}
            <div className="w-full flex-1 min-h-0 md:h-full md:flex-none md:w-80 lg:w-96 bg-card flex flex-col md:flex-shrink-0 border-l border-border">
                {/* Cabeçalho */}
                <div className="p-4 border-b border-border flex-shrink-0"> <h2 className="text-xl font-semibold text-white">Chat ao Vivo</h2> </div>
                {/* Mensagens (área de scroll) */}
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
                {/* Input (fixo na base do chat) */}
                <div className="p-4 border-t border-border flex-shrink-0 bg-card">
                    <div className="flex items-center justify-end text-xs text-yellow-500 mb-2"> <Flame className="w-3 h-3 mr-1" /> <span className="text-gray-400">Saldo:</span> <span className="font-bold ml-1">{user?.pimentaBalance ?? 0}</span> </div>
                    
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                        
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
                        
                        <input 
                            type="text" 
                            placeholder={!isSocketConnected ? "Conectando..." : "Sua mensagem..."} 
                            value={inputValue} 
                            onChange={(e) => setInputValue(e.target.value)} // <-- 'e.targe.value' corrigido
                            disabled={!user || !socket || !isSocketConnected} 
                            className="flex-grow p-2 rounded-md bg-transparent border-b border-border text-white text-sm focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50" 
                        />
                        
                        <Button type="submit" size="icon" disabled={!user || !socket || !isSocketConnected || inputValue.trim() === ''} className="p-2 bg-primary rounded-md font-semibold text-sm hover:bg-primary/90 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed flex-shrink-0"> 
                            <SendHorizonal className="w-5 h-5" />
                        </Button>
                    </form>
                </div>
            </div>
        </div>
        {/* ======================================================= */}
        {/* ▲▲▲ FIM DA CORREÇÃO (Bug 4) ▲▲▲ */}
        {/* ======================================================= */}

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
// COMPONENTE 'LivePage' (Página Principal) - (ATUALIZADO)
// ======================================================================
const LivePage: React.FC = () => {
    const { roomName } = useParams<{ roomName: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [token, setToken] = useState<string | null>(null);
    const [wsUrl, setWsUrl] = useState<string | null>(null);
    const [isLoadingToken, setIsLoadingToken] = useState(true);
    
    // =======================================================
    // ▼▼▼ CORREÇÃO (Bug 2): Adiciona useToast() aqui ▼▼▼
    // =======================================================
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
                    // --- Troca 'alert()' por 'toast()' ---
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
    }, [user, navigate, roomName, toast]); // Adiciona 'toast' às dependências

    const handleDisconnected = async () => { /* Handle Disconnect */
        console.log("LiveKit desconectado...");
        try { await api.post('/lives/stop'); }
        catch(error: any) { if (error?.response?.status !== 404) console.warn("Stop falhou:", error); }
        finally { navigate('/lives'); }
    };

    const handleLiveKitError = (error: Error) => { /* Handle Error */
        console.error("[LiveKit ERROR]:", error);
        // --- Troca 'alert()' por 'toast()' ---
        toast({
            title: "Erro na Live",
            description: `Erro LiveKit: ${error.message}.`,
            variant: "destructive",
        });
    };
    // =======================================================
    // ▲▲▲ FIM DAS CORREÇÕES ▲▲▲
    // =======================================================

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