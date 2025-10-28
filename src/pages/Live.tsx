import React, { useState, useEffect, FormEvent, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '@/services/api';
import { useAuth } from '@/contexts/AuthProvider';
import { Flame, ArrowLeft } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import {
    LiveKitRoom,
    VideoTrack,
    AudioTrack,
    useTracks,
    ControlBar,
    useLocalParticipant,
    useRoomContext
} from '@livekit/components-react';
import '@livekit/components-styles';
import { Track } from 'livekit-client';
import type { UserData } from '@/types/types';

// ======================================================================
// COMPONENTE 'LiveLayout' (Player)
// ======================================================================
const LiveLayout = () => {
    const tracks = useTracks([Track.Source.Camera, Track.Source.Microphone]);
    const { localParticipant } = useLocalParticipant();
    const hostVideoTrack = tracks.find(trackRef => trackRef.participant.permissions?.canPublish === true && trackRef.source === Track.Source.Camera && !trackRef.participant.isLocal) ||
                           tracks.find(trackRef => trackRef.participant.permissions?.canPublish === true && trackRef.source === Track.Source.Camera && trackRef.participant.isLocal);
    const audioTracks = tracks.filter(trackRef => trackRef.source === Track.Source.Microphone);
    const isHost = localParticipant?.permissions?.canPublish === true;

    return (
        // Container do Player: Garante que o vídeo preencha o espaço sem estourar
        <div className="flex-grow flex flex-col bg-black relative w-full h-full overflow-hidden items-center justify-center">
            {hostVideoTrack ? (
                // Aplica max-w-full e max-h-full para garantir contenção
                <VideoTrack trackRef={hostVideoTrack} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
            ) : (
                <div className="flex justify-center items-center h-full text-white text-lg font-semibold">
                    Aguardando o início da transmissão...
                </div>
            )}
            {audioTracks.map(trackRef => (
                <AudioTrack key={trackRef.participant.sid} trackRef={trackRef} />
            ))}
            {/* ControlBar agora fica sobre o vídeo */}
            {isHost && (
                <div className="absolute bottom-0 left-0 right-0 z-10 p-2">
                     <ControlBar controls={{ microphone: true, camera: true, screenShare: false, chat: false, leave: true }} />
                 </div>
            )}
        </div>
    );
};

// ======================================================================
// COMPONENTE 'LiveContent' (Vídeo + Chat)
// ======================================================================
interface ChatMessage { id: string; text: string; user: Pick<UserData, 'id' | 'name'>; }

const LiveContent: React.FC = () => {
    const { roomName } = useParams<{ roomName: string }>();
    const { user } = useAuth();
    const [socket, setSocket] = useState<Socket | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputValue, setInputValue] = useState('');
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const [isSocketConnected, setIsSocketConnected] = useState(false);

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
            const messageData: ChatMessage = { id: `${socket.id}-${Date.now()}`, text: inputValue, user: { id: user.id, name: user.name || 'Usuário' }, };
            socket.emit('chat message', messageData, roomName);
            setMessages(prev => [...prev, messageData]); setInputValue('');
        }
    };

    // Layout para Conteúdo da Live (Vídeo + Chat)
    return (
        // Container Principal: Coluna no mobile (default), Linha no desktop (md:flex-row)
        // Adicionado overflow-hidden para garantir que o conteúdo não estoure
        <div className="flex flex-col md:flex-row h-full bg-black text-white overflow-hidden">

            {/* Área do Player de Vídeo */}
            {/* Mobile: aspect-video; Desktop: Ocupa o espaço restante (flex-1) */}
            <div className="w-full aspect-video flex-shrink-0 md:flex-1 md:h-full md:aspect-auto bg-black relative">
                <LiveLayout />
            </div>

            {/* Área do Chat */}
            {/* Mobile: Ocupa espaço restante (flex-1); Desktop: Largura fixa (md:w-80), não encolhe (md:flex-shrink-0) */}
            {/* A estrutura flex-col aqui garante que header/mensagens/input fiquem fixos verticalmente */}
            <div className="w-full flex-1 min-h-0 md:h-full md:flex-none md:w-80 lg:w-96 bg-gray-900 flex flex-col md:flex-shrink-0 border-l border-gray-700">
                {/* Cabeçalho (fixo no topo do chat) */}
                <div className="p-4 border-b border-gray-700 flex-shrink-0"> <h2 className="text-xl font-semibold text-white">Chat ao Vivo</h2> </div>
                {/* Mensagens (área de scroll) */}
                <div ref={chatContainerRef} className="flex-grow p-4 space-y-3 overflow-y-auto min-h-0">
                     {!isSocketConnected && <p className="text-sm text-yellow-400 text-center">Conectando...</p>}
                     {isSocketConnected && messages.length === 0 && <p className="text-sm text-gray-500 text-center">Nenhuma mensagem.</p>}
                     {messages.map((msg) => ( <div key={msg.id} className="flex items-start gap-2.5 text-sm"> <span className={`font-semibold flex-shrink-0 ${user && msg.user.id === user.id ? 'text-green-400' : 'text-blue-400'}`}> {user && msg.user.id === user.id ? 'Você' : msg.user.name || 'Anônimo'}: </span> <p className="break-words text-gray-200">{msg.text}</p> </div> ))}
                 </div>
                 {/* Input (fixo na base do chat) */}
                 <div className="p-4 border-t border-gray-700 flex-shrink-0 bg-gray-800">
                     <div className="flex items-center justify-end text-xs text-yellow-500 mb-2"> <Flame className="w-3 h-3 mr-1" /> <span className="text-gray-400">Saldo:</span> <span className="font-bold ml-1">{user?.pimentaBalance ?? 0}</span> </div>
                     <form onSubmit={handleSendMessage} className="flex gap-2">
                         <input type="text" placeholder={!isSocketConnected ? "Conectando..." : "Sua mensagem..."} value={inputValue} onChange={(e) => setInputValue(e.target.value)} disabled={!user || !socket || !isSocketConnected} className="flex-grow p-2 rounded-md bg-gray-700 border border-gray-600 text-white text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 disabled:opacity-50" />
                         <button type="submit" disabled={!user || !socket || !isSocketConnected || inputValue.trim() === ''} className="p-2 bg-purple-600 rounded-md font-semibold text-sm hover:bg-purple-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed flex-shrink-0"> Enviar </button>
                     </form>
                 </div>
            </div>
        </div>
    );
};


// ======================================================================
// COMPONENTE 'LivePage' (Página Principal)
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
        // Container principal ajustado para altura correta e overflow hidden
        // CORREÇÃO: Adicionado overflow-hidden para evitar scroll da página inteira
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

