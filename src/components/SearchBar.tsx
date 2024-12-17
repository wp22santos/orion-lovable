import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export const SearchBar = ({ onSearch, placeholder = "Buscar..." }: SearchBarProps) => {
  const isMobile = useIsMobile();

  return (
    <div className={`relative w-full ${isMobile ? '' : 'max-w-xl'}`}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
      <Input
        type="search"
        placeholder={placeholder}
        onChange={(e) => onSearch(e.target.value)}
        className="pl-10 bg-white border-gray-200 h-11"
      />
    </div>
  );
};