// src/components/AccountSettingsModal.tsx
// --- NOVO ARQUIVO (Fase 6) ---
// --- ATUALIZAÇÃO (Debug): Corrigindo caminhos de importação ---

import React, { useState } from 'react';
// --- CORREÇÃO: Usando caminhos relativos para os componentes 'ui' ---
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { useToast } from "./ui/use-toast"; // Para dar feedback
// --- FIM DA CORREÇÃO ---
import { AlertTriangle, Power, Trash2 } from 'lucide-react';


interface AccountSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFreeze: () => Promise<void>; // Funções que vêm do "pai"
  onDelete: () => Promise<void>; // Funções que vêm do "pai"
}

const AccountSettingsModal: React.FC<AccountSettingsModalProps> = ({ 
  isOpen, 
  onClose,
  onFreeze,
  onDelete
}) => {
  const { toast } = useToast();
  const [isFreezeLoading, setIsFreezeLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  
  // Estado para a trava de segurança de exclusão
  const [deleteConfirmationText, setDeleteConfirmationText] = useState("");
  const isDeleteDisabled = deleteConfirmationText !== "EXCLUIR";

  const handleFreeze = async () => {
    setIsFreezeLoading(true);
    try {
      await onFreeze();
      toast({
        title: "Conta Congelada",
        description: "Sua conta foi congelada. Você será desconectado.",
      });
      // O logout já é chamado pela função 'onFreeze' vinda do UserProfilePage
    } catch (error) {
      console.error("Erro ao congelar conta:", error);
      toast({
        title: "Erro",
        description: "Não foi possível congelar sua conta. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsFreezeLoading(false);
    }
  };

  const handleDelete = async () => {
    if (isDeleteDisabled) return;

    setIsDeleteLoading(true);
    try {
      await onDelete();
      toast({
        title: "Conta Excluída",
        description: "Sua conta foi excluída permanentemente. Você será desconectado.",
      });
    } catch (error) {
      console.error("Erro ao excluir conta:", error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir sua conta. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsDeleteLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] bg-card border-border text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Gerenciamento da Conta</DialogTitle>
          <DialogDescription className="text-gray-400">
            Ações de conta são permanentes e devem ser feitas com cuidado.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="congelar" className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-2 bg-gray-800">
            <TabsTrigger value="congelar" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              <Power className="w-4 h-4 mr-2" />
              Congelar
            </TabsTrigger>
            <TabsTrigger value="excluir" className="data-[state=active]:bg-destructive data-[state=active]:text-white">
              <Trash2 className="w-4 h-4 mr-2" />
              Excluir
            </TabsTrigger>
          </TabsList>

          {/* === PAINEL CONGELAR === */}
          <TabsContent value="congelar" className="mt-4">
            <div className="space-y-4">
              <Alert variant="default" className="bg-blue-900/30 border-blue-700">
                <AlertTriangle className="h-4 w-4 text-blue-400" />
                <AlertTitle className="text-blue-300">O que é Congelar a conta?</AlertTitle>
                <AlertDescription className="text-blue-200">
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                    <li>Seu perfil ficará **invisível** no site (buscas, listas online, etc).</li>
                    <li>Seus dados (fotos, vídeos, pimentas) serão mantidos.</li>
                    <li>Você poderá **reativar** sua conta a qualquer momento apenas fazendo login novamente.</li>
                  </ul>
                </AlertDescription>
              </Alert>
              <p className="text-gray-300 text-sm">
                Esta é a opção recomendada se você só quer dar um tempo do site.
              </p>
              <DialogFooter>
                <Button 
                  variant="secondary" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={handleFreeze}
                  disabled={isFreezeLoading}
                >
                  {isFreezeLoading ? "Congelando..." : "Sim, congelar minha conta"}
                </Button>
              </DialogFooter>
            </div>
          </TabsContent>

          {/* === PAINEL EXCLUIR === */}
          <TabsContent value="excluir" className="mt-4">
            <div className="space-y-4">
               <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Atenção! Ação Irreversível!</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                    <li>Seu perfil será **anonimizado**.</li>
                    <li>Seus dados pessoais (e-mail, nome, bio, avatar) serão **permanentemente apagados**.</li>
                    <li>Suas pimentas restantes serão perdidas.</li>
                    <li>Você **NÃO PODERÁ** recuperar esta conta.</li>
                  </ul>
                </AlertDescription>
              </Alert>
              <p className="text-gray-300 text-sm">
                Para confirmar esta ação, por favor, digite **EXCLUIR** (em maiúsculo) no campo abaixo.
              </p>
              
              <Input 
                placeholder='Digite EXCLUIR para confirmar'
                className="bg-gray-900 border-gray-700 focus:border-destructive"
                value={deleteConfirmationText}
                onChange={(e) => setDeleteConfirmationText(e.target.value)}
              />

              <DialogFooter>
                <Button 
                  variant="destructive" 
                  className="w-full"
                  onClick={handleDelete}
                  disabled={isDeleteDisabled || isDeleteLoading}
                >
                  {isDeleteLoading ? "Excluindo..." : "Eu entendo, excluir minha conta permanentemente"}
                </Button>
              </DialogFooter>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AccountSettingsModal;

