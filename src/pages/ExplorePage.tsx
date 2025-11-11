// src/pages/ExplorePage.tsx
// --- ★★★ CORREÇÃO 11/11 (v7): Usando o EMOJI 🌶️ do Header ★★★ ---

import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';
import { Plus, Loader2 } from 'lucide-react'; // Ícone da Pimenta/Chama removido daqui
import ContentCard from '../components/ContentCard';
import type { MediaFeedItem, UserData } from '../types/types'; 
import api from '../services/api';
import { togglePhotoLike, toggleVideoLike } from '../services/interactionApi';
import { useAuth } from '@/contexts/AuthProvider';
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from '@/components/ui/button'; 

// Interface OnlineUser (OK)
interface OnlineUser { 
  id: number; 
  name: string; 
  profilePictureUrl: string | null; 
  gender: string | null; 
  destacadoAte?: string | null;
}

// Componente OnlineUser (ATUALIZADO COM O EMOJI 🌶️)
const OnlineUser: React.FC<{ user: OnlineUser }> = ({ user }) => {
  const isDestacado = user.destacadoAte && new Date(user.destacadoAte) > new Date();
  
  return (
    <Link to={`/profile/${user.id}`} key={user.id} className="relative flex flex-col items-center flex-shrink-0 w-20 text-center group">
      <Avatar className={`w-16 h-16 mb-2 border-2 ${isDestacado ? 'border-primary' : 'border-green-500'} transition-transform group-hover:scale-105`}>
        <AvatarImage src={user.profilePictureUrl || undefined} alt={user.name} />
        <AvatarFallback>{user.name?.substring(0, 2).toUpperCase() ?? '??'}</AvatarFallback>
      </Avatar>

      {isDestacado && (
        // ★★★ AQUI ESTÁ O EMOJI (Finalmente!) ★★★
        // (Ajustei o padding 'p-0.5' e o tamanho 'text-base' para ficar bonito)
        <div className="absolute top-0 right-1 bg-card p-0.5 rounded-full border border-primary/50">
          <span className="text-base" role="img" aria-label="pimenta">🌶️</span>
        </div>
        // ★★★ FIM DO EMOJI ★★★
      )}

      <p className="text-sm font-semibold text-white truncate w-full">{user.name ?? 'Nome Indisponível'}</p>
      <p className="text-xs text-gray-400">{user.gender ?? 'Não informado'}</p>
    </Link>
  );
};


