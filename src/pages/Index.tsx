import { useState } from "react";
import { SearchBar } from "@/components/SearchBar";
import { ApproachCard } from "@/components/ApproachCard";

// Mock data - será substituído pelo IndexedDB
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
];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Implementar lógica de busca
  };

  const handleApproachClick = (id: string) => {
    // Implementar navegação para detalhes da abordagem
    console.log("Clicked approach:", id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-police-primary text-white">
        <div className="container py-6">
          <h1 className="text-2xl font-bold mb-6">Sistema de Registro Policial</h1>
          <SearchBar
            onSearch={handleSearch}
            placeholder="Buscar por nome, RG, CPF ou local..."
          />
        </div>
      </header>

      <main className="container py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Últimas Abordagens</h2>
          <button className="bg-police-accent hover:bg-police-secondary text-white px-4 py-2 rounded-lg transition-colors">
            Nova Abordagem
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {mockApproaches.map((approach) => (
            <ApproachCard
              key={approach.id}
              approach={approach}
              onClick={handleApproachClick}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;