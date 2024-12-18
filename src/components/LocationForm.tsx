import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Loader2 } from "lucide-react";
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
  const { loading, getLocation } = useGeolocation();
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [addressDetails, setAddressDetails] = useState({
    street: "",
    number: "",
    neighborhood: "",
  });

  useEffect(() => {
    // Try to get location automatically when component mounts
    handleGetLocation();
  }, []);

  const handleGetLocation = async () => {
    try {
      setIsLoadingLocation(true);
      const location = await getLocation();
      
      if (location) {
        onChange("latitude", location.latitude);
        onChange("longitude", location.longitude);
        
        try {
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
        } catch (error) {
          console.error("Erro ao obter endereço:", error);
          toast({
            title: "Erro",
            description: "Não foi possível obter o endereço completo.",
            variant: "destructive",
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
    <div className="space-y-4 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label htmlFor="street" className="text-sm font-medium text-gray-700">
            Logradouro
          </label>
          <Input
            id="street"
            value={addressDetails.street}
            onChange={(e) => handleAddressChange("street", e.target.value)}
            placeholder="Nome da rua"
            className="bg-white/50 border-gray-200 focus:border-purple-500"
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
            className="bg-white/50 border-gray-200 focus:border-purple-500"
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
            className="bg-white/50 border-gray-200 focus:border-purple-500"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={handleGetLocation}
          disabled={isLoadingLocation || loading}
          className="bg-white hover:bg-gray-50 border-gray-200"
        >
          {isLoadingLocation ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <MapPin className="w-4 h-4 mr-2 text-purple-500" />
          )}
          {isLoadingLocation ? "Obtendo..." : "Atualizar GPS"}
        </Button>
      </div>
    </div>
  );
};