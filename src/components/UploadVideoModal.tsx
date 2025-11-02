// src/components/UploadVideoModal.tsx (VERSÃO FINAL COM THUMBNAIL)

import React, { useState, useRef, useEffect } from 'react';
import api from '../services/api';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { X, UploadCloud, Loader2 } from 'lucide-react'; // Importa Loader2

interface UploadVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: () => void;
}

const UploadVideoModal: React.FC<UploadVideoModalProps> = ({ isOpen, onClose, onUploadSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  
  // --- ★★★ ALTERAÇÃO (1/7): 'preview' agora é uma IMAGEM (data URL) ---
  const [preview, setPreview] = useState<string | null>(null);
  
  // --- ★★★ NOVO ESTADO (2/7): Guarda o ARQUIVO da thumbnail ---
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [isGeneratingThumb, setIsGeneratingThumb] = useState(false); // Feedback

  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Limpa o estado ao fechar o modal
  useEffect(() => {
    if (!isOpen) {
      setFile(null);
      setPreview(null);
      setThumbnailFile(null); // <-- Limpa o arquivo da thumbnail
      setDescription('');
      setError(null);
      setIsLoading(false);
      setIsGeneratingThumb(false); // <-- Limpa o loading da thumb
    }
  }, [isOpen]);

  // --- ★★★ ATUALIZAÇÃO (3/7): Lógica para gerar a thumbnail ---
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(null); // Limpa a prévia antiga
      setThumbnailFile(null); // Limpa o arquivo antigo
      setIsGeneratingThumb(true); // Ativa o loading
      setError(null);

      // 1. Cria elementos de vídeo e canvas em memória
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const previewUrl = URL.createObjectURL(selectedFile);
      
      video.src = previewUrl;
      video.muted = true;

      // 2. Quando o vídeo carregar, busca o 1º segundo
      video.onloadedmetadata = () => {
        video.currentTime = 1; // Pula para 1 segundo
      };

      // 3. Quando o "pulo" (seek) terminar, desenha no canvas
      video.onseeked = () => {
        // Define o tamanho do canvas
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Desenha o frame do vídeo no canvas
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          // 4. Mostra a IMAGEM da thumbnail para o usuário
          setPreview(canvas.toDataURL('image/jpeg', 0.8)); // 80% qualidade
          
          // 5. Converte o canvas para um Arquivo (Blob) para o upload
          canvas.toBlob((blob) => {
            if (blob) {
              const thumbFile = new File([blob], 'thumbnail.jpg', { type: 'image/jpeg' });
              setThumbnailFile(thumbFile); // <-- Salva o ARQUIVO da thumbnail
            }
            URL.revokeObjectURL(previewUrl); // Limpa a memória
            setIsGeneratingThumb(false); // Desativa o loading
          }, 'image/jpeg', 0.8);
        }
      };

      video.onerror = () => {
        setError("Não foi possível ler o arquivo de vídeo.");
        setIsGeneratingThumb(false);
        URL.revokeObjectURL(previewUrl);
      };

      video.load(); // Inicia o processo
    }
  };

  // --- ★★★ ATUALIZAÇÃO (4/7): Envia a thumbnail junto com o vídeo ---
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) {
      setError('Por favor, selecione um arquivo de vídeo.');
      return;
    }
    
    // --- ★★★ NOVO (5/7): Verifica se a thumbnail já foi gerada ---
    if (!thumbnailFile) {
        setError('Aguarde a geração da miniatura do vídeo...');
        return;
    }

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('video', file); 
    formData.append('description', description);
    // --- ★★★ ATUALIZAÇÃO (6/7): Anexa o arquivo da thumbnail ---
    formData.append('thumbnail', thumbnailFile); 

    try {
      // A rota '/users/videos' já está pronta no backend para receber os dois arquivos
      await api.post('/users/videos', formData, { 
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
            
            {/* --- ★★★ ATUALIZAÇÃO (7/7): Mostra a IMAGEM (thumbnail) --- */}
            {preview && !isGeneratingThumb && (
              <img src={preview} alt="Prévia da thumbnail" className="h-full w-full object-contain" />
            )}
            
            {/* Mostra o loading da thumbnail */}
            {isGeneratingThumb && (
              <div className="text-center text-gray-400">
                <Loader2 className="mx-auto h-12 w-12 text-primary animate-spin" />
                <p className="mt-2 text-sm">Gerando miniatura...</p>
              </div>
            )}

            {/* Mostra o placeholder inicial */}
            {!preview && !isGeneratingThumb && (
              <div className="text-center">
                <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-400">Clique para selecionar</p>
              </div>
            )}
            {/* --- FIM DA ATUALIZAÇÃO --- */}

          </div>
          <input ref={fileInputRef} id="video-upload" name="video-upload" type="file" className="sr-only" accept="video/*" onChange={handleFileChange}/>
        </div>
        <div className="mb-6">
          <Label htmlFor="description" className="text-gray-300">Descrição</Label>
          <Textarea id="description" placeholder="Adicione uma legenda..." className="mt-2" value={description} onChange={(e) => setDescription(e.target.value)}/>
        </div>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isLoading || isGeneratingThumb}>
            {isLoading ? 'Publicando...' : isGeneratingThumb ? 'Processando...' : 'Publicar Vídeo'}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default UploadVideoModal;
