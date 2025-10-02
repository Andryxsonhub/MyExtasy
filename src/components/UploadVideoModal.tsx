// src/components/UploadVideoModal.tsx (NOVO ARQUIVO)

import React, { useState, useRef, useEffect } from 'react';
import api from '../services/api';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { X, UploadCloud } from 'lucide-react';

interface UploadVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: () => void;
}

const UploadVideoModal: React.FC<UploadVideoModalProps> = ({ isOpen, onClose, onUploadSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Limpa o estado ao fechar o modal
  useEffect(() => {
    if (!isOpen) {
      setFile(null);
      setPreview(null);
      setDescription('');
      setError(null);
      setIsLoading(false);
    }
  }, [isOpen]);

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
      setError('Por favor, selecione um arquivo de vídeo.');
      return;
    }

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('video', file); // Alterado de 'photo' para 'video'
    formData.append('description', description);

    try {
      await api.post('/users/videos', formData, { // Alterado para a rota de vídeos
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Vídeo publicado com sucesso!');
      onUploadSuccess();
      onClose();
    } catch (err) {
      console.error('Erro no upload do vídeo:', err);
      setError('Não foi possível publicar o vídeo. Tente novamente.');
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
        <h2 className="text-2xl font-bold text-white mb-6">Adicionar Novo Vídeo</h2>
        <div className="mb-6">
          <Label htmlFor="video-upload" className="text-gray-300">Arquivo do Vídeo</Label>
          <div onClick={() => fileInputRef.current?.click()} className="mt-2 flex justify-center items-center w-full h-48 bg-gray-900 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-primary transition-colors relative overflow-hidden">
            {preview ? (
              <video src={preview} controls className="h-full w-full object-contain" />
            ) : (
              <div className="text-center">
                <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-400">Clique para selecionar</p>
              </div>
            )}
          </div>
          <input ref={fileInputRef} id="video-upload" name="video-upload" type="file" className="sr-only" accept="video/*" onChange={handleFileChange}/>
        </div>
        <div className="mb-6">
          <Label htmlFor="description" className="text-gray-300">Descrição</Label>
          <Textarea id="description" placeholder="Adicione uma legenda..." className="mt-2" value={description} onChange={(e) => setDescription(e.target.value)}/>
        </div>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Publicando...' : 'Publicar Vídeo'}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default UploadVideoModal;