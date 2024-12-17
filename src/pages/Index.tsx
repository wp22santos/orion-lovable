import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SearchBar } from "@/components/SearchBar";
import { ApproachCard } from "@/components/ApproachCard";
import { ApproachForm } from "@/components/ApproachForm";
import { AdvancedSearchFilters, type SearchFilters } from "@/components/AdvancedSearchFilters";
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
  const [activeFilters, setActiveFilters] = useState<SearchFilters>({});
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const loadApproaches = async () => {
      try {
        const data = await indexedDBService.getApproaches();
        setApproaches(data);
        applyFilters(data, searchQuery, activeFilters);
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

  const applyFilters = (data: Approach[], query: string, filters: SearchFilters) => {
    let filtered = [...data];

    // Texto de busca geral
    if (query) {
      const searchStr = query.toLowerCase();
      filtered = filtered.filter((approach) => {
        const searchableStr = `
          ${approach.name} 
          ${approach.motherName} 
          ${approach.rg} 
          ${approach.cpf} 
          ${approach.address} 
          ${approach.observations || ''} 
          ${approach.companions?.join(' ') || ''}
        `.toLowerCase();
        return searchableStr.includes(searchStr);
      });
    }

    // Filtros avançados
    if (filters.name) {
      filtered = filtered.filter(a => 
        a.name.toLowerCase().includes(filters.name!.toLowerCase())
      );
    }
    if (filters.rg) {
      filtered = filtered.filter(a => 
        a.rg.includes(filters.rg!)
      );
    }
    if (filters.cpf) {
      filtered = filtered.filter(a => 
        a.cpf.includes(filters.cpf!)
      );
    }
    if (filters.location) {
      filtered = filtered.filter(a => 
        a.address.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }
    if (filters.observations) {
      filtered = filtered.filter(a => 
        a.observations?.toLowerCase().includes(filters.observations!.toLowerCase())
      );
    }
    if (filters.companion) {
      filtered = filtered.filter(a => 
        a.companions?.some(c => 
          c.toLowerCase().includes(filters.companion!.toLowerCase())
        )
      );
    }

    // Ordenar por data (mais recente primeiro)
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    setFilteredApproaches(filtered);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    applyFilters(approaches, query, activeFilters);
  };

  const handleFilterChange = (filters: SearchFilters) => {
    setActiveFilters(filters);
    applyFilters(approaches, searchQuery, filters);
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
      companions: data.companions,
      date: new Date().toLocaleString(),
      location: data.address,
      imageUrl: data.imageUrl,
    };

    try {
      await indexedDBService.addApproach(newApproach);
      const updatedApproaches = await indexedDBService.getApproaches();
      setApproaches(updatedApproaches);
      applyFilters(updatedApproaches, searchQuery, activeFilters);
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
          <div className="mt-6 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <SearchBar
                onSearch={handleSearch}
                placeholder="Buscar por nome, RG, CPF ou local..."
              />
              <AdvancedSearchFilters onFilterChange={handleFilterChange} />
            </div>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            {searchQuery || Object.keys(activeFilters).length > 0
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