const ExplorePage: React.FC = () => {
  const [feedMedia, setFeedMedia] = useState<MediaFeedItem[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user, setUser } = useAuth();
  const { toast } = useToast();
  const [isDestaqueModalOpen, setIsDestaqueModalOpen] = useState(false);
  const [isComprandoDestaque, setIsComprandoDestaque] = useState(false);

  const fetchOnlineUsers = async () => {
    try {
      const onlineUsersResponse = await api.get('/users/online');
      setOnlineUsers(onlineUsersResponse.data);
    } catch (err) {
      console.error("Erro ao buscar usuários online:", err);
    }
  };

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        setIsLoading(true); setError(null);
        const [feedResponse, _] = await Promise.all([
            api.get('/media/feed'), 
            fetchOnlineUsers() 
        ]);
        setFeedMedia(feedResponse.data);
      } catch (err) {
        console.error("Erro ao buscar dados da página:", err);
        setError("Não foi possível carregar o conteúdo.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPageData();
  }, []);

  // Lógica de Like Otimista (Sem alteração)
  const handleLike = async (mediaId: number, mediaType: 'photo' | 'video') => {
    const originalMedia = [...feedMedia];
    setFeedMedia(prevMedia =>
        prevMedia.map(item =>
            item.id === mediaId && item.media_type === mediaType
                ? { ...item, isLikedByMe: !item.isLikedByMe, likeCount: item.isLikedByMe ? item.likeCount - 1 : item.likeCount + 1, }
                : item
        )
    );
    try {
        if (mediaType === 'photo') { await togglePhotoLike(mediaId); }
        else { await toggleVideoLike(mediaId); }
    } catch (error) {
        console.error("Erro ao processar curtida:", error);
        alert("Erro ao processar curtida. Tente novamente.");
        setFeedMedia(originalMedia);
    }
  };

  // Função Comprar Destaque (Sem alteração)
  const handleComprarDestaque = async () => {
    if (!user || (user.pimentaBalance ?? 0) < 300) {
      toast({ title: "Saldo Insuficiente", description: "Você precisa de pelo menos 300 pimentas.", variant: "destructive" });
      return;
    }
    
    setIsComprandoDestaque(true);
    try {
      const response = await api.post('/pimentas/comprar-destaque');
      const { novoSaldo, destacadoAte } = response.data;

      if (setUser) {
        setUser({ ...user, pimentaBalance: novoSaldo, destacadoAte: destacadoAte });
      }

      setIsDestaqueModalOpen(false);

      toast({ title: "Destaque ativado!", description: "Seu perfil agora está em destaque por 24 horas.", className: "bg-green-600 text-white border-green-700" });

      await fetchOnlineUsers(); 

    } catch (error: any) {
      console.error("Erro ao comprar destaque:", error);
      const errorMsg = error.response?.data?.message || "Não foi possível comprar o destaque.";
      toast({ title: "Erro", description: errorMsg, variant: "destructive" });
    } finally {
      setIsComprandoDestaque(false);
    }
  };

  // (Sem alteração)
  const isJaDestacado = !!(user && user.destacadoAte && new Date(user.destacadoAte) > new Date());


  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      {/* Título */}
      <div className="flex justify-between items-center mb-6"> <h1 className="text-3xl font-bold text-white">Explorar Comunidade</h1> </div>

      {/* Seção Online Agora */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Online agora</h2>
          <Link to="/explorar" className="text-sm text-primary hover:underline">Ver mais</Link>
        </div>
        <div className="flex space-x-4 overflow-x-auto pb-4">
          
          {/* Botão Destaque-se */}
          <div className="flex flex-col items-center flex-shrink-0 w-20 text-center">
            <button
              onClick={() => setIsDestaqueModalOpen(true)}
              disabled={isJaDestacado} 
              title={isJaDestacado ? "Seu perfil já está em destaque!" : "Clique para destacar seu perfil"}
              className={`w-16 h-16 rounded-full flex items-center justify-center border-2 border-dashed border-primary/50 transition-all ${isJaDestacado ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary hover:bg-primary/10'}`}
            >
              <Plus className={`w-8 h-8 ${isJaDestacado ? 'text-gray-600' : 'text-primary'}`} />
            </button>
            <span className="text-xs text-gray-300 font-medium">Destaque-se</span>
            <span className="text-xs text-yellow-500 font-bold">300 🌶️</span>
          </div>

          {/* Mensagem se não houver usuários online */}
          {onlineUsers.length === 0 && !isLoading && (
            <div className="flex items-center pl-4">
                <p className="text-gray-500 text-sm">Ninguém online no momento.</p>
            </div>
          )}

          {/* Mapeamento dos usuários online */}
          {onlineUsers.map((onlineUser: OnlineUser) => (
            <OnlineUser key={onlineUser.id} user={onlineUser} />
          ))}
        </div>
      </div>

      {/* Seção Destaques da Comunidade */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Destaques da Comunidade</h2>
        {isLoading && <div className="text-center py-16"><Loader2 className="mx-auto h-8 w-8 text-primary animate-spin" /></div>}
        
        {error && <p className="text-red-500 text-center py-10">{error}</p>}
        
        {!isLoading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {feedMedia.map((media) => (
              <ContentCard
                key={`${media.media_type}-${media.id}`}
                post={media}
                onLike={handleLike}
              />
            ))}
          </div>
        )}
         {!isLoading && !error && feedMedia.length === 0 && (
            <p className="text-gray-500 text-center py-10">Nenhuma mídia encontrada nos destaques.</p>
         )}
      </div>

      {/* Modal de Confirmação "Destaque-se" */}
      <AlertDialog open={isDestaqueModalOpen} onOpenChange={setIsDestaqueModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Destacar seu Perfil?</AlertDialogTitle>
            <AlertDialogDescription>
              Isso custará <span className="font-bold text-yellow-400">300 pimentas</span> (Seu saldo: {user?.pimentaBalance ?? 0}).
              Seu perfil aparecerá no topo da lista "Online agora" para todos os usuários por 24 horas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isComprandoDestaque}>Cancelar</AlertDialogCancel>
            <Button
              disabled={isComprandoDestaque || (user?.pimentaBalance ?? 0) < 300}
              onClick={handleComprarDestaque}
              className="bg-primary hover:bg-primary/90"
            >
              {isComprandoDestaque ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                // ★ AQUI TAMBÉM: Usei o EMOJI no botão de confirmar
                <span className="mr-2 text-base" role="img" aria-label="pimenta">🌶️</span>
              )}
              Confirmar Pagamento
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
};

export default ExplorePage;