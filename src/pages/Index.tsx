import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { ApproachList } from "@/components/ApproachList";
import { ApproachForm } from "@/components/ApproachForm";
import { useToast } from "@/hooks/use-toast";
import { indexedDBService, type Approach } from "@/services/indexedDB";
import { v4 as uuidv4 } from "uuid";
import type { SearchFilters } from "@/components/AdvancedSearchFilters";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [approaches, setApproaches] = useState<Approach[]>([]);
  const [filteredApproaches, setFilteredApproaches] = useState<Approach[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<SearchFilters>({});
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadApproaches();
  }, []);

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

  const applyFilters = (data: Approach[], query: string, filters: SearchFilters) => {
    let filtered = [...data];

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
      await loadApproaches();
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
      <Header
        onNewApproach={() => setIsFormOpen(true)}
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
      />

      <main className="container py-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            {searchQuery || Object.keys(activeFilters).length > 0
              ? `Resultados da busca: ${filteredApproaches.length} encontrados`
              : "Últimas Abordagens"}
          </h2>
        </div>

        <ApproachList
          approaches={filteredApproaches}
          onApproachClick={handleApproachClick}
        />
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