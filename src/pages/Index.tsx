import { useState } from "react";
import { SearchBar } from "@/components/SearchBar";
import { ApproachCard } from "@/components/ApproachCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

// Mock data - will be replaced with IndexedDB
const mockApproaches = [
  {
    id: "1",
    name: "João Silva",
    date: "2024-03-14 15:30",
    location: "Av. Paulista, 1000",
    companions: ["Maria Santos", "Pedro Lima"],
  },
  {
    id: "2",
    name: "Ana Oliveira",
    date: "2024-03-14 14:15",
    location: "Rua Augusta, 500",
  },
  {
    id: "3",
    name: "Carlos Souza",
    date: "2024-03-14 13:00",
    location: "Rua Oscar Freire, 200",
    companions: ["Roberto Santos"],
  },
];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredApproaches, setFilteredApproaches] = useState(mockApproaches);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = mockApproaches.filter((approach) => {
      const searchStr = `${approach.name} ${approach.location} ${approach.companions?.join(" ")}`.toLowerCase();
      return searchStr.includes(query.toLowerCase());
    });
    setFilteredApproaches(filtered);
  };

  const handleApproachClick = (id: string) => {
    // Will be implemented later for navigation to approach details
    console.log("Clicked approach:", id);
  };

  const handleNewApproach = () => {
    // Will be implemented later for new approach creation
    console.log("New approach clicked");
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
              <Plus className="w-4 h-4" />
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
    </div>
  );
};

export default Index;