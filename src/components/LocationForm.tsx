import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Loader2 } from "lucide-react";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";

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
  const { loading, getLocation } = useGeolocation();
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [addressDetails, setAddressDetails] = useState({
    street: "",
    number: "",
    neighborhood: "",
  });

  useEffect(() => {
    handleGetLocation();
  }, []);

  const handleGetLocation = async () => {
    try {
      setIsLoadingLocation(true);
      const location = await getLocation();
      
      if (location) {
        onChange("latitude", location.latitude);
        onChange("longitude", location.longitude);
        
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.latitude}&lon=${location.longitude}`
        );
        const data = await response.json();
        
        if (data.address) {
          const street = data.address.road || "";
          const number = data.address.house_number || "";
          const neighborhood = data.address.suburb || data.address.neighbourhood || "";
          
          setAddressDetails({
            street,
            number,
            neighborhood,
          });
          
          onChange("address", `${street}, ${number} - ${neighborhood}`);
          toast({
            title: "Localização obtida",
            description: "Endereço atualizado com sucesso.",
          });
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

  const handleAddressChange = (field: string, value: string) => {
    setAddressDetails(prev => ({
      ...prev,
      [field]: value,
    }));
    
    const fullAddress = `${addressDetails.street}, ${addressDetails.number} - ${addressDetails.neighborhood}`;
    onChange("address", fullAddress);
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 p-6 shadow-lg rounded-2xl">
      <div className="flex items-center gap-3 mb-6">
        <MapPin className="w-6 h-6 text-purple-500" />
        <h2 className="text-xl font-medium text-gray-900">
          Localização da Abordagem
        </h2>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 md:col-span-2">
            <label htmlFor="street" className="text-sm font-medium text-gray-700">
              Logradouro
            </label>
            <Input
              id="street"
              value={addressDetails.street}
              onChange={(e) => handleAddressChange("street", e.target.value)}
              placeholder="Nome da rua"
              className="bg-white/50 border-gray-200 focus:border-purple-500 h-12 text-lg"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="number" className="text-sm font-medium text-gray-700">
              Número
            </label>
            <Input
              id="number"
              value={addressDetails.number}
              onChange={(e) => handleAddressChange("number", e.target.value)}
              placeholder="Número"
              className="bg-white/50 border-gray-200 focus:border-purple-500 h-12 text-lg"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="neighborhood" className="text-sm font-medium text-gray-700">
              Bairro
            </label>
            <Input
              id="neighborhood"
              value={addressDetails.neighborhood}
              onChange={(e) => handleAddressChange("neighborhood", e.target.value)}
              placeholder="Bairro"
              className="bg-white/50 border-gray-200 focus:border-purple-500 h-12 text-lg"
            />
          </div>
        </div>

        <Button
          type="button"
          onClick={handleGetLocation}
          disabled={isLoadingLocation || loading}
          className="w-full bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 
                   shadow-sm h-12 text-lg flex items-center justify-center gap-2"
        >
          {isLoadingLocation ? (
            <Loader2 className="w-5 h-5 animate-spin text-purple-500" />
          ) : (
            <MapPin className="w-5 h-5 text-purple-500" />
          )}
          {isLoadingLocation ? "Obtendo localização..." : "Atualizar GPS"}
        </Button>
      </div>
    </Card>
  );
};