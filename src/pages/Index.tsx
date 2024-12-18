import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Search, Plus, Home, ChevronRight } from "lucide-react";
import { ApproachForm } from "@/components/ApproachForm";
import { useToast } from "@/hooks/use-toast";
import { indexedDBService, type Approach } from "@/services/indexedDB";
import { useQuery } from "@tanstack/react-query";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: approaches = [] } = useQuery({
    queryKey: ["approaches"],
    queryFn: indexedDBService.getApproaches,
  });

  const filteredApproaches = approaches.filter((approach) =>
    approach.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    approach.rg?.includes(searchTerm) ||
    approach.cpf?.includes(searchTerm)
  );

  const handleFormSubmit = async (data: any) => {
    try {
      await indexedDBService.addApproach(data);
      setIsFormOpen(false);
      toast({
        title: "Sucesso",
        description: "Abordagem registrada com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao salvar abordagem:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a abordagem.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#1A1F35] overflow-auto">
      {/* Cabeçalho com Busca */}
      <div className="bg-[#141829] border-b border-[#2A2F45] p-4 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <h1 className="text-[#E1E2E5] font-semibold text-lg">Registro de Abordagens</h1>
            <div className="w-full sm:max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar por nome, RG ou CPF..."
                  className="w-full pl-10 pr-4 py-2 bg-[#1A1F35] border border-[#2A2F45] 
                           text-[#E1E2E5] placeholder:text-[#5C5F70] rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-[#2A2F45]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 text-[#5C5F70]" size={16} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Abordados */}
      <div className="max-w-3xl mx-auto p-4">
        <div className="space-y-4">
          {filteredApproaches.map((approach) => (
            <Card 
              key={approach.id}
              className="bg-[#141829] border-[#2A2F45] hover:bg-[#1D2235] transition-colors cursor-pointer"
              onClick={() => navigate(`/approach/${approach.id}`)}
            >
              <div className="p-4">
                {/* Cabeçalho com Foto e Nome */}
                <div className="flex items-center gap-4 mb-3">
                  <div className="relative">
                    {approach.imageUrl ? (
                      <img 
                        src={approach.imageUrl}
                        alt={approach.name}
                        className="w-20 h-20 rounded-full object-cover bg-[#2A2F45]"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-[#2A2F45] flex items-center justify-center">
                        <span className="text-[#E1E2E5] text-xl">
                          {approach.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-[#E1E2E5] font-medium text-lg leading-tight">
                      {approach.name}
                    </h3>
                    <div className="mt-1 text-sm text-[#E1E2E5]">
                      {new Date(approach.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Dados Pessoais em Grid */}
                <div className="ml-1 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                  <div>
                    <span className="text-[#5C5F70]">RG: </span>
                    <span className="text-[#E1E2E5]">{approach.rg}</span>
                  </div>
                  <div>
                    <span className="text-[#5C5F70]">CPF: </span>
                    <span className="text-[#E1E2E5]">{approach.cpf}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[#5C5F70]">Mãe: </span>
                    <span className="text-[#E1E2E5]">{approach.motherName}</span>
                  </div>
                  <div className="col-span-2 flex items-center gap-1">
                    <Home size={14} className="text-[#5C5F70] shrink-0" />
                    <span className="text-[#E1E2E5]">{approach.address}</span>
                  </div>
                  <div className="col-span-2 flex items-center justify-between pt-2 border-t border-[#2A2F45]">
                    <div>
                      <span className="text-[#5C5F70]">Última abordagem: </span>
                      <span className="text-[#E1E2E5]">
                        {new Date(approach.date).toLocaleDateString()}
                      </span>
                    </div>
                    <ChevronRight size={20} className="text-[#5C5F70]" />
                  </div>
                </div>
              </div>
            </Card>
          ))}

          {filteredApproaches.length === 0 && (
            <div className="text-center py-8 text-[#5C5F70]">
              Nenhum registro encontrado
            </div>
          )}
        </div>
      </div>

      {/* Botão Flutuante para Nova Abordagem */}
      <button 
        className="fixed right-6 bottom-6 w-14 h-14 bg-blue-500 hover:bg-blue-600 
                   rounded-full flex items-center justify-center shadow-lg 
                   transition-transform hover:scale-105 active:scale-95"
        onClick={() => setIsFormOpen(true)}
      >
        <Plus size={24} className="text-white" />
      </button>

      <ApproachForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
};

export default Index;