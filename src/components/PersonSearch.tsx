import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { indexedDBService } from "@/services/indexedDB";

interface PersonSearchProps {
  onPersonFound: (person: any) => void;
}

interface UniquePerson {
  id: string;
  nome: string;
  rg: string;
  cpf: string;
  nomeMae: string;
  profilePhoto?: string;
  endereco: {
    rua: string;
    numero: string;
    bairro: string;
    complemento: string;
  };
  lastApproachDate: string;
  dados: {
    foto: string;
    nome: string;
    dataNascimento: string;
    rg: string;
    cpf: string;
    nomeMae: string;
    nomePai: string;
    endereco?: string;
    profilePhoto?: string;
  };
}

export const PersonSearch = ({ onPersonFound }: PersonSearchProps) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [uniquePeople, setUniquePeople] = useState<UniquePerson[]>([]);
  const debouncedSearch = useDebounce(searchTerm, 300);

  useEffect(() => {
    const searchPerson = async () => {
      if (!debouncedSearch || debouncedSearch.length < 2) {
        setUniquePeople([]);
        return;
      }

      try {
        const approaches = await indexedDBService.getApproaches();
        const peopleMap = new Map<string, UniquePerson>();
        
        approaches.forEach(approach => {
          approach.pessoas?.forEach(person => {
            const personKey = person.dados.nome.toLowerCase();
            const existingPerson = peopleMap.get(personKey);
            
            if (!existingPerson || new Date(approach.date) > new Date(existingPerson.lastApproachDate)) {
              peopleMap.set(personKey, {
                id: person.id,
                nome: person.dados.nome,
                rg: person.dados.rg,
                cpf: person.dados.cpf,
                nomeMae: person.dados.nomeMae,
                profilePhoto: person.dados.profilePhoto,
                endereco: person.endereco,
                lastApproachDate: approach.date,
                dados: person.dados
              });
            }
          });
        });
        
        const filteredPeople = Array.from(peopleMap.values()).filter(person => {
          const searchLower = debouncedSearch.toLowerCase();
          return (
            person.nome.toLowerCase().includes(searchLower) ||
            person.rg === debouncedSearch ||
            person.cpf === debouncedSearch
          );
        });

        setUniquePeople(filteredPeople);
      } catch (error) {
        console.error("Erro ao buscar pessoa:", error);
        toast({
          title: "Erro na busca",
          description: "Não foi possível realizar a busca.",
          variant: "destructive",
        });
      }
    };

    searchPerson();
  }, [debouncedSearch, toast]);

  const handlePersonSelect = (person: UniquePerson) => {
    const personData = {
      id: person.id,
      name: person.nome,
      motherName: person.nomeMae,
      rg: person.rg,
      cpf: person.cpf,
      photos: [], // Não trazemos fotos anteriores
      endereco: person.endereco,
      profilePhoto: person.profilePhoto
    };

    onPersonFound(personData);
    toast({
      title: "Pessoa encontrada",
      description: "Dados carregados com sucesso",
    });
  };

  return (
    <div className="w-full space-y-4 animate-fade-in">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Buscar por nome, RG ou CPF..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-12 bg-white/80 text-gray-900 border-gray-200 
                   focus:ring-2 focus:ring-purple-500 focus:border-transparent
                   h-14 text-lg rounded-xl shadow-sm"
        />
      </div>

      {uniquePeople.length > 0 && (
        <div className="grid gap-4 mt-4">
          {uniquePeople.map((person) => (
            <div
              key={person.id}
              onClick={() => handlePersonSelect(person)}
              className="cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-md 
                       transition-all duration-200 p-4 border border-gray-200"
            >
              <div className="flex items-center gap-4">
                {person.profilePhoto ? (
                  <img
                    src={person.profilePhoto}
                    alt={person.nome}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 text-lg">{person.nome.charAt(0)}</span>
                  </div>
                )}
                <div>
                  <h3 className="font-medium text-gray-900">{person.nome}</h3>
                  <p className="text-sm text-gray-500">RG: {person.rg}</p>
                  <p className="text-sm text-gray-500">CPF: {person.cpf}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};