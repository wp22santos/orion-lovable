import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useToast } from "@/hooks/use-toast";

interface LocationFormProps {
  formData: {
    address: string;
    latitude?: number;
    longitude?: number;
  };
  onChange: (field: string, value: string | number) => void;
}

export const LocationForm = ({ formData, onChange }: LocationFormProps) => {
  const { toast } = useToast();
  const { getLocation } = useGeolocation();
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const handleGetLocation = async () => {
    try {
      setIsLoadingLocation(true);
      const location = await getLocation();
      
      if (location) {
        onChange("latitude", location.latitude);
        onChange("longitude", location.longitude);
        
        // Atualiza o endereço apenas se tivermos as coordenadas
        if (location.latitude && location.longitude) {
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.latitude}&lon=${location.longitude}`
            );
            const data = await response.json();
            
            if (data.display_name) {
              onChange("address", data.display_name);
            }
          } catch (error) {
            console.error("Erro ao obter endereço:", error);
          }
        }
      }
    } catch (error) {
      console.error("Erro ao obter localização:", error);
      toast({
        title: "Erro",
        description: "Não foi possível obter sua localização.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingLocation(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="address" className="text-sm font-medium">
          Endereço da Abordagem
        </label>
        <div className="flex gap-2">
          <Input
            id="address"
            name="address"
            value={formData.address}
            onChange={(e) => onChange("address", e.target.value)}
            placeholder="Digite o endereço..."
            className="flex-1"
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleGetLocation}
            disabled={isLoadingLocation}
          >
            <MapPin className="w-4 h-4 mr-2" />
            {isLoadingLocation ? "Obtendo..." : "Usar GPS"}
          </Button>
        </div>
      </div>
    </div>
  );
};