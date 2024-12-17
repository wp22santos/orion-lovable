import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SearchBar } from "@/components/SearchBar";
import { ApproachCard } from "@/components/ApproachCard";
import { ApproachForm } from "@/components/ApproachForm";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { indexedDBService, type Approach } from "@/services/indexedDB";
import { v4 as uuidv4 } from "uuid";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [approaches, setApproaches] = useState<Approach[]>([]);
  const [filteredApproaches, setFilteredApproaches] = useState<Approach[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const loadApproaches = async () => {
      try {
        const data = await indexedDBService.getApproaches();
        setApproaches(data);
        setFilteredApproaches(data);
      } catch (error) {
        console.error("Error loading approaches:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar as abordagens.",
          variant: "destructive",
        });
      }
    };

    loadApproaches();
  }, [toast]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = approaches.filter((approach) => {
      const searchStr = `${approach.name} ${approach.location} ${approach.companions?.join(" ")}`.toLowerCase();
      return searchStr.includes(query.toLowerCase());
    });
    setFilteredApproaches(filtered);
  };

  const handleApproachClick = (id: string) => {
    navigate(`/approach/${id}`);
  };

  const handleNewApproach = () => {
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data: any) => {
    const newApproach: Approach = {
      id: uuidv4(),
      name: data.name,
      motherName: data.motherName,
      rg: data.rg,
      cpf: data.cpf,
      address: data.address,
      observations: data.observations,
      companions: data.companions ? data.companions.split(",").map((c: string) => c.trim()) : [],
      date: new Date().toLocaleString(),
      location: data.address,
    };

    try {
      await indexedDBService.addApproach(newApproach);
      const updatedApproaches = await indexedDBService.getApproaches();
      setApproaches(updatedApproaches);
      setFilteredApproaches(updatedApproaches);
      toast({
        title: "Sucesso",
        description: "Abordagem registrada com sucesso.",
      });
    } catch (error) {
      console.error("Error saving approach:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a abordagem.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-police-primary text-white sticky top-0 z-10 shadow-md">
        <div className="container py-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <h1 className="text-2xl font-bold">Sistema de Registro Policial</h1>
            <Button
              onClick={handleNewApproach}
              className="bg-police-accent hover:bg-police-secondary transition-colors w-full md:w-auto"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nova Abordagem
            </Button>
          </div>
          <div className="mt-6">
            <SearchBar
              onSearch={handleSearch}
              placeholder="Buscar por nome, RG, CPF ou local..."
            />
          </div>
        </div>
      </header>

      <main className="container py-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            {searchQuery
              ? `Resultados da busca: ${filteredApproaches.length} encontrados`
              : "Últimas Abordagens"}
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredApproaches.map((approach) => (
            <ApproachCard
              key={approach.id}
              approach={approach}
              onClick={handleApproachClick}
            />
          ))}
          {filteredApproaches.length === 0 && (
            <div className="col-span-full text-center py-8 text-gray-500">
              Nenhuma abordagem encontrada
            </div>
          )}
        </div>
      </main>

      <ApproachForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
};

export default Index;