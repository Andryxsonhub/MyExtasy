// src/components/LiveControls.tsx (VERSÃO FINAL CONECTADA)

import React, { useState, useEffect } from 'react';
import api from '@/services/api';
import { useAuth } from '@/contexts/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Video, VideoOff } from 'lucide-react';

// Supondo que o seu useAuth() retorna um objeto 'user' que pode ter a propriedade isLive
// E uma função para atualizar esse estado. Se não, precisaremos adicionar.
interface AuthContextType {
    user: { id: number; isLive?: boolean; } | null;
    // Precisamos de uma forma de atualizar o status da live no contexto global
}

const LiveControls: React.FC = () => {
  const { user } = useAuth(); // Pegamos o usuário do nosso contexto de autenticação
  const navigate = useNavigate();
  
  const [isLive, setIsLive] = useState(false); // Vamos controlar o estado localmente por enquanto
  const [isLoading, setIsLoading] = useState(false);

  // No futuro, podemos sincronizar 'isLive' com o estado do usuário no AuthProvider
  // useEffect(() => {
  //   if(user) setIsLive(user.isLive || false);
  // }, [user]);

  const handleStartLive = async () => {
    setIsLoading(true);
    try {
      // 1. AVISA O NOSSO BACKEND QUE A LIVE COMEÇOU
      await api.post('/live/start');
      setIsLive(true);
      
      // 2. REDIRECIONA O USUÁRIO PARA A SUA PRÓPRIA PÁGINA DE LIVE
      if (user) {
        navigate(`/live/${user.id}`);
      }
    } catch (error) {
      console.error("Erro ao iniciar a live:", error);
      alert("Não foi possível iniciar a live. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStopLive = async () => {
    setIsLoading(true);
    try {
      // AVISA O NOSSO BACKEND QUE A LIVE ACABOU
      await api.post('/live/stop');
      setIsLive(false);
      // Opcional: redirecionar para a home ou para a página de lives
      navigate('/lives'); 
    } catch (error) {
      console.error("Erro ao parar a live:", error);
      alert("Não foi possível parar a live. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="bg-card border border-border p-6 rounded-lg shadow-lg flex flex-col items-center">
      <h2 className="text-xl font-bold text-white mb-4">Seu Painel de Controle</h2>
      {isLive ? (
        <Button
          variant="destructive"
          size="lg"
          onClick={handleStopLive}
          disabled={isLoading}
          className="w-full"
        >
          <VideoOff className="w-5 h-5 mr-2" />
          {isLoading ? 'Encerrando...' : 'Parar Live'}
        </Button>
      ) : (
        <Button
          size="lg"
          onClick={handleStartLive}
          disabled={isLoading}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          <Video className="w-5 h-5 mr-2" />
          {isLoading ? 'Iniciando...' : 'Iniciar Live'}
        </Button>
      )}
      <p className="text-xs text-gray-400 mt-3">
        {isLive ? "Você está ao vivo. Clique para encerrar a transmissão." : "Pronto para começar? Clique para iniciar sua live."}
      </p>
    </div>
  );
};

export default LiveControls;