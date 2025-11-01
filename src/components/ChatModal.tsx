// src/components/ChatModal.tsx
// --- NOVO FICHEIRO (Fase 3B: O Modal de Chat Privado) ---
// --- (Corrigido com caminhos relativos e sem erros de 'any' ou 'string') ---

import React, { useState, useEffect, useRef, FormEvent } from 'react';
// --- Caminhos relativos para a pasta ./ui ---
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { useToast } from "./ui/use-toast";
import { SendHorizonal, Loader2, AlertCircle, ShoppingCart } from 'lucide-react';
// --- Caminhos relativos para pastas superiores ---
import { useAuth } from '../contexts/AuthProvider'; 
import type { UserData, Message } from '../types/types'; 
import { fetchConversation, sendMessage } from '../services/chatApi'; 
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { AxiosError } from 'axios';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  // O usuário com quem estamos conversando
  targetUser: UserData | null; 
}

const ChatModal: React.FC<ChatModalProps> = ({ isOpen, onClose, targetUser }) => {
  const { user: loggedInUser, setUser } = useAuth(); // Pega o usuário logado e a função de atualizar
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Referência para o final da lista de mensagens (para auto-scroll)
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Efeito para buscar o histórico da conversa quando o modal abre
  useEffect(() => {
    if (isOpen && targetUser && loggedInUser) {
      const loadConversation = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const history = await fetchConversation(targetUser.id);
          setMessages(history);
        } catch (err) {
          console.error(err);
          setError("Erro ao carregar o histórico da conversa.");
        } finally {
          setIsLoading(false);
        }
      };
      loadConversation();
    } else {
      // Limpa o chat ao fechar
      setMessages([]);
      setNewMessage("");
      setError(null);
    }
  }, [isOpen, targetUser, loggedInUser]);

  // Efeito para rolar para a última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Função para enviar uma nova mensagem
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !targetUser || isSending) return;

    setIsSending(true);
    setError(null);

    try {
      // 1. Chama a API (que chama o "Porteiro 3" e a rota de /send)
      const { message, newPimentaBalance } = await sendMessage(targetUser.id, newMessage);

      // 2. Adiciona a nova mensagem (retornada pela API) ao chat
      setMessages(currentMessages => [...currentMessages, message]);
      setNewMessage(""); // Limpa o input

      // 3. ATUALIZA O SALDO DE PIMENTAS (se o backend cobrou)
      // O 'newPimentaBalance' só vem se a cobrança foi feita
      if (newPimentaBalance !== null && setUser && loggedInUser) {
        // (Corrigido para o formato que o AuthProvider espera)
        setUser({ 
            ...loggedInUser, 
            pimentaBalance: newPimentaBalance 
        });
      }

    } catch (err) {
      console.error("Erro ao enviar mensagem:", err);
      // 4. TRATAMENTO DE ERRO (A parte mais importante)
      if (err instanceof AxiosError && err.response) {
        // Verifica se é o nosso código de erro "QUOTA_EXCEEDED"
        if (err.response.data?.code === 'QUOTA_EXCEEDED') {
          setError(err.response.data.message); // Ex: "Você não tem pimentas..."
        } else {
          setError("Erro ao enviar a mensagem. Tente novamente.");
        }
      } else {
        setError("Ocorreu um erro inesperado.");
      }
    } finally {
      setIsSending(false);
    }
  };

  if (!targetUser) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] h-[70vh] flex flex-col bg-card border-border text-white p-0">
        <DialogHeader className="p-4 border-b border-gray-700">
          <DialogTitle className="text-xl font-bold flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={targetUser.profilePictureUrl || undefined} alt={targetUser.name} />
              <AvatarFallback>{targetUser.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            {targetUser.name}
          </DialogTitle>
        </DialogHeader>
        
        {/* Corpo das Mensagens */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {isLoading && (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          )}

          {!isLoading && messages.map((msg) => {
            const isMyMessage = msg.authorId === loggedInUser?.id;
            return (
              <div 
                key={msg.id.toString()} // Converte para string para a key
                className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`p-3 rounded-lg max-w-[80%] ${isMyMessage ? 'bg-primary text-white' : 'bg-gray-700 text-white'}`}
                >
                  <p className="text-sm">{msg.content}</p>
                  <p className="text-xs opacity-70 mt-1 text-right">
                    {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true, locale: ptBR })}
                  </p>
                </div>
              </div>
            );
          })}
          {/* Div invisível para o auto-scroll */}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input de Envio */}
        <DialogFooter className="p-4 border-t border-gray-700">
          <form onSubmit={handleSubmit} className="w-full flex gap-2">
            <Input 
              placeholder="Escreva sua mensagem..."
              className="bg-gray-800 border-gray-700 text-white"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={isSending || !!error} // Desabilita se estiver enviando ou se deu erro de pimenta
            />
            <Button 
              type="submit" 
              variant="default" 
              size="icon"
              disabled={isSending || !newMessage.trim() || !!error}
            >
              {isSending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <SendHorizonal className="w-4 h-4" />
              )}
            </Button>
          </form>
        </DialogFooter>

        {/* Alerta de Erro (Falta de Pimentas) */}
        {error && (
          <Alert variant="destructive" className="m-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Limite Atingido!</AlertTitle>
            <AlertDescription className="flex flex-col gap-3">
              {error}
              <Button asChild variant="secondary" className="w-full" onClick={onClose}>
                <Link to="/loja">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Ir para a Loja de Pimentas
                </Link>
              </Button>
            </AlertDescription>
          </Alert>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ChatModal;

