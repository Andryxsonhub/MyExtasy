// src/components/LiveControls.tsx (VERSÃO 100% COMPLETA E LIMPA)

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/services/api';
import { Video } from 'lucide-react';
import { useAuth } from '@/contexts/AuthProvider';

const LiveControls = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleStartLive = async () => {
        setIsLoading(true);
        setError(null);

        if (!user || !user.id) {
            setError("Dados do usuário não encontrados. Por favor, faça login novamente.");
            setIsLoading(false);
            return;
        }

        try {
            await api.post('/lives/start');
            
            const roomName = `live-${user.id}`;
            
            navigate(`/live/${roomName}`);

        } catch (err) {
            console.error("Erro ao iniciar a live:", err);
            if (err && typeof err === 'object' && 'response' in err) {
                const axiosError = err as { response?: { status?: number } };
                if (axiosError.response?.status === 409) {
                    setError('Você já tem uma live ativa.');
                } else {
                    setError('Não foi possível iniciar a live.');
                }
            } else {
                setError('Ocorreu um erro inesperado.');
            }
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-lg shadow-2xl max-w-lg mx-auto text-center border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-2">Seu Painel de Controle</h2>
            <p className="text-gray-400 mb-6">Pronto para começar? Clique para iniciar sua live.</p>

            <button
                onClick={handleStartLive}
                disabled={isLoading}
                className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:bg-green-700 transition-all duration-300 flex items-center justify-center gap-2 disabled:bg-gray-500 disabled:cursor-wait"
            >
                <Video size={20} />
                {isLoading ? 'Iniciando...' : 'Iniciar Live'}
            </button>

            {error && (
                <div className="mt-4 p-3 bg-red-900/50 border border-red-700 text-red-300 rounded-lg text-sm">
                    {error}
                </div>
            )}
        </div>
    );
};

export default LiveControls;