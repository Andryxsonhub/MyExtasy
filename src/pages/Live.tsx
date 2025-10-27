import React, { useState, useEffect, FormEvent, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '@/services/api';
// Layout foi removido, pois o Header já é fixo e o Layout
// estava potencialmente causando scroll duplo ou padding indesejado.
// import Layout from '@/components/Layout'; 
import { useAuth } from '@/contexts/AuthProvider';
import { Flame } from 'lucide-react';
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
// COMPONENTE 'LiveLayout' (Player - SEM ALTERAÇÃO)
// ======================================================================
const LiveLayout = () => {
    const tracks = useTracks([Track.Source.Camera, Track.Source.Microphone]);
    const { localParticipant } = useLocalParticipant();
    const hostVideoTrack = tracks.find(trackRef => trackRef.participant.permissions?.canPublish === true && trackRef.source === Track.Source.Camera);
    const audioTracks = tracks.filter(trackRef => trackRef.source === Track.Source.Microphone);
    const isHost = localParticipant?.permissions?.canPublish === true;

    return (
        <div className="flex-grow flex flex-col bg-black relative w-full h-full overflow-hidden">
            {hostVideoTrack ? (
                <>
                    <VideoTrack trackRef={hostVideoTrack} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </>
            ) : (
                <>
                    <div className="flex justify-center items-center h-full text-white text-lg font-semibold">
                        Aguardando o início da transmissão...
                    </div>
                </>
            )}
            {audioTracks.map(trackRef => (
                <AudioTrack key={trackRef.participant.sid} trackRef={trackRef} />
            ))}
            {isHost && <ControlBar />}
        </div>
    );
};

// ======================================================================
// COMPONENTE INTERNO: 'LiveContent'
// ======================================================================
interface ChatMessage {
    id: string;
    text: string;
    user: Pick<UserData, 'id' | 'name'>;
}

const LiveContent: React.FC = () => {
    const { roomName } = useParams<{ roomName: string }>();
    const { user } = useAuth();
    const [socket, setSocket] = useState<Socket | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputValue, setInputValue] = useState('');
    const chatContainerRef = useRef<HTMLDivElement>(null);

    // Conecta ao Socket.IO
    useEffect(() => {
        if (user && roomName) {
            const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:3333');
            setSocket(newSocket);
            newSocket.on('connect', () => { newSocket.emit('join_room', roomName); });
            newSocket.on('disconnect', () => console.log('Socket desconectado'));
            return () => { newSocket.disconnect(); };
        }
    }, [user, roomName]);

    // Ouve mensagens do chat
    useEffect(() => {
        if (socket) {
            const handleNewMessage = (msg: ChatMessage) => {
                setMessages(prevMessages => [...prevMessages, msg]);
            };
            socket.on('chat message', handleNewMessage);
            return () => { socket.off('chat message', handleNewMessage); };
        }
    }, [socket]);

    // Auto-scroll
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    // Envia mensagem
    const handleSendMessage = (e: FormEvent) => {
        e.preventDefault();
        if (inputValue.trim() && user && socket && roomName) {
            const messageData: ChatMessage = {
                id: `${socket.id}-${Date.now()}`,
                text: inputValue,
                user: { id: user.id, name: user.name || 'Usuário' },
            };
            socket.emit('chat message', messageData, roomName);
            setMessages(prevMessages => [...prevMessages, messageData]);
            setInputValue('');
        }
    };

    // Layout do conteúdo da Live (Vídeo + Chat)
    return (
        // O container pai 'h-full' garante que ele preencha o LiveKitRoom (que é 100vh - 64px de padding)
        <div className="flex flex-col md:flex-row h-full bg-black text-white overflow-hidden">
            
            {/* ============================================================
                [PLAYER - CORRIGIDO PARA MOBILE]
                - 'aspect-video' garante que a Live tenha uma proporção 16:9 no mobile,
                  liberando espaço para o chat abaixo.
                - 'flex-shrink-0' impede que o vídeo seja esmagado.
            ============================================================ */}
            <div className="w-full aspect-video flex-shrink-0 md:h-full md:flex-grow md:aspect-auto bg-black">
                <LiveLayout /> {/* Renderiza o player */}
            </div>

            {/* ============================================================
                [CHAT - CORRIGIDO PARA MOBILE]
                - 'flex-1' faz o chat ocupar o espaço restante (abaixo do vídeo).
                - 'min-h-0' é crucial para permitir que o 'overflow' do chat-body funcione.
            ============================================================ */}
            <div className="w-full flex-1 min-h-0 md:min-h-full md:h-full md:flex-none md:w-80 lg:w-96 bg-gray-900 flex flex-col flex-shrink-0 border-l border-gray-700">
                
                {/* Cabeçalho (Fixo) */}
                <div className="p-4 border-b border-gray-700 flex-shrink-0">
                    <h2 className="text-xl font-semibold text-white">Chat ao Vivo</h2>
                </div>

                {/* Mensagens (Área de Scroll - FLEX-GROW) */}
                <div ref={chatContainerRef} className="flex-grow p-4 space-y-3 overflow-y-auto min-h-0">
                    {messages.map((msg) => (
                        <div key={msg.id} className="flex items-start gap-2.5 text-sm">
                            <span className={`font-semibold flex-shrink-0 ${user && msg.user.id === user.id ? 'text-green-400' : 'text-blue-400'}`}>
                                {user && msg.user.id === user.id ? 'Você' : msg.user.name || 'Anônimo'}:
                            </span>
                            <p className="break-words text-gray-200">{msg.text}</p>
                        </div>
                    ))}
                </div>

                {/* Rodapé (Input de texto - Fixo) */}
                <div className="p-4 border-t border-gray-700 flex-shrink-0 bg-gray-800">
                    
                    {/* Saldo (Exemplo de elemento fixo) */}
                    <div className="flex items-center justify-end text-xs text-yellow-500 mb-2">
                        <Flame className="w-3 h-3 mr-1" />
                        <span className="text-gray-400">Saldo:</span>
                        <span className="font-bold ml-1">{user?.pimentaBalance ?? 0}</span>
                    </div>

                    {/* Formulário (Fixo) */}
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                        <input
                            type="text"
                            placeholder={user ? "Sua mensagem..." : "Autenticando..."}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            disabled={!user || !socket}
                            className="flex-grow p-2 rounded-md bg-gray-700 border border-gray-600 text-white text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 disabled:opacity-50"
                        />
                        <button
                            type="submit"
                            disabled={!user || !socket || inputValue.trim() === ''}
                            className="p-2 bg-purple-600 rounded-md font-semibold text-sm hover:bg-purple-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed flex-shrink-0"
                        >
                            Enviar
                        </button>
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

    // Efeito para buscar o token
    useEffect(() => {
        const fetchToken = async () => {
            if (user && roomName) {
                try {
                    console.log(`[LivePage] Buscando token para sala: ${roomName}`);
                    const response = await api.get(`/lives/token/${roomName}`);
                    console.log("[LivePage] Token recebido:", response.data.token ? 'OK' : 'FALHOU');
                    console.log("[LivePage] WS URL recebida:", response.data.wsUrl);
                    setToken(response.data.token);
                    setWsUrl(response.data.wsUrl);
                } catch (error) {
                    console.error('Erro ao buscar token do LiveKit:', error);
                    alert('Não foi possível conectar à live. Verifique se a live ainda está ativa ou tente novamente.');
                    navigate('/lives');
                }
            }
        };
        fetchToken();
    }, [user, navigate, roomName]);

    // Função handleDisconnected
    const handleDisconnected = async () => {
        console.log("LiveKitRoom desconectado...");
        try {
            // Se o usuário era o host, informa o backend para parar a live
            const { data: userData } = await api.get('/auth/user'); 
            if (userData.isHost) { // Supondo que você tem uma flag isHost no perfil do usuário
                 await api.post('/lives/stop');
                 console.log("Informado backend sobre a parada da live (pelo host).");
            }
        } catch(error) {
            console.warn("Chamada para /lives/stop falhou ou não era necessária:", error);
        } finally {
            navigate('/lives');
        }
    };
    
    // Função onError
    const handleLiveKitError = (error: Error) => {
        console.error("[LiveKitRoom ERROR] Erro durante a conexão:", error);
        alert(`Erro de conexão com a Live: ${error.message}. Verifique sua conexão ou tente novamente.`);
    };

    // Renderiza loading
    if (!token || !wsUrl) {
        return (
            <div className="flex justify-center items-center h-screen pt-16 bg-background text-white">
                Conectando à live...
            </div>
        );
    }

    // Renderiza a LiveKitRoom
    return (
        <LiveKitRoom
            video={true}
            audio={true}
            token={token}
            serverUrl={wsUrl}
            data-lk-theme="default"
            // Garante que a LiveRoom ocupe 100% da altura da tela.
            style={{ height: '100vh' }} 
            // Adiciona padding no topo para começar abaixo do header fixo.
            className="pt-16" 
            onDisconnected={handleDisconnected}
            onError={handleLiveKitError}
        >
            <LiveContent /> {/* Renderiza o componente interno */}
        </LiveKitRoom>
    );
};

export default LivePage;