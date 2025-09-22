// frontend/src/components/EditProfileModal.tsx

import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea'; // Um componente para caixas de texto maiores
import { X } from 'lucide-react'; // Ícone para fechar

// Reutilizamos a interface UserData, mas tornamos todos os campos opcionais
// para o caso de o usuário ainda não ter carregado
interface UserData {
  id?: number;
  name?: string;
  email?: string;
  bio?: string | null;
  location?: string | null;
  profilePictureUrl?: string | null; // Adicionado para consistência
}

// Definimos as propriedades que o modal receberá
interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserData | null;
  onUpdateSuccess: (updatedUser: UserData) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose, currentUser, onUpdateSuccess }) => {
  // Estados para controlar os campos do formulário
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // useEffect para preencher o formulário quando o modal for aberto
  // com os dados atuais do usuário
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setBio(currentUser.bio || '');
      setLocation(currentUser.location || '');
    }
  }, [currentUser, isOpen]); // Roda sempre que o usuário ou o estado de abertura mudam

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const updatedData = { name, bio, location };

    try {
      // Chamada para a API para ATUALIZAR o perfil
      const response = await api.put('/users/profile', updatedData);
      
      onUpdateSuccess(response.data); // Envia os dados atualizados de volta para a página
      onClose(); // Fecha o modal

    } catch (err) {
      console.error("Erro ao atualizar perfil:", err);
      setError("Não foi possível salvar as alterações. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  // Se o modal não estiver aberto, não renderiza nada
  if (!isOpen) {
    return null;
  }

  return (
    // Fundo escuro semi-transparente que cobre a tela
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      {/* Container do Modal */}
      <div className="bg-card border border-border rounded-lg shadow-xl w-full max-w-lg p-6 relative">
        {/* Botão de Fechar */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-white mb-6">Editar Perfil</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-gray-300">Nome</Label>
            <Input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-2" />
          </div>
          <div>
            <Label htmlFor="bio" className="text-gray-300">Bio</Label>
            <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} className="mt-2" placeholder="Fale um pouco sobre você..." />
          </div>
          <div>
            <Label htmlFor="location" className="text-gray-300">Localização</Label>
            <Input id="location" type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="mt-2" placeholder="Cidade, Estado" />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;

