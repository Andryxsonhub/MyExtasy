// src/components/SecureImage.tsx (VERSÃO DE DEPURAÇÃO)

import React, { useState, useEffect } from 'react';
import api from '@/services/api';
import { useAuth } from '@/contexts/AuthProvider';

interface SecureImageProps {
  src: string;
  alt: string;
  className?: string;
}

const SecureImage: React.FC<SecureImageProps> = ({ src, alt, className }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const { isLoading: isAuthLoading } = useAuth();

  useEffect(() => {
    const fetchImage = async () => {
      if (!src) return;
      try {
        const response = await api.get(src, { responseType: 'blob' });
        const localUrl = URL.createObjectURL(response.data);
        setImageUrl(localUrl);
        setError(false);
      } catch (err) {
        console.error(`Erro ao carregar imagem segura (${src}):`, err);
        setError(true);
      }
    };

    // --- NOSSO ESPIÃO ESTÁ AQUI ---
    if (!isAuthLoading) {
      console.log(`[SecureImage] Sinal verde recebido! Auth carregado. Buscando imagem em: ${src}`);
      fetchImage();
    } else {
      console.log(`[SecureImage] Aguardando sinal verde... Auth ainda está carregando para a imagem: ${src}`);
    }
    // --- FIM DO ESPIÃO ---

    return () => {
      if (imageUrl) { URL.revokeObjectURL(imageUrl); }
    };
  }, [src, isAuthLoading]);

  if (error) { return <div className={`bg-gray-700 flex items-center justify-center ${className}`}>🖼️</div>; }
  if (isAuthLoading || !imageUrl) { return <div className={`bg-gray-800 animate-pulse ${className}`}></div>; }
  return <img src={imageUrl} alt={alt} className={className} />;
};

export default SecureImage;