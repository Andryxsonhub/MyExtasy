// src/components/registration/LocationStep.tsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import type { FormData } from './RegistrationFlow';

// Interfaces para os dados da API
interface Estado {
  id: number;
  sigla: string;
  nome: string;
}

interface Cidade {
  nome: string;
  codigo_ibge: string;
}

interface Props {
  onNext: (data: Partial<FormData>) => void;
  onBack: () => void;
}

const LocationStep: React.FC<Props> = ({ onNext, onBack }) => {
  const [estados, setEstados] = useState<Estado[]>([]);
  const [cidades, setCidades] = useState<Cidade[]>([]);
  
  const [selectedEstado, setSelectedEstado] = useState('');
  const [cityInput, setCityInput] = useState('');
  const [filteredCities, setFilteredCities] = useState<Cidade[]>([]);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  // 1. Busca todos os estados do Brasil quando o componente é montado
  useEffect(() => {
    axios.get('https://brasilapi.com.br/api/ibge/uf/v1')
      .then(response => {
        setEstados(response.data);
      })
      .catch(error => console.error("Erro ao buscar estados:", error));
  }, []);

  // 2. Busca as cidades de um estado sempre que o usuário seleciona um novo estado
  useEffect(() => {
    if (selectedEstado) {
      axios.get(`https://brasilapi.com.br/api/ibge/municipios/v1/${selectedEstado}`)
        .then(response => {
          setCidades(response.data);
          setCityInput('');
          setSelectedCity(null);
        })
        .catch(error => console.error("Erro ao buscar cidades:", error));
    }
  }, [selectedEstado]);

  // 3. Filtra as cidades conforme o usuário digita
  useEffect(() => {
    if (cityInput) {
      const filtered = cidades.filter(cidade =>
        cidade.nome.toLowerCase().startsWith(cityInput.toLowerCase())
      );
      setFilteredCities(filtered.slice(0, 5)); // Mostra no máximo 5 sugestões
    } else {
      setFilteredCities([]);
    }
  }, [cityInput, cidades]);
  
  const handleCitySelect = (cidade: Cidade) => {
    setCityInput(cidade.nome);
    setSelectedCity(cidade.nome);
    setFilteredCities([]); // Esconde a lista de sugestões
  };

  const handleNextClick = () => {
    if (selectedCity && selectedEstado) {
      const estadoObj = estados.find(e => e.sigla === selectedEstado);
      const locationString = `${selectedCity}, ${estadoObj?.nome}`;
      onNext({ location: locationString });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto text-center">
      <div className="mb-8">
        <p className="text-sm font-semibold text-gray-400 uppercase">A PREPARAR O SEU PERFIL</p>
        <h1 className="text-2xl font-bold text-white mt-1">Onde você está?</h1>
        <p className="text-gray-300 mt-2">Isso nos ajuda a encontrar pessoas perto de você.</p>
      </div>

      <div className="space-y-6">
        {/* Seleção de Estado */}
        <select
          value={selectedEstado}
          onChange={(e) => setSelectedEstado(e.target.value)}
          className="w-full px-4 py-3 bg-gray-800 text-white border-2 border-gray-600 rounded-lg focus:outline-none focus:border-pink-500"
        >
          <option value="" disabled>Selecione seu estado</option>
          {estados.map(estado => (
            <option key={estado.id} value={estado.sigla}>{estado.nome}</option>
          ))}
        </select>

        {/* Input da Cidade com Autocomplete */}
        {selectedEstado && (
          <div className="relative">
            <input
              type="text"
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              placeholder="Digite o nome da sua cidade"
              className="w-full px-4 py-3 bg-gray-800 text-white border-2 border-gray-600 rounded-lg focus:outline-none focus:border-pink-500"
              disabled={!selectedEstado}
            />
            {filteredCities.length > 0 && (
              <ul className="absolute z-10 w-full mt-1 bg-gray-800 border-2 border-gray-600 rounded-lg max-h-48 overflow-y-auto">
                {filteredCities.map(cidade => (
                  <li
                    key={cidade.codigo_ibge}
                    onClick={() => handleCitySelect(cidade)}
                    className="px-4 py-2 text-white text-left cursor-pointer hover:bg-gray-700"
                  >
                    {cidade.nome}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <button onClick={onBack} className="w-full bg-gray-700 text-white font-bold py-3 px-4 rounded-lg transition-colors hover:bg-gray-600">
          Voltar
        </button>
        <button onClick={handleNextClick} disabled={!selectedCity} className="w-full bg-pink-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 hover:bg-pink-700 disabled:bg-gray-500 disabled:cursor-not-allowed">
          Avançar
        </button>
      </div>
    </div>
  );
};

export default LocationStep;