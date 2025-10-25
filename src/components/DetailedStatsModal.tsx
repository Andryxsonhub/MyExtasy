// src/components/DetailedStatsModal.tsx
// --- VERSÃO CORRIGIDA (Dependências do useEffect ajustadas) ---

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"; // Usando shadcn Dialog
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, X } from 'lucide-react';
import api from '../services/api';
import { StatType } from './ProfileSidebar'; // Importa o tipo
import { Link } from 'react-router-dom'; // Para tornar os nomes clicáveis

// Interface para os usuários listados no modal
interface ListedUser {
    id: number;
    name: string;
    profilePictureUrl: string | null;
}

interface DetailedStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
  statType: StatType;
}

const DetailedStatsModal: React.FC<DetailedStatsModalProps> = ({ isOpen, onClose, userId, statType }) => {
  const [userList, setUserList] = useState<ListedUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mapeia o tipo de estatística para a URL da API e o título do Modal
  // Este objeto é recriado a cada render, mas não tem problema se não estiver nas dependências do useEffect
  const config = {
    followers: { url: `/users/${userId}/followers`, title: 'Seguidores' },
    following: { url: `/users/${userId}/following`, title: 'Seguindo' },
    likers: { url: `/users/${userId}/likers`, title: 'Curtidas Recebidas' },
  };

  const currentConfig = config[statType];

  useEffect(() => {
    // Busca os dados apenas se o modal estiver aberto e tivermos uma configuração válida
    if (isOpen && currentConfig) {
      const fetchUserList = async () => {
        setIsLoading(true);
        setError(null);
        setUserList([]); // Limpa a lista anterior ao buscar
        try {
          // Usa a URL correta baseada no statType
          const response = await api.get<ListedUser[]>(currentConfig.url);
          setUserList(response.data);
        } catch (err) {
          console.error(`Erro ao buscar ${statType}:`, err);
          setError(`Não foi possível carregar a lista de ${currentConfig.title.toLowerCase()}.`);
        } finally {
          setIsLoading(false);
        }
      };
      fetchUserList();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, userId, statType]); // <-- CORREÇÃO APLICADA AQUI: Removido 'currentConfig'

  // Se não estiver aberto, não renderiza nada (ou retorna null)
  if (!isOpen) {
    return null;
  }

  return (
    // Usa o componente Dialog do shadcn/ui
    // Controlado pelo isOpen que vem do componente pai
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] bg-card border-border text-foreground">
        <DialogHeader>
          <DialogTitle className="text-white">{currentConfig?.title || 'Detalhes'}</DialogTitle>
          <DialogDescription>
            Lista de usuários.
          </DialogDescription>
        </DialogHeader>

        {/* Corpo do Modal */}
        <div className="py-4 max-h-[60vh] overflow-y-auto pr-2"> {/* Altura máxima e scroll */}
          {isLoading && (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
          )}
          {error && <p className="text-red-500 text-center">{error}</p>}
          {!isLoading && !error && userList.length === 0 && (
            <p className="text-gray-400 text-center py-10">Nenhum usuário encontrado.</p>
          )}
          {!isLoading && !error && userList.length > 0 && (
            <ul className="space-y-3">
              {userList.map((listedUser) => (
                <li key={listedUser.id} className="flex items-center space-x-3 p-2 rounded hover:bg-muted/50">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={listedUser.profilePictureUrl || undefined} alt={listedUser.name} />
                    <AvatarFallback>{listedUser.name?.substring(0, 2).toUpperCase() || '??'}</AvatarFallback>
                  </Avatar>
                  {/* Torna o nome clicável para ir ao perfil */}
                  <Link to={`/profile/${listedUser.id}`} className="font-medium text-white hover:text-primary" onClick={onClose}>
                    {listedUser.name || 'Usuário'}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

         {/* Botão de fechar no canto (padrão do DialogContent geralmente já tem) */}
         <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default DetailedStatsModal;