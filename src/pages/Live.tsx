import React, { useState, useEffect, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '@/services/api';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthProvider';
import { 
    LiveKitRoom, 
    VideoTrack, 
    AudioTrack, // 1. IMPORTAMOS O COMPONENTE DE ÁUDIO
    useTracks,
    ControlBar,
    useLocalParticipant
} from '@livekit/components-react';
import '@livekit/components-styles';
import { Track } from 'livekit-client';
import { io, Socket } from 'socket.io-client';
import type { UserData } from '@/types/types';

interface ChatMessage {
    id: string;
    text: string;
    user: Pick<UserData, 'id' | 'name'>;
}

const LiveLayout = () => {
    // 2. ALTERAÇÃO PRINCIPAL: AGORA PEDIMOS PELA CÂMERA E PELO MICROFONE
    const tracks = useTracks([Track.Source.Camera, Track.Source.Microphone]);
    const { localParticipant } = useLocalParticipant();

    // Encontra a faixa de vídeo específica do host (quem está publicando)
    const hostVideoTrack = tracks.find(trackRef => 
        trackRef.participant.permissions?.canPublish === true && trackRef.source === Track.Source.Camera
    );
    
    // Encontra TODAS as faixas de áudio na sala (do host e de outros, se aplicável)
    const audioTracks = tracks.filter(trackRef => trackRef.source === Track.Source.Microphone);

    const isHost = localParticipant.permissions?.canPublish === true;

    return (
        <div className="flex-grow flex flex-col bg-black relative">
            {hostVideoTrack ? (
                <VideoTrack trackRef={hostVideoTrack} style={{ width: '100%', height: '100%' }} />
            ) : (
                <div className="flex justify-center items-center h-full text-white">
                    Aguardando o início da transmissão...
                </div>
            )}
            
            {/* 3. RENDERIZAMOS OS COMPONENTES DE ÁUDIO (ELES SÃO INVISÍVEIS) */}
            {/* Para cada faixa de áudio, criamos um player de áudio invisível na página */}
            {audioTracks.map(trackRef => (
                <AudioTrack key={trackRef.participant.sid} trackRef={trackRef} />
            ))}
            
            {isHost && <ControlBar />}
        </div>
    );
};

const LivePage: React.FC = () => {
    const { roomName } = useParams<{ roomName: string }>(); 
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const [token, setToken] = useState<string | null>(null);
    const [wsUrl, setWsUrl] = useState<string | null>(null);
    const [socket, setSocket] = useState<Socket | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputValue, setInputValue] = useState('');
    
    useEffect(() => {
        const fetchToken = async () => {
            if (user && roomName) {
                try {
                    const response = await api.get(`/lives/token/${roomName}`);
                    setToken(response.data.token);
                    setWsUrl(response.data.wsUrl);
                } catch (error) {
                    console.error('Erro ao buscar token do LiveKit:', error);
                    alert('Não foi possível conectar à live. Verifique se a live ainda está ativa.');
                    navigate('/explorar');
                }
            }
        };
        fetchToken();
    }, [user, navigate, roomName]);

    useEffect(() => {
        if (user && roomName) {
            const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:3333');
            setSocket(newSocket);
            newSocket.on('connect', () => {
                newSocket.emit('join_room', roomName);
            });
            return () => { newSocket.disconnect(); };
        }
    }, [user, roomName]);
    
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
        if (inputValue.trim() && user && socket && roomName) {
            const messageData: ChatMessage = {
                id: new Date().getTime().toString(),
                text: inputValue,
                user: { id: user.id, name: user.name },
            };
            socket.emit('chat message', messageData, roomName);
            setMessages(prevMessages => [...prevMessages, messageData]);
            setInputValue('');
        }
    };

    const onLiveStop = async () => {
        try {
            await api.post('/live/stop');
        } catch (error) {
            console.error("Erro ao tentar parar a live no backend:", error);
        } finally {
            navigate('/lives');
        }
    };

    if (!token || !wsUrl) {
        return (
            <Layout>
                <div className="flex justify-center items-center h-screen bg-background text-white">
                    Conectando à live...
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <LiveKitRoom
                video={true}
                audio={true}
                token={token}
                serverUrl={wsUrl}
                data-lk-theme="default"
                style={{ height: 'calc(100vh - 64px)' }}
                onDisconnected={onLiveStop}
            >
                <div className="flex flex-col md:flex-row h-full">
                    <LiveLayout />
                    <div className="w-full md:w-80 lg:w-96 bg-gray-800 flex flex-col flex-shrink-0 border-l border-gray-700 h-full">
                        <div className="p-4 border-b border-gray-700"><h2 className="text-xl font-semibold">Chat ao Vivo</h2></div>
                        <div className="flex-grow p-4 space-y-4 overflow-y-auto">
                            {messages.map((msg) => (
                                <div key={msg.id} className="flex items-start gap-3">
                                    <span className={`font-bold ${user && msg.user.id === user.id ? 'text-green-400' : 'text-blue-400'}`}>
                                        {user && msg.user.id === user.id ? 'Você' : msg.user.name}:
                                    </span> 
                                    <p className="break-words text-white">{msg.text}</p>
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
                                className="w-full p-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50" 
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
            </LiveKitRoom>
        </Layout>
    );
};

export default LivePage;