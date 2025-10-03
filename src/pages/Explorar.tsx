// src/pages/Explorar.tsx (VERSÃO FINAL E COMPLETA)

import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Button } from '@/components/ui/button';
import { UserData } from '@/types/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Loader2, Search, MapPin } from 'lucide-react';

// --- OPÇÕES PARA OS FILTROS ---
const genderOptions = [ 'Homem', 'Mulher', 'Casal (Ele/Ela)', 'Casal (Ela/Ela)', 'Casal (Ele/Ele)', 'Transexual', 'Crossdresser (CD)', 'Travesti' ];

const filterOptions = {
  interests: [ 'Ménage Masculino sem bi', 'Ménage Masculino com bi', 'Sexo Casual', 'Sexo a dois', 'Sexo a Três', 'Sexo em grupo', 'Ménage feminino sem bi', 'Ménage feminino com bi', 'Toca de Casal', 'Sexo no mesmo ambiente', 'Exibicionismo' ],
  fetishes: [ 'Sexo anal', 'Dotado', 'Cuckold', 'Voyerismo', 'Orgia', 'Gang Bang', 'Sexting', 'Podolatria', 'Inversão', 'Dogging', 'Dupla penetração', 'Fisting', 'Sexo virtual', 'Dominação', 'Submissão', 'Bondage', 'Sadismo', 'Masoquismo', 'BBW', 'Pregnofilia', 'Bukkake', 'Beijo grego', 'Golden shower' ]
};

// --- COMPONENTES ---
const UserCard: React.FC<{ user: Partial<UserData> }> = ({ user }) => (
  <Link to={`/profile/${user.id}`} className="block bg-card rounded-lg overflow-hidden shadow-lg hover:shadow-primary/50 transition-shadow duration-300">
    <div className="relative">
      <Avatar className="w-full h-48 rounded-none">
        <AvatarImage src={user.profilePictureUrl || undefined} alt={user.name} className="object-cover" />
        <AvatarFallback className="text-3xl rounded-none">{user.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
      <div className="absolute bottom-2 left-3 text-white">
        <h3 className="font-bold truncate">{user.name}</h3>
        <p className="text-xs text-gray-300 truncate">{user.location || 'Local não informado'}</p>
      </div>
    </div>
  </Link>
);

const Explorar: React.FC = () => {
  // --- ESTADOS DOS FILTROS ---
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
  const [ageRange, setAgeRange] = useState<[number, number]>([18, 100]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedFetishes, setSelectedFetishes] = useState<string[]>([]);
  
  // --- ESTADOS DA BUSCA ---
  const [searchResults, setSearchResults] = useState<Partial<UserData>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [initialLoadDone, setInitialLoadDone] = useState(false);


  const handleToggle = (item: string, list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>) => {
    setList(prevList => prevList.includes(item) ? prevList.filter(i => i !== item) : [...prevList, item]);
  };
  
  const handleSearch = async () => {
    setIsLoading(true);
    const params: Record<string, string> = {
        minAge: ageRange[0].toString(),
        maxAge: ageRange[1].toString(),
    };
    if (searchQuery) params.q = searchQuery;
    if (location) params.location = location;
    if (selectedGenders.length > 0) params.gender = selectedGenders.join(',');
    if (selectedInterests.length > 0) params.interests = selectedInterests.join(',');
    if (selectedFetishes.length > 0) params.fetishes = selectedFetishes.join(',');
    try {
      const response = await api.get('/users/search', { params });
      setSearchResults(response.data);
    } catch (error) {
      console.error("Erro ao buscar perfis:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
      if (!initialLoadDone) setInitialLoadDone(true);
    }
  };

  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        <aside className="md:col-span-1 bg-card p-6 rounded-lg self-start sticky top-20">
          <h2 className="text-2xl font-bold text-white mb-6">Filtros</h2>
          
          <div className="space-y-6">
            {/* Busca por Texto */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input placeholder="Buscar por perfis..." className="pl-10" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            </div>

            {/* Busca por Localização */}
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input placeholder="Digite sua localização..." className="pl-10" value={location} onChange={e => setLocation(e.target.value)} />
            </div>

            {/* Filtro por Gênero */}
            <div>
              <h3 className="text-lg font-semibold text-primary mb-3">Em Busca De</h3>
              <div className="flex flex-wrap gap-2">
                {genderOptions.map(gender => ( <Button key={gender} variant={selectedGenders.includes(gender) ? 'default' : 'secondary'} size="sm" onClick={() => handleToggle(gender, selectedGenders, setSelectedGenders)} > {gender} </Button> ))}
              </div>
            </div>

             {/* Filtro por Idade */}
            <div>
              <h3 className="text-lg font-semibold text-primary mb-3">Com Idades Entre</h3>
              <Slider defaultValue={[18, 100]} max={100} min={18} step={1} value={ageRange} onValueChange={(value: [number, number]) => setAgeRange(value)} />
              <div className="flex justify-between text-sm text-white mt-2">
                <span>{ageRange[0]} anos</span>
                <span>{ageRange[1]} anos</span>
              </div>
            </div>

            {/* --- CÓDIGO RESTAURADO ABAIXO --- */}
            {/* Filtros de Interesses */}
            <div>
              <h3 className="text-lg font-semibold text-primary mb-3">Com Interesses Em</h3>
              <div className="flex flex-wrap gap-2">
                {filterOptions.interests.map(interest => ( <Button key={interest} variant={selectedInterests.includes(interest) ? 'default' : 'secondary'} size="sm" onClick={() => handleToggle(interest, selectedInterests, setSelectedInterests)} className="rounded-full" > {interest} </Button> ))}
              </div>
            </div>

            {/* Filtros de Fetiches */}
            <div>
              <h3 className="text-lg font-semibold text-primary mb-3">Com Fetiches Em</h3>
               <div className="flex flex-wrap gap-2">
                {filterOptions.fetishes.map(fetish => ( <Button key={fetish} variant={selectedFetishes.includes(fetish) ? 'default' : 'secondary'} size="sm" onClick={() => handleToggle(fetish, selectedFetishes, setSelectedFetishes)} className="rounded-full" > {fetish} </Button> ))}
              </div>
            </div>
          </div>

          <Button onClick={handleSearch} disabled={isLoading} className="w-full mt-8">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Aplicar Filtros
          </Button>
        </aside>

        <main className="md:col-span-3">
          <h2 className="text-2xl font-bold text-white mb-6">Resultados da Busca</h2>
          {isLoading ? (
            <div className="text-center py-16"><Loader2 className="mx-auto h-12 w-12 text-primary animate-spin" /><p className="mt-4 text-white">Buscando perfis...</p></div>
          ) : searchResults.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.map(user => <UserCard key={user.id} user={user} />)}
            </div>
          ) : initialLoadDone ? (
            <div className="text-center text-gray-400 py-16 bg-card rounded-lg">
                <p>Nenhum perfil encontrado.</p>
                <p className="text-sm">Tente selecionar menos filtros para uma busca mais ampla.</p>
            </div>
          ) : null }
        </main>
      </div>
    </div>
  );
};

export default Explorar;