import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { SearchBar } from "@/components/SearchBar";
import { AdvancedSearchFilters, type SearchFilters } from "@/components/AdvancedSearchFilters";
import { DataExport } from "@/components/DataExport";

interface HeaderProps {
  onNewApproach: () => void;
  onSearch: (query: string) => void;
  onFilterChange: (filters: SearchFilters) => void;
}

export const Header = ({ onNewApproach, onSearch, onFilterChange }: HeaderProps) => {
  return (
    <header className="bg-police-primary text-white sticky top-0 z-10 shadow-md">
      <div className="container py-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-bold">Sistema de Registro Policial</h1>
          <div className="flex gap-4">
            <Button
              onClick={onNewApproach}
              className="bg-police-accent hover:bg-police-secondary transition-colors w-full md:w-auto"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nova Abordagem
            </Button>
            <DataExport />
          </div>
        </div>
        <div className="mt-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <SearchBar
              onSearch={onSearch}
              placeholder="Buscar por nome, RG, CPF ou local..."
            />
            <AdvancedSearchFilters onFilterChange={onFilterChange} />
          </div>
        </div>
      </div>
    </header>
  );
};