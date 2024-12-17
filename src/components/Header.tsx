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
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white sticky top-0 z-10 shadow-lg">
      <div className="container py-6 px-4 md:px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-8 h-8"
            >
              <path d="M17.8 19.2 16 11l3.8-3.8a2 2 0 0 0-2.8-2.8L13.2 8l-8.2-1.8a2 2 0 0 0-2.4 2.4l1.8 8.2-3.8 3.8a2 2 0 1 0 2.8 2.8l3.8-3.8 8.2 1.8a2 2 0 0 0 2.4-2.4Z" />
            </svg>
            <h1 className="text-2xl font-bold">Sistema de Registro Policial</h1>
          </div>
          <div className="flex gap-4">
            <Button
              onClick={onNewApproach}
              className="bg-white text-blue-600 hover:bg-blue-50 transition-colors w-full md:w-auto font-semibold"
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