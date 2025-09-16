// src/components/BarraCategoriasLoja.tsx

import {
  FaMale,
  FaFemale,
  FaRing,
  FaPaintBrush,
  FaShoppingBag,
} from 'react-icons/fa';
import { GiHandcuffs, GiVibratingBall, GiWhip } from 'react-icons/gi';
import { MdOutlinePestControl } from 'react-icons/md';
import { BsPlugFill } from 'react-icons/bs';

type Categoria = {
  nome: string;
  icone: React.ComponentType<{ size: number }>;
};

const categorias: Categoria[] = [
  { nome: 'Para Ele', icone: FaMale },
  { nome: 'Para Ela', icone: FaFemale },
  { nome: 'Acessórios', icone: FaRing },
  { nome: 'Brincadeiras', icone: GiHandcuffs },
  { nome: 'Cosméticos', icone: FaPaintBrush },
  { nome: 'Lingeries', icone: FaShoppingBag },
  { nome: 'Masturbadores', icone: GiVibratingBall },
  { nome: 'Pênis de Borracha', icone: MdOutlinePestControl },
  { nome: 'Para uso Anal', icone: BsPlugFill },
  { nome: 'Sadomasoquismo', icone: GiWhip },
  { nome: 'Vibradores', icone: GiVibratingBall },
];

export function BarraCategoriasLoja() {
  return (
    <div className="bg-pink-600 text-white p-4 my-8 rounded-lg shadow-lg">
      <div className="container mx-auto flex justify-around items-center overflow-x-auto">
        {categorias.map((categoria) => (
          <a
            href="#"
            key={categoria.nome}
            className="flex flex-col items-center text-center mx-3 flex-shrink-0 hover:opacity-80 transition-opacity"
          >
            <categoria.icone size={28} />
            <span className="text-xs mt-2 font-medium">{categoria.nome}</span>
          </a>
        ))}
      </div>
    </div>
  );
} // <--- A CHAVE '}' E O RESTO DO CÓDIGO ESTAVAM FALTANDO