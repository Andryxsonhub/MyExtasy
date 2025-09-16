import React from 'react';

// Definindo os tipos das propriedades que o componente vai receber
interface ProductCardProps {
  name: string;
  price: number;
  imageUrl: string;
  description: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ name, price, imageUrl, description }) => {
  return (
    <div className="border border-gray-200 rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
      {/* Imagem do Produto */}
      <div className="w-full h-56 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={`Imagem de ${name}`} 
          className="w-full h-full object-cover" 
        />
      </div>

      {/* Conteúdo do Card */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">{name}</h3>
        <p className="text-gray-600 text-sm mb-4 flex-grow">{description}</p>
        
        <div className="mt-auto flex justify-between items-center">
          <p className="text-2xl font-semibold text-black">
            R$ {price.toFixed(2).replace('.', ',')}
          </p>
          <button className="bg-black text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 hover:bg-gray-800">
            Comprar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;