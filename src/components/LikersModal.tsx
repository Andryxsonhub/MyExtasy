// src/components/LikersModal.tsx (NOVO ARQUIVO)

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription, // Opcional
  DialogClose, // Para o botão de fechar
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area"; // Para listas longas
import { Link } from 'react-router-dom';
import { X, Loader2 } from 'lucide-react';
import type { LikerUser } from '../types/types'; // Importa o tipo

interface LikersModalProps {
  isOpen: boolean;
  onClose: () => void;
  likers: LikerUser[] | null; // Pode ser null enquanto carrega
  isLoading: boolean;
  title?: string; // Título opcional
}

const LikersModal: React.FC<LikersModalProps> = ({
  isOpen,
  onClose,
  likers,
  isLoading,
  title = "Curtidas" // Título padrão
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-card border-border text-white">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {/* Opcional: <DialogDescription>Veja quem curtiu.</DialogDescription> */}
        </DialogHeader>

        {/* Botão de Fechar no Canto */}
        <DialogClose asChild>
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-white"
            aria-label="Fechar"
            onClick={onClose}
          >
            <X size={24} />
          </button>
        </DialogClose>

        {/* Conteúdo do Modal */}
        <div className="mt-4 max-h-[60vh]"> {/* Limita a altura */}
          {isLoading && (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {!isLoading && likers && likers.length > 0 && (
            <ScrollArea className="h-full pr-4"> {/* Adiciona Scroll e padding */}
              <ul className="space-y-3">
                {likers.map((liker) => (
                  <li key={liker.id} className="flex items-center space-x-3">
                    <Link to={`/profile/${liker.id}`} onClick={onClose} className="flex items-center space-x-3 group">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={liker.profilePictureUrl || undefined} alt={liker.name} />
                        <AvatarFallback>{liker.name?.substring(0, 2).toUpperCase() ?? '??'}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium group-hover:text-primary transition-colors">{liker.name ?? 'Usuário'}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          )}

          {!isLoading && (!likers || likers.length === 0) && (
            <p className="text-center text-gray-500 py-10">Ninguém curtiu ainda.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LikersModal;