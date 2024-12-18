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
    <div className="w-full animate-fade-in">
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
    </div>
  );
};