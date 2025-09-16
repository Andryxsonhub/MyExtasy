// src/pages/Loja.tsx

import ProductCard from '../components/ProductCard'; 
import { BarraCategoriasLoja } from '../components/BarraCategoriasLoja'; // NOME CORRIGIDO AQUI

const produtos = [
  {
    name: 'Produto Exemplo 1',
    description: 'Descrição breve e atraente do produto 1.',
    price: 99.90,
    imageUrl: 'https://via.placeholder.com/300',
  },
  {
    name: 'Produto Exemplo 2',
    description: 'Descrição breve e atraente do produto 2.',
    price: 129.90,
    imageUrl: 'https://via.placeholder.com/300',
  },
  {
    name: 'Produto Exemplo 3',
    description: 'Descrição breve e atraente do produto 3.',
    price: 79.90,
    imageUrl: 'https://via.placeholder.com/300',
  },
   {
    name: 'Produto Exemplo 4',
    description: 'Descrição breve e atraente do produto 4.',
    price: 199.90,
    imageUrl: 'https://via.placeholder.com/300',
  },
];

export function Loja() {
  return (
    <div className="bg-gray-900 min-h-screen pt-24 text-white">
      <div className="container mx-auto px-4">
        
        <div className="text-center mb-4">
          <h1 className="text-4xl font-extrabold">Nossa Loja</h1>
          <p className="text-lg text-gray-400 mt-2">
            Explore nossa seleção de produtos incríveis.
          </p>
        </div>

        <BarraCategoriasLoja />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {produtos.map((produto) => (
            <ProductCard
              key={produto.name}
              name={produto.name}
              description={produto.description}
              price={produto.price}
              imageUrl={produto.imageUrl}
            />
          ))}
        </div>
      </div>
    </div>
  );
}