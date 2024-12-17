import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface AdvancedSearchFiltersProps {
  onFilterChange: (filters: SearchFilters) => void;
}

export interface SearchFilters {
  name?: string;
  rg?: string;
  cpf?: string;
  location?: string;
  observations?: string;
  vehiclePlate?: string;
  companion?: string;
}

export const AdvancedSearchFilters = ({ onFilterChange }: AdvancedSearchFiltersProps) => {
  const [filters, setFilters] = useState<SearchFilters>({});
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    onFilterChange({});
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filtros Avançados
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filtros de Busca</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nome</label>
            <Input
              placeholder="Nome do abordado"
              value={filters.name || ""}
              onChange={(e) => handleFilterChange("name", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">RG</label>
            <Input
              placeholder="RG"
              value={filters.rg || ""}
              onChange={(e) => handleFilterChange("rg", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">CPF</label>
            <Input
              placeholder="CPF"
              value={filters.cpf || ""}
              onChange={(e) => handleFilterChange("cpf", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Localização</label>
            <Input
              placeholder="Endereço ou bairro"
              value={filters.location || ""}
              onChange={(e) => handleFilterChange("location", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Placa do Veículo</label>
            <Input
              placeholder="Placa"
              value={filters.vehiclePlate || ""}
              onChange={(e) => handleFilterChange("vehiclePlate", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Acompanhante</label>
            <Input
              placeholder="Nome do acompanhante"
              value={filters.companion || ""}
              onChange={(e) => handleFilterChange("companion", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Observações</label>
            <Input
              placeholder="Buscar nas observações"
              value={filters.observations || ""}
              onChange={(e) => handleFilterChange("observations", e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={clearFilters}
          >
            <X className="h-4 w-4" />
            Limpar Filtros
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};