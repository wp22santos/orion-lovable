import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { MapPin, Users } from "lucide-react";
import { useGeolocation } from "@/hooks/useGeolocation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface LocationFormProps {
  formData: {
    address: string;
    companions: string;
    latitude?: number;
    longitude?: number;
  };
  onChange: (field: string, value: string | number) => void;
}

export const LocationForm = ({ formData, onChange }: LocationFormProps) => {
  const { latitude, longitude, error: geoError, loading } = useGeolocation();
  const { toast } = useToast();

  useEffect(() => {
    if (latitude && longitude && !formData.latitude && !formData.longitude) {
      onChange("latitude", latitude);
      onChange("longitude", longitude);
      fetchAddress(latitude, longitude);
    }
  }, [latitude, longitude]);

  const fetchAddress = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      if (data.display_name) {
        onChange("address", data.display_name);
      }
    } catch (error) {
      console.error("Erro ao buscar endereço:", error);
      toast({
        title: "Erro",
        description: "Não foi possível obter o endereço automaticamente",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="address" className="text-sm font-medium">
          Endereço *
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            id="address"
            name="address"
            value={formData.address}
            onChange={(e) => onChange("address", e.target.value)}
            className="pl-10"
            required
          />
        </div>
      </div>

      {formData.latitude && formData.longitude && (
        <div className="w-full h-[300px] rounded-lg shadow-md overflow-hidden">
          <iframe
            width="100%"
            height="100%"
            frameBorder="0"
            scrolling="no"
            marginHeight={0}
            marginWidth={0}
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${formData.longitude-0.01},${formData.latitude-0.01},${formData.longitude+0.01},${formData.latitude+0.01}&layer=mapnik&marker=${formData.latitude},${formData.longitude}`}
          />
        </div>
      )}

      {loading && <p>Carregando localização...</p>}
      {geoError && <p className="text-red-500">Erro ao obter localização: {geoError}</p>}

      <div className="space-y-2">
        <label htmlFor="companions" className="text-sm font-medium">
          Acompanhantes
        </label>
        <div className="relative">
          <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            id="companions"
            name="companions"
            value={formData.companions}
            onChange={(e) => onChange("companions", e.target.value)}
            className="pl-10"
            placeholder="Nomes separados por vírgula"
          />
        </div>
      </div>
    </div>
  );
};