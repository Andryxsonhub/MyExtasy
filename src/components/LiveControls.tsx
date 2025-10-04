import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/services/api'; // Seu serviço de API
import { Video } from 'lucide-react';

const LiveControls = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleStartLive = async () => {
        setIsLoading(true);
        setError(null);

        try {
            // Passo 1: Avisa o backend para criar o registro da live
            await api.post('/live/start');
            
            // Passo 2: Se o passo 1 deu certo, navega para a página da live
            // A página '/live/me' vai então buscar o token e conectar ao LiveKit
            navigate('/live/me');

        } catch (err) { // CORREÇÃO: 'err' agora é tratado como 'unknown' por padrão
            console.error("Erro ao iniciar a live:", err);

            // Verificação de tipo para tratar o erro de forma segura
            if (err && typeof err === 'object' && 'response' in err) {
                const axiosError = err as { response?: { status?: number } };
                if (axiosError.response?.status === 409) {
                    setError('Você já tem uma live ativa. Finalize a anterior ou apague-a no banco de dados para testes.');
                } else {
                    setError('Não foi possível iniciar a live. Verifique o console do backend.');
                }
            } else {
                // Fallback para erros que não vêm da API
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

