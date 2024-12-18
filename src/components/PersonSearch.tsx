import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { indexedDBService } from "@/services/indexedDB";

interface PersonSearchProps {
  onPersonFound: (person: any) => void;
}

export const PersonSearch = ({ onPersonFound }: PersonSearchProps) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 300);

  useEffect(() => {
    const searchPerson = async () => {
      if (debouncedSearch.length < 3) return;

      try {
        const approaches = await indexedDBService.getApproaches();
        const foundPerson = approaches.find(approach => 
          approach.rg === debouncedSearch || 
          approach.cpf === debouncedSearch || 
          approach.name.toLowerCase().includes(debouncedSearch.toLowerCase())
        );

        if (foundPerson) {
          onPersonFound(foundPerson);
          toast({
            title: "Pessoa encontrada",
            description: "Dados carregados com sucesso",
          });
        }
      } catch (error) {
        console.error("Erro ao buscar pessoa:", error);
      }
    };

    searchPerson();
  }, [debouncedSearch, onPersonFound, toast]);

  return (
    <div className="relative w-full animate-fade-in">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Buscar por nome, RG ou CPF..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-[#1A1F35]/80 text-white border-[#2A2F45] backdrop-blur-sm 
                   focus:ring-2 focus:ring-purple-500 focus:border-transparent
                   transition-all duration-300"
        />
      </div>
    </div>
  );
};