// Arquivo: src/components/EditProfileModal.tsx (VERSÃO FINAL COM API)

import React, { useState, useEffect } from 'react';
import axios from 'axios'; // 1. Importamos o axios

interface UserData {
  id: number; name: string; email: string; bio: string | null; profilePictureUrl: string | null; location: string | null; gender: string | null; createdAt: string; lastSeenAt: string | null;
}

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserData | null;
  onUpdateSuccess: (updatedUser: UserData) => void; // 2. Nova prop para avisar a página principal que os dados mudaram
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose, currentUser, onUpdateSuccess }) => {
  const [formData, setFormData] = useState({ name: '', location: '', bio: '' });
  
  // 3. Estados para feedback ao usuário
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && currentUser) {
      setFormData({
        name: currentUser.name || '',
        location: currentUser.location || '',
        bio: currentUser.bio || '',
      });
      setError(null); // Limpa erros anteriores ao abrir o modal
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  // 4. AQUI ESTÁ A MÁGICA: A função de salvar agora chama a API
  const handleSave = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setError("Você não está autenticado.");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const response = await axios.put(
        'http://localhost:3001/api/users/profile', 
        formData, // Envia os dados do formulário
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Se a chamada for um sucesso:
      onUpdateSuccess(response.data.user); // Avisa a página principal com os novos dados
      onClose(); // Fecha o modal

    } catch (err) {
      console.error('Erro ao salvar o perfil:', err);
      setError('Não foi possível salvar as alterações. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center">
      <div className="bg-card text-white p-8 rounded-lg shadow-xl w-full max-w-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>
        <h2 className="text-2xl font-bold mb-6">Editar Perfil</h2>

        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          <div className="space-y-6">
            {/* Campos do formulário continuam iguais */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Nome</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-2">Localização</label>
              <input type="text" id="location" name="location" value={formData.location} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-2">Sobre (Bio)</label>
              <textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} rows={4} className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
          </div>
          
          {/* Mostra mensagem de erro se houver */}
          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
          
          <div className="mt-8 flex justify-end gap-4">
            <button type="button" onClick={onClose} className="py-2 px-6 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors" disabled={isSaving}>Cancelar</button>
            <button type="submit" className="py-2 px-6 bg-purple-600 hover:bg-purple-700 rounded-md transition-colors font-semibold" disabled={isSaving}>
              {isSaving ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;