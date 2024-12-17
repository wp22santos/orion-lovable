import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { ApproachList } from "@/components/ApproachList";
import { ApproachForm } from "@/components/ApproachForm";
import { useToast } from "@/hooks/use-toast";
import { indexedDBService, type Approach } from "@/services/indexedDB";
import { v4 as uuidv4 } from "uuid";
import type { SearchFilters } from "@/components/AdvancedSearchFilters";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [approaches, setApproaches] = useState<Approach[]>([]);
  const [filteredApproaches, setFilteredApproaches] = useState<Approach[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<SearchFilters>({});
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    loadApproaches();
  }, []);

  const loadApproaches = async () => {
    try {
      const data = await indexedDBService.getApproaches();
      if (Array.isArray(data)) {
        setApproaches(data);
        applyFilters(data, searchQuery, activeFilters);
      } else {
        console.error("Dados inválidos recebidos:", data);
        setApproaches([]);
        setFilteredApproaches([]);
      }
    } catch (error) {
      console.error("Erro ao carregar abordagens:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as abordagens.",
        variant: "destructive",
      });
    }
  };

  const applyFilters = (data: Approach[], query: string, filters: SearchFilters) => {
    if (!Array.isArray(data)) {
      console.error("Dados inválidos para filtrar:", data);
      return;
    }

    let filtered = [...data];

    if (query) {
      const searchStr = query.toLowerCase();
      filtered = filtered.filter((approach) => {
        if (!approach) return false;
        const searchableStr = `
          ${approach.name || ''} 
          ${approach.motherName || ''} 
          ${approach.rg || ''} 
          ${approach.cpf || ''} 
          ${approach.address || ''} 
          ${approach.observations || ''} 
          ${approach.companions?.join(' ') || ''}
        `.toLowerCase();
        return searchableStr.includes(searchStr);
      });
    }

    // Filtros avançados
    if (filters.name) {
      filtered = filtered.filter(a => 
        a?.name?.toLowerCase().includes(filters.name!.toLowerCase())
      );
    }
    if (filters.rg) {
      filtered = filtered.filter(a => 
        a?.rg?.includes(filters.rg!)
      );
    }
    if (filters.cpf) {
      filtered = filtered.filter(a => 
        a?.cpf?.includes(filters.cpf!)
      );
    }
    if (filters.location) {
      filtered = filtered.filter(a => 
        a?.address?.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }
    if (filters.observations) {
      filtered = filtered.filter(a => 
        a?.observations?.toLowerCase().includes(filters.observations!.toLowerCase())
      );
    }
    if (filters.companion) {
      filtered = filtered.filter(a => 
        a?.companions?.some(c => 
          c.toLowerCase().includes(filters.companion!.toLowerCase())
        )
      );
    }

    filtered.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA;
    });

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
      name: data.name || '',
      motherName: data.motherName || '',
      rg: data.rg || '',
      cpf: data.cpf || '',
      address: data.address || '',
      observations: data.observations || '',
      companions: data.companions || [],
      date: new Date().toISOString(),
      location: data.address || '',
      imageUrl: data.imageUrl || '',
    };

    try {
      await indexedDBService.addApproach(newApproach);
      await loadApproaches();
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
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header
        onNewApproach={() => setIsFormOpen(true)}
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
      />

      <main className={`flex-1 ${isMobile ? 'px-4 pb-20' : 'container'} py-4 md:py-8 overflow-y-auto`}>
        <div className="mb-4 md:mb-6">
          <h2 className="text-lg md:text-xl font-semibold text-gray-800">
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