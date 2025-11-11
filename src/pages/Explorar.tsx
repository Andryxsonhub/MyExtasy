// src/pages/Explorar.tsx
// --- ★★★ CORREÇÃO 11/11: Corrigido bug de "perda de foco" no input (ts(2552)) ★★★ ---

import React, { useState, useEffect } from 'react';
import api from '@/services/api';
import { Button } from '@/components/ui/button';
import { UserData } from '@/types/types'; 
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Loader2, Search, MapPin, Filter } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AxiosError } from 'axios';

// ★★★ MOVEMOS AS CONSTANTES PARA FORA ★★★
// (Para que não sejam recriadas em cada render)
const genderOptions = [ 'Masculino', 'Feminino', 'Casal (Ele/Ela)', 'Casal (Ela/Ela)', 'Casal (Ele/Ele)', 'Transexual', 'Crossdresser (CD)', 'Travesti' ];
const filterOptions = {
  interests: [ 'Ménage Masculino sem bi', 'Ménage Masculino com bi', 'Sexo Casual', 'Sexo a dois', 'Sexo a Três', 'Sexo em grupo', 'Ménage feminino sem bi', 'Ménage feminino com bi', 'Toca de Casal', 'Sexo no mesmo ambiente', 'Exibicionismo' ],
  fetishes: [ 'Sexo anal', 'Dotado', 'Cuckold', 'Voyerismo', 'Orgia', 'Gang Bang', 'Sexting', 'Podolatria', 'Inversão', 'Dogging', 'Dupla penetração', 'Fisting', 'Sexo virtual', 'Dominação', 'Submissão', 'Bondage', 'Sadismo', 'Masoquismo', 'BBW', 'Pregnofilia', 'Bukkake', 'Beijo grego', 'Golden shower' ]
};
const ageOptions = Array.from({ length: (70 - 18) + 1 }, (_, i) => 18 + i);


// --- COMPONENTES ---
const UserCard: React.FC<{ user: Partial<UserData> }> = ({ user }) => (
  // ... (Componente UserCard sem alteração) ...
  <Link to={`/profile/${user.id}`} className="block bg-card rounded-lg overflow-hidden shadow-lg hover:shadow-primary/50 transition-shadow duration-300">
    <div className="relative">
      <Avatar className="w-full h-48 rounded-none">
        <AvatarImage src={user.profilePictureUrl || undefined} alt={user.name || 'Usuário'} className="object-cover" />
        <AvatarFallback className="text-3xl rounded-none">{user.name?.substring(0, 2).toUpperCase() || '??'}</AvatarFallback>
      </Avatar>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
      <div className="absolute bottom-2 left-3 text-white">
        <h3 className="font-bold truncate">{user.name || 'Nome não informado'}</h3>
        <p className="text-xs text-gray-300 truncate">{user.location || 'Local não informado'}</p>
      </div>
    </div>
  </Link>
);

// ★★★ 1. DEFINIMOS OS 'PROPS' QUE O PAINEL VAI PRECISAR ★★★
interface FilterPanelProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  location: string;
  setLocation: (value: string) => void;
  selectedGenders: string[];
  setSelectedGenders: React.Dispatch<React.SetStateAction<string[]>>;
  ageRange: [number, number];
  setAgeRange: (value: [number, number]) => void;
  selectedInterests: string[];
  setSelectedInterests: React.Dispatch<React.SetStateAction<string[]>>;
  selectedFetishes: string[];
  setSelectedFetishes: React.Dispatch<React.SetStateAction<string[]>>;
  handleToggle: (item: string, setList: React.Dispatch<React.SetStateAction<string[]>>) => void;
}

// ★★★ 2. MOVEMOS O 'FilterPanel' PARA FORA DO COMPONENTE 'Explorar' ★★★
// Agora ele é um componente independente e não será recriado a cada letra digitada.
const FilterPanel: React.FC<FilterPanelProps> = ({
  searchQuery, setSearchQuery,
  location, setLocation,
  selectedGenders, setSelectedGenders,
  ageRange, setAgeRange,
  selectedInterests, setSelectedInterests,
  selectedFetishes, setSelectedFetishes,
  handleToggle
}) => (
    <div className="space-y-6">
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input placeholder="Buscar por perfis..." className="pl-10" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
        <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            {/* Este input agora vai manter o foco! */}
            <Input placeholder="Digite sua localização..." className="pl-10" value={location} onChange={e => setLocation(e.target.value)} />
        </div>
        <div>
            <h3 className="text-lg font-semibold text-primary mb-3">Em Busca De</h3>
            <div className="flex flex-wrap gap-2">
                {genderOptions.map(gender => ( <Button key={gender} variant={selectedGenders.includes(gender) ? 'default' : 'secondary'} size="sm" onClick={() => handleToggle(gender, setSelectedGenders)} > {gender} </Button> ))}
            </div>
       </div>
       <div>
         <h3 className="text-lg font-semibold text-primary mb-3">Com Idades Entre</h3>
         <div className="flex items-center gap-4">
             <div className="flex-1">
                 <label htmlFor="minAge" className="text-sm font-medium text-gray-400 mb-1 block">De</label>
                 <Select
                     value={String(ageRange[0])}
                     onValueChange={(value) => {
                         const newMinAge = Number(value);
                         if (newMinAge <= ageRange[1]) {
                             setAgeRange([newMinAge, ageRange[1]]);
                         }
                     }}
                 >
                     <SelectTrigger id="minAge">
                         <SelectValue placeholder="Idade Mín." />
                     </SelectTrigger>
                     <SelectContent>
                         {ageOptions.map(age => (
                             <SelectItem key={`min-${age}`} value={String(age)} disabled={age > ageRange[1]}>
                                 {age}
                             </SelectItem>
                         ))}
                     </SelectContent>
                 </Select>
             </div>
             <div className="flex-1">
                 <label htmlFor="maxAge" className="text-sm font-medium text-gray-400 mb-1 block">Até</label>
                 <Select
                     value={String(ageRange[1])}
                     onValueChange={(value) => {
                         const newMaxAge = Number(value);
                         if (newMaxAge >= ageRange[0]) {
                             setAgeRange([ageRange[0], newMaxAge]);
                         }
                     }}
                 >
                     <SelectTrigger id="maxAge">
                         <SelectValue placeholder="Idade Máx." />
                     </SelectTrigger>
                     <SelectContent>
                         {ageOptions.map(age => (
                             <SelectItem key={`max-${age}`} value={String(age)} disabled={age < ageRange[0]}>
                                 {age === 70 ? '70+' : age}
                             </SelectItem>
                         ))}
                     </SelectContent>
                 </Select>
             </div>
           </div>
         </div>
       <div>
         <h3 className="text-lg font-semibold text-primary mb-3">Com Interesses Em</h3>
         <div className="flex flex-wrap gap-2">
             {filterOptions.interests.map(interest => ( <Button key={interest} variant={selectedInterests.includes(interest) ? 'default' : 'secondary'} size="sm" onClick={() => handleToggle(interest, setSelectedInterests)} className="rounded-full" > {interest} </Button> ))}
         </div>
       </div>
       <div>
         <h3 className="text-lg font-semibold text-primary mb-3">Com Fetiches Em</h3>
         <div className="flex flex-wrap gap-2">
             {filterOptions.fetishes.map(fetish => ( <Button key={fetish} variant={selectedFetishes.includes(fetish) ? 'default' : 'secondary'} size="sm" onClick={() => handleToggle(fetish, setSelectedFetishes)} className="rounded-full" > {fetish} </Button> ))}
           </div>
         </div>
   </div>
);


const Explorar: React.FC = () => {
  // --- ESTADOS DOS FILTROS ---
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
  const [ageRange, setAgeRange] = useState<[number, number]>([18, 70]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedFetishes, setSelectedFetishes] = useState<string[]>([]);
  
  // --- ESTADOS DA BUSCA E UI ---
  const [searchResults, setSearchResults] = useState<Partial<UserData>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleToggle = (item: string, setList: React.Dispatch<React.SetStateAction<string[]>>) => {
    setList(prevList => prevList.includes(item) ? prevList.filter(i => i !== item) : [...prevList, item]);
  };
  
  // =======================================================
  // FUNÇÃO DE BUSCA (OK)
  // =======================================================
  const handleSearch = async () => {
    setIsSheetOpen(false);
    setIsLoading(true);

    const filters = {
      searchTerm: searchQuery,
      location: location,
      genders: selectedGenders,
      minAge: ageRange[0],
      maxAge: ageRange[1] === 70 ? 100 : ageRange[1], 
      interests: [...selectedInterests, ...selectedFetishes] 
    };

    try {
      const response = await api.post('/users/search/advanced', filters);
      setSearchResults(response.data);
    } catch (error) {
      console.error("Erro ao buscar perfis:", error);
      if (error instanceof AxiosError && error.response) {
        console.error("Detalhes do erro da API:", error.response.data);
      }
      setSearchResults([]);
    } finally {
      setIsLoading(false);
      if (!initialLoadDone) setInitialLoadDone(true);
    }
  };

  // =======================================================
  // BUSCA INICIAL (OK)
  // =======================================================
  useEffect(() => {
    const initialSearch = async () => {
      setIsLoading(true); 
      try {
        const response = await api.post('/users/search/advanced', {
          searchTerm: '',
          location: '',
          genders: [],
          minAge: 18,
          maxAge: 100,
          interests: []
        });
        setSearchResults(response.data);
      } catch (error) {
        console.error("Erro ao buscar perfis iniciais:", error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
        setInitialLoadDone(true);
      }
    };

    initialSearch();
  }, []); 

  // ★★★ 3. Criamos um objeto com todos os 'props' para o FilterPanel ★★★
  const filterPanelProps = {
    searchQuery, setSearchQuery,
    location, setLocation,
    selectedGenders, setSelectedGenders,
    ageRange, setAgeRange,
    selectedInterests, setSelectedInterests,
    selectedFetishes, setSelectedFetishes,
    handleToggle
  };

  return (
    <div className="container mx-auto px-4 py-8 pt-24 min-h-screen">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Sidebar de Filtros (Desktop) */}
        <aside className="hidden md:block md:col-span-1 self-start sticky top-24">
          <div className="bg-card p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-white mb-6">Filtros</h2>
            {/* ★★★ 4. Passamos os props para o FilterPanel ★★★ */}
            <FilterPanel {...filterPanelProps} />
            <Button onClick={handleSearch} disabled={isLoading} className="w-full mt-8">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Aplicar Filtros
            </Button>
          </div>
        </aside>

        {/* Conteúdo Principal (Resultados) */}
          <main className="md:col-span-3">
            {/* Botão de Filtros (Mobile) */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Resultados da Busca</h2>
              <div className="md:hidden">
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Filter size={16} />
                      Filtros
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-4/5 overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle>Filtros</SheetTitle>
                      <SheetDescription>Refine sua busca para encontrar perfis.</SheetDescription>
                    </SheetHeader>
                    <div className="py-4">
                      {/* ★★★ 5. Passamos os mesmos props para o FilterPanel do mobile ★★★ */}
                      <FilterPanel {...filterPanelProps} />
                    </div>
                    <SheetFooter>
                      <Button onClick={handleSearch} disabled={isLoading} className="w-full">
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Ver Resultados
                      </Button>
                    </SheetFooter>
                  </SheetContent>
                </Sheet>
              </div>
            </div>

            {/* Grid de Resultados */}
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