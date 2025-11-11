// src/components/LiveTipModal.tsx
// --- ★★★ CORREÇÃO 10/11: Passando 'roomName' para a API ★★★ ---

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from '@/contexts/AuthProvider';
import { useToast } from "@/components/ui/use-toast";
import { transferirPimentas } from '@/services/pimentasApi'; // Importação OK
import { Loader2, Flame, Gift } from 'lucide-react';
import type { Socket } from 'socket.io-client';
import type { UserData, Message as ChatMessage } from '@/types/types'; 

interface LiveTipModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomName: string; // Ex: "live-1"
  socket: Socket | null; 
}

const tipAmounts = [10, 50, 100, 200, 500, 1000];

const LiveTipModal: React.FC<LiveTipModalProps> = ({ isOpen, onClose, roomName, socket }) => {
  const { user, setUser } = useAuth();
  const { toast } = useToast();
  const [customAmount, setCustomAmount] = useState("");
  const [isTipping, setIsTipping] = useState(false);

  const handleSendTip = async (amount: number) => {
    if (!user || !roomName || !socket || isTipping || amount <= 0) return;

    // 1. Pega o ID do Host (Receptor)
    const hostId = parseInt(roomName.split('-')[1], 10);
    if (isNaN(hostId)) {
        toast({ title: "Erro", description: "Não foi possível identificar o anfitrião.", variant: "destructive" });
        return;
    }

    // 2. Verifica saldo
    if ((user.pimentaBalance ?? 0) < amount) {
        toast({ title: "Saldo Insuficiente", variant: "destructive" });
        return;
    }

    setIsTipping(true);

    try {
        // 3. Chama a API de transferência
        // ★★★ CORREÇÃO: Passando 'roomName' como o 4º argumento ★★★
        // (A variável 'amount' aqui será o 'valor' na API)
        const novoSaldo = await transferirPimentas(hostId, amount, 'presente_live', roomName);

        // 4. Atualiza o saldo (DO DOADOR)
        if (setUser && user) { 
            setUser({ ...user, pimentaBalance: novoSaldo });
        }

        // 5. Envia a mensagem no chat
        const tipMessage: ChatMessage = {
            id: `${socket.id}-${Date.now()}`,
            content: `enviou ${amount} 🌶️ de presente!`, 
            author: { id: user.id, name: user.name || 'Usuário', profilePictureUrl: user.profilePictureUrl },
            authorId: user.id,
            receiverId: hostId,
            createdAt: new Date().toISOString(),
            read: false,
            isTip: true 
        };
        socket.emit('chat message', tipMessage, roomName);

        toast({
            title: "Presente Enviado!",
            description: `Você enviou ${amount} pimentas.`,
            className: "bg-green-600 text-white border-green-700"
        });
        
        setCustomAmount(""); 
        onClose(); 

    } catch (error: any) {
        console.error("Erro ao enviar gorjeta:", error);
        const errorMsg = error.response?.data?.message || "Não foi possível enviar o presente.";
        toast({ title: "Erro", description: errorMsg, variant: "destructive" });
    } finally {
        setIsTipping(false);
    }
  };

  const handleCustomAmountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(customAmount, 10);
    if (!isNaN(amount) && amount > 0) {
      handleSendTip(amount);
    } else {
      toast({ title: "Valor Inválido", variant: "destructive" });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] bg-card border-border text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
            <Gift className="w-6 h-6 text-primary" />
            Enviar Presente
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Mostre seu apoio ao criador enviando pimentas!
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="flex justify-center items-center gap-2 bg-gray-800 p-3 rounded-lg mb-6">
            <span className="text-gray-400 text-sm">Meu Saldo:</span>
            <Flame className="w-5 h-5 text-yellow-500" />
            <span className="text-xl font-bold text-white">{user?.pimentaBalance ?? 0}</span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {tipAmounts.map((amount) => (
              <Button
                key={amount}
                variant="outline"
                className="h-auto py-3 bg-gray-700 border-gray-600 hover:bg-gray-600"
                onClick={() => handleSendTip(amount)}
                disabled={isTipping}
              >
                <span className="text-lg font-bold text-yellow-400 mr-1.5">🌶️</span>
                <span className="text-white font-semibold">{amount}</span>
              </Button>
            ))}
          </div>

          <form onSubmit={handleCustomAmountSubmit} className="mt-6 flex gap-2">
            <Input 
              type="number"
              placeholder="Outro valor"
              className="bg-gray-900 border-gray-700 text-white"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              disabled={isTipping}
            />
            <Button 
              type="submit" 
              variant="default"
              className="bg-primary hover:bg-primary/90"
              disabled={isTipping || !customAmount}
            >
              {isTipping ? <Loader2 className="w-4 h-4 animate-spin" /> : "Enviar"}
            </Button>
          </form>
        </div>
        
      </DialogContent>
    </Dialog>
  );
};

export default LiveTipModal;