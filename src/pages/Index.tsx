import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Search, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { indexedDBService } from "@/services/indexedDB";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { ApproachList } from "@/components/ApproachList";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const { data: approaches = [], isLoading } = useQuery({
    queryKey: ["approaches"],
    queryFn: indexedDBService.getApproaches,
    meta: {
      onError: (error: Error) => {
        toast.error("Erro ao carregar abordagens");
        console.error("Erro ao carregar abordagens:", error);
      }
    }
  });

  const filteredApproaches = approaches.filter((approach) =>
    approach.pessoas?.some(
      (pessoa) =>
        pessoa.dados.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pessoa.dados.rg?.includes(searchTerm) ||
        pessoa.dados.cpf?.includes(searchTerm)
    )
  );

  const handleApproachClick = (id: string) => {
    navigate(`/approach/${id}`);
  };

  const mappedApproaches = filteredApproaches.map((approach) => ({
    id: approach.id,
    name: approach.pessoas[0]?.dados.nome || "Sem nome",
    date: new Date(approach.date).toLocaleDateString(),
    location: approach.location,
    imageUrl: approach.pessoas[0]?.dados.foto,
    companions: approach.pessoas.slice(1).map(p => p.dados.nome),
    // Adding required properties to match Approach type
    motherName: approach.pessoas[0]?.dados.nomeMae || "",
    rg: approach.pessoas[0]?.dados.rg || "",
    cpf: approach.pessoas[0]?.dados.cpf || "",
    address: approach.endereco?.rua || "",
    data: approach.data || "",
    endereco: approach.endereco,
    pessoas: approach.pessoas
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <h1 className="text-gray-900 font-semibold text-xl">Registro de Abordagens</h1>
            <div className="w-full sm:max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar por nome, RG ou CPF..."
                  className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 
                           text-gray-900 placeholder:text-gray-500 rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <ApproachList 
            approaches={mappedApproaches}
            onApproachClick={handleApproachClick}
          />
        )}
      </div>

      <button 
        onClick={() => navigate('/nova-abordagem')}
        className="fixed right-6 bottom-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 
                   rounded-full flex items-center justify-center shadow-lg 
                   transition-transform hover:scale-105 active:scale-95 text-white"
      >
        <Plus size={24} />
      </button>
    </div>
  );
};

export default Index;