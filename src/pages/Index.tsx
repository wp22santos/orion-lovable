import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { indexedDBService } from "@/services/indexedDB";
import { Card } from "@/components/ui/card";

interface Person {
  id: string;
  dados: {
    foto: string;
    nome: string;
    dataNascimento: string;
    rg: string;
    cpf: string;
    nomeMae: string;
    nomePai: string;
    endereco?: string;
  };
  endereco: {
    rua: string;
    numero: string;
    bairro: string;
    complemento: string;
  };
}

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const { data: approaches = [], isLoading } = useQuery({
    queryKey: ["approaches"],
    queryFn: async () => {
      console.log("Buscando abordagens...");
      const data = await indexedDBService.getApproaches();
      console.log("Abordagens retornadas:", data);
      return data;
    },
    meta: {
      onError: (error: Error) => {
        toast.error("Erro ao carregar dados");
        console.error("Erro ao carregar dados:", error);
      }
    }
  });

  // Transformar abordagens em lista única de pessoas
  const people = approaches.reduce<Person[]>((acc, approach) => {
    approach.pessoas?.forEach(person => {
      const existingPerson = acc.find(p => p.id === person.id);
      
      if (!existingPerson) {
        acc.push({
          id: person.id,
          dados: person.dados,
          endereco: person.endereco
        });
      }
    });
    return acc;
  }, []);

  const filteredPeople = people.filter(person =>
    person.dados.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.dados.rg?.includes(searchTerm) ||
    person.dados.cpf?.includes(searchTerm)
  );

  const handlePersonClick = (personId: string) => {
    console.log("Navegando para pessoa:", personId);
    navigate(`/person/${personId}`);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <h1 className="text-gray-900 font-semibold text-xl">Pessoas Abordadas</h1>
            <div className="w-full sm:max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar por nome, RG ou CPF..."
                  className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 
                           text-gray-900 placeholder:text-gray-500 rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-gray-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-500"></div>
          </div>
        ) : filteredPeople.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <Users size={48} />
            </div>
            <h3 className="mt-2 text-sm font-semibold text-gray-900">Nenhuma pessoa encontrada</h3>
            <p className="mt-1 text-sm text-gray-500">Comece adicionando uma nova abordagem.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPeople.map((person) => (
              <Card
                key={person.id}
                className="p-4 hover:shadow-lg transition-all duration-300 cursor-pointer bg-white border-gray-200 hover:border-gray-300"
                onClick={() => handlePersonClick(person.id)}
              >
                <div className="flex gap-4">
                  <div className="w-16 h-16 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
                    {person.dados.foto ? (
                      <img
                        src={person.dados.foto}
                        alt={person.dados.nome}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 text-xl">
                        {person.dados.nome.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">
                      {person.dados.nome}
                    </h3>
                    <div className="mt-1 space-y-1">
                      <p className="text-sm text-gray-600 truncate">
                        Mãe: {person.dados.nomeMae}
                      </p>
                      <p className="text-sm text-gray-600">
                        RG: {person.dados.rg}
                      </p>
                      <p className="text-sm text-gray-600">
                        CPF: {person.dados.cpf}
                      </p>
                      {person.endereco && (
                        <p className="text-sm text-gray-600 truncate">
                          Endereço: {`${person.endereco.rua}, ${person.endereco.numero} - ${person.endereco.bairro}`}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <button 
        onClick={() => navigate('/nova-abordagem')}
        className="fixed right-6 bottom-6 w-14 h-14 bg-gray-800 hover:bg-gray-700 
                   rounded-full flex items-center justify-center shadow-lg 
                   transition-transform hover:scale-105 active:scale-95 text-white"
      >
        <Plus size={24} />
      </button>
    </div>
  );
};

export default Index;