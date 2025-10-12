// src/components/Footer.tsx (VERSÃO CORRIGIDA)

import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    // ALTERAÇÃO AQUI: Trocamos 'bg-gray-900' por 'bg-background'
    <footer className="bg-background text-white border-t border-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold">MyExctasyClub</h3>
            <p className="text-gray-400 text-sm mt-1">
              © {new Date().getFullYear()} SuaMarca. Todos os direitos reservados.
            </p>
          </div>

          <div className="flex space-x-6 mb-4 md:mb-0">
            <Link to="/sobre" className="hover:text-pink-400 transition-colors">Sobre</Link>
            <Link to="/contato" className="hover:text-pink-400 transition-colors">Contato</Link>
            <Link to="/termos" className="hover:text-pink-400 transition-colors">Termos de Uso</Link>
          </div>

          <div className="flex space-x-4">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-gray-400 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c-4.043 0-4.51.018-6.096.09-1.58.072-2.678.348-3.633 1.303C1.637 4.343 1.36 5.44 1.288 7.02c-.072 1.586-.09 2.053-.09 6.096s.018 4.51.09 6.096c.072 1.58.348 2.678 1.303 3.633.955.955 2.053 1.23 3.633 1.303 1.586.072 2.053.09 6.096.09s4.51-.018 6.096-.09c1.58-.072 2.678-.348 3.633-1.303.955-.955 1.23-2.053 1.303-3.633.072-1.586.09-2.053.09-6.096s-.018-4.51-.09-6.096c-.072-1.58-.348-2.678-1.303-3.633C21.057 2.348 19.96 2.072 18.38 2.09 16.825 2.018 16.358 2 12.315 2zM8.35 12a3.965 3.965 0 117.93 0 3.965 3.965 0 01-7.93 0zM17.5 7.25a1.25 1.25 0 11-2.5 0 1.25 1.25 0 012.5 0z" clipRule="evenodd" /></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;