import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { indexedDBService } from "@/services/indexedDB";
import { ApproachCard } from "./ApproachCard";

interface PersonSearchProps {
  onPersonFound: (person: any) => void;
}

export const PersonSearch = ({ onPersonFound }: PersonSearchProps) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const debouncedSearch = useDebounce(searchTerm, 300);

  useEffect(() => {
    const searchPerson = async () => {
      if (!debouncedSearch || debouncedSearch.length < 2) {
        setSearchResults([]);
        return;
      }

      try {
        console.log("Buscando pessoas com termo:", debouncedSearch);
        const approaches = await indexedDBService.getApproaches();
        
        // Filtrar abordagens que contenham o termo de busca
        const foundApproaches = approaches.filter(approach => {
          const mainPersonMatch = approach.pessoas?.[0]?.dados?.nome
            ?.toLowerCase()
            .includes(debouncedSearch.toLowerCase());
            
          const rgMatch = approach.pessoas?.[0]?.dados?.rg === debouncedSearch;
          const cpfMatch = approach.pessoas?.[0]?.dados?.cpf === debouncedSearch;
          
          return mainPersonMatch || rgMatch || cpfMatch;
        });

        console.log("Abordagens encontradas:", foundApproaches);
        setSearchResults(foundApproaches);
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

  const handleCardClick = (approach: any) => {
    console.log("Selecionando pessoa da abordagem:", approach);
    const mainPerson = approach.pessoas[0];
    
    const personData = {
      id: mainPerson.id,
      name: mainPerson.dados.nome,
      motherName: mainPerson.dados.nomeMae,
      rg: mainPerson.dados.rg,
      cpf: mainPerson.dados.cpf,
      photos: mainPerson.dados.foto ? [mainPerson.dados.foto] : [],
      endereco: mainPerson.endereco || {}
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

      {searchResults.length > 0 && (
        <div className="grid gap-4 mt-4">
          {searchResults.map((approach) => (
            <div 
              key={approach.id} 
              onClick={() => handleCardClick(approach)}
              className="cursor-pointer"
            >
              <ApproachCard
                approach={{
                  id: approach.id,
                  name: approach.pessoas[0]?.dados?.nome || "Nome não informado",
                  date: approach.date,
                  location: approach.location,
                  companions: approach.companions,
                  imageUrl: approach.pessoas[0]?.dados?.foto
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};