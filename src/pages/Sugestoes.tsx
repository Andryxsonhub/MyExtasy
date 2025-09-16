import React, { useState, FormEvent } from 'react';

const Sugestoes = () => {
  const [sugestao, setSugestao] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    
    if (sugestao.trim() === '') {
      alert('Por favor, escreva uma sugestão.');
      return;
    }

    // Simula o envio da sugestão (no futuro, você enviaria para um servidor)
    console.log('Sugestão enviada:', sugestao);
    setSuccessMessage('Obrigado! Sua sugestão foi enviada com sucesso.');
    setSugestao('');
  };

  return (
    <div className="container mx-auto px-4 py-16 pt-20">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-extrabold text-white mb-4">Caixa de Sugestões</h1>
        <p className="text-lg text-gray-400">
          Sua opinião é muito importante! Use o formulário abaixo para nos ajudar a melhorar.
        </p>
      </div>
      <div className="max-w-xl mx-auto bg-gray-800 rounded-lg shadow-lg p-8">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="sugestao" className="block text-sm font-medium text-white mb-1">
              Sua Sugestão:
            </label>
            <textarea
              id="sugestao"
              value={sugestao}
              onChange={(e) => setSugestao(e.target.value)}
              rows={6}
              required
              className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 bg-gray-700 text-white"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-pink-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-pink-700 transition-colors"
          >
            Enviar Sugestão
          </button>
          {successMessage && <p className="text-green-500 text-center mt-4">{successMessage}</p>}
        </form>
      </div>
    </div>
  );
};

export default Sugestoes;
