// frontend/src/components/EditProfileModal.tsx (VERSÃO FINAL COM IMPORT CORRIGIDO)

import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { X, Camera } from 'lucide-react';

// ==========================================================
// A ÚNICA MUDANÇA É AQUI: O CAMINHO AGORA APONTA DIRETAMENTE PARA O ARQUIVO
// ==========================================================
import type { UserData } from '../types/types';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserData | null;
  onUpdateSuccess: (updatedUser: UserData) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose, currentUser, onUpdateSuccess }) => {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setBio(currentUser.bio || '');
      setLocation(currentUser.location || '');
      setImagePreview(null); 
      setImageFile(null);
    }
  }, [currentUser, isOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const profileResponse = await api.get('/users/profile');
      let updatedUserDataFromServer = profileResponse.data;

      if (imageFile) {
        const formData = new FormData();
        formData.append('avatar', imageFile);
        const imageResponse = await api.put('/users/profile/avatar', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        updatedUserDataFromServer = imageResponse.data;
      }
      
      const textData = { name, bio, location };
      const textResponse = await api.put('/users/profile', textData);
      
      const finalUserData = { ...updatedUserDataFromServer, ...textResponse.data };

      onUpdateSuccess(finalUserData);
      onClose();
      window.location.reload();

    } catch (err) {
      console.error("Erro ao atualizar perfil:", err);
      setError("Não foi possível salvar as alterações. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const profileImageUrl = currentUser?.profilePictureUrl
    ? `${import.meta.env.VITE_API_URL}${currentUser.profilePictureUrl}`
    : 'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-card border border-border rounded-lg shadow-xl w-full max-w-lg p-8 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={24} /></button>
        <h2 className="text-2xl font-bold text-white mb-6">Editar Perfil</h2>
        <div className="flex justify-center mb-6">
          <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
            <img src={imagePreview || profileImageUrl} alt="Foto de perfil" className="w-32 h-32 rounded-full object-cover border-4 border-primary"/>
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="text-white" size={32} />
            </div>
          </div>
        </div>
        <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/png, image/jpeg, image/gif"/>
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
            <Button type="submit" disabled={isLoading}>{isLoading ? 'Salvando...' : 'Salvar Alterações'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;