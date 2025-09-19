// src/components/CreatePost.tsx

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Image as ImageIcon } from 'lucide-react'; // Ícone de imagem

const CreatePost: React.FC = () => {
  // Por enquanto, usaremos uma imagem de placeholder para o avatar do usuário
  const userAvatarUrl = 'https://avatar.iran.liara.run/public/boy';

  return (
    <div className="bg-background/50 p-4 rounded-lg flex items-start gap-4">
      {/* Avatar do Usuário */}
      <Avatar>
        <AvatarImage src={userAvatarUrl} alt="Seu avatar" />
        <AvatarFallback>VO</AvatarFallback>
      </Avatar>

      {/* Input para criar o post */}
      <div className="flex-grow">
        <Input
          placeholder="Compartilhe aqui prazer com fotos, vídeos e textos picantes!"
          className="bg-card border-border h-12 text-base"
        />
        {/* Futuramente, podemos adicionar botões de ação aqui */}
      </div>

      {/* Botão para adicionar imagem */}
      <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10">
        <ImageIcon className="w-6 h-6" />
      </Button>
    </div>
  );
};

export default CreatePost;