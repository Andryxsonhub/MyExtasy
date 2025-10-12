// src/components/CertificationModal.tsx

import React from 'react';
import { X, CheckCircle2, XCircle } from 'lucide-react';
import type { UserData } from '../types/types'; // Importa nosso tipo de usuário central

interface CertificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserData | null;
}

const CertificationModal: React.FC<CertificationModalProps> = ({ isOpen, onClose, user }) => {
  if (!isOpen || !user) return null;

  // Lista de itens para o checklist. A mágica acontece aqui!
  // Para cada item, definimos uma condição para ele estar "completo".
  const checklistItems = [
    { 
      label: "Foto de Perfil Adicionada",
      isComplete: !!user.profilePictureUrl,
    },
    { 
      label: "Biografia Preenchida",
      isComplete: !!user.bio && user.bio.length > 10, // Ex: bio precisa ter mais de 10 caracteres
    },
    { 
      label: "Localização Definida",
      isComplete: !!user.location,
    },
    { 
      label: "Pelo menos um Interesse adicionado",
      isComplete: !!user.interests && user.interests.length > 0,
    },
    // Podemos adicionar mais itens no futuro, como "Foto de Capa", etc.
  ];

  // Calcula a porcentagem com base nos itens completos
  const completedCount = checklistItems.filter(item => item.isComplete).length;
  const totalCount = checklistItems.length;
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg shadow-xl w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X size={24} />
        </button>
        
        <h2 className="text-2xl font-bold text-white mb-4">Complete seu Perfil</h2>
        <p className="text-gray-400 mb-6">Aumente sua visibilidade e confiança na comunidade completando os itens abaixo.</p>

        <ul className="space-y-4 mb-8">
          {checklistItems.map((item, index) => (
            <li key={index} className="flex items-center text-white">
              {item.isComplete ? (
                <CheckCircle2 className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
              )}
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
        
        <div>
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-300">Progresso</span>
                <span className="text-sm font-bold text-pink-400">{percentage}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div className="bg-pink-500 h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default CertificationModal;