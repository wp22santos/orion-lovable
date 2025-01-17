import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Loader2 } from "lucide-react";
import { useGeolocation } from "@/hooks/useGeolocation";
import { toast } from "sonner";

interface LocationFormProps {
  formData: {
    address: string;
    latitude?: number;
    longitude?: number;
  };
  onChange: (field: string, value: string | number) => void;
}

export const LocationForm = ({ formData, onChange }: LocationFormProps) => {
  const { loading, getLocation } = useGeolocation();
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [addressDetails, setAddressDetails] = useState({
    street: "",
    number: "",
    neighborhood: "",
  });

  // Solicita permissão de GPS ao montar o componente
  useEffect(() => {
    const requestLocationPermission = async () => {
      try {
        const result = await navigator.permissions.query({ name: 'geolocation' });
        
        if (result.state === 'granted') {
          handleGetLocation();
        } else if (result.state === 'prompt') {
          // Força a solicitação de permissão
          navigator.geolocation.getCurrentPosition(
            () => {
              handleGetLocation();
              toast.success('Permissão de localização concedida!');
            },
            (error) => {
              console.error('Erro ao obter permissão:', error);
              toast.error('Por favor, permita o acesso à sua localização para continuar.');
            },
            { enableHighAccuracy: true }
          );
        } else {
          toast.error('Permissão de localização negada. Por favor, habilite nas configurações do seu dispositivo.');
        }
      } catch (error) {
        console.error('Erro ao verificar permissão:', error);
        toast.error('Erro ao verificar permissões de localização');
      }
    };

    requestLocationPermission();
  }, []);

  const handleGetLocation = async () => {
    if (isLoadingLocation) return;

    try {
      setIsLoadingLocation(true);
      const location = await getLocation();
      
      if (location) {
        onChange("latitude", location.latitude);
        onChange("longitude", location.longitude);
        
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.latitude}&lon=${location.longitude}`
        );
        
        if (!response.ok) {
          throw new Error('Falha ao obter endereço');
        }

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
          
          const fullAddress = `${street}, ${number} - ${neighborhood}`.trim();
          onChange("address", fullAddress);
          toast.success("Localização obtida com sucesso!");
        }
      }
    } catch (error) {
      console.error("Erro ao obter localização:", error);
      toast.error("Não foi possível obter sua localização. Verifique as permissões do GPS.");
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const handleAddressChange = (field: string, value: string) => {
    setAddressDetails(prev => ({
      ...prev,
      [field]: value,
    }));
    
    const { street, number, neighborhood } = addressDetails;
    if (street || number || neighborhood) {
      const fullAddress = `${street}, ${number} - ${neighborhood}`.trim();
      onChange("address", fullAddress);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-6 gap-3">
        <div className="space-y-1.5 sm:col-span-4">
          <label htmlFor="street" className="text-sm font-medium text-police-dark">
            Logradouro
          </label>
          <Input
            id="street"
            value={addressDetails.street}
            onChange={(e) => handleAddressChange("street", e.target.value)}
            placeholder="Nome da rua"
            className="bg-white/50 border-gray-200 h-12"
          />
        </div>
        
        <div className="space-y-1.5 sm:col-span-2">
          <label htmlFor="number" className="text-sm font-medium text-police-dark">
            Número
          </label>
          <Input
            id="number"
            value={addressDetails.number}
            onChange={(e) => handleAddressChange("number", e.target.value)}
            placeholder="Número"
            className="bg-white/50 border-gray-200 h-12"
          />
        </div>
        
        <div className="space-y-1.5 sm:col-span-6">
          <label htmlFor="neighborhood" className="text-sm font-medium text-police-dark">
            Bairro
          </label>
          <Input
            id="neighborhood"
            value={addressDetails.neighborhood}
            onChange={(e) => handleAddressChange("neighborhood", e.target.value)}
            placeholder="Bairro"
            className="bg-white/50 border-gray-200 h-12"
          />
        </div>
      </div>

      <Button
        type="button"
        onClick={handleGetLocation}
        disabled={isLoadingLocation || loading}
        className="w-full bg-police-primary hover:bg-police-dark text-white h-12
                 shadow-lg rounded-lg flex items-center justify-center gap-2"
      >
        {isLoadingLocation ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <MapPin className="w-5 h-5" />
        )}
        {isLoadingLocation ? "Obtendo localização..." : "Atualizar GPS"}
      </Button>
    </div>
  );
};