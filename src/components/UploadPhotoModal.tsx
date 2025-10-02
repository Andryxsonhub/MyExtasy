// src/components/UploadPhotoModal.tsx (VERSÃO FINAL E LIMPA)

import React, { useState, useRef } from 'react';
import api from '../services/api';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { X, UploadCloud } from 'lucide-react';

// REMOVEMOS O 'import type { UserData }' DAQUI, POIS NÃO ERA USADO.

interface UploadPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: () => void;
}

const UploadPhotoModal: React.FC<UploadPhotoModalProps> = ({ isOpen, onClose, onUploadSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const previewUrl = URL.createObjectURL(selectedFile);
      setPreview(previewUrl);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) {
      setError('Por favor, selecione um arquivo de imagem.');
      return;
    }

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('photo', file);
    formData.append('description', description);

    try {
      await api.post('/users/photos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Foto publicada com sucesso!');
      onUploadSuccess();
      onClose();
    } catch (err) {
      console.error('Erro no upload da foto:', err);
      setError('Não foi possível publicar a foto. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <form onSubmit={handleSubmit} className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-card border border-border rounded-lg shadow-xl w-full max-w-lg p-8 relative">
        <button type="button" onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold text-white mb-6">Adicionar Nova Foto</h2>
        <div className="mb-6">
          <Label htmlFor="photo-upload" className="text-gray-300">Arquivo da Foto</Label>
          <div onClick={() => fileInputRef.current?.click()} className="mt-2 flex justify-center items-center w-full h-48 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-primary transition-colors relative overflow-hidden">
            {preview ? <img src={preview} alt="Prévia" className="h-full w-full object-contain" /> : <div className="text-center"><UploadCloud className="mx-auto h-12 w-12 text-gray-400" /><p className="mt-2 text-sm text-gray-400">Clique para selecionar</p></div>}
          </div>
          <input ref={fileInputRef} id="photo-upload" name="photo-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange}/>
        </div>
        <div className="mb-6">
          <Label htmlFor="description" className="text-gray-300">Descrição</Label>
          <Textarea id="description" placeholder="Adicione uma legenda..." className="mt-2" value={description} onChange={(e) => setDescription(e.target.value)}/>
        </div>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Publicando...' : 'Publicar Foto'}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default UploadPhotoModal;