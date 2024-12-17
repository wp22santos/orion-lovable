import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { MapPin, Users } from "lucide-react";
import { useGeolocation } from "@/hooks/useGeolocation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ApproachedPersonForm } from "./ApproachedPersonForm";

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
  const [isAddingPerson, setIsAddingPerson] = useState(false);
  const [approachedPeople, setApproachedPeople] = useState<any[]>([]);

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

  const handleAddPerson = () => {
    setIsAddingPerson(true);
  };

  const handleSavePerson = (person: any) => {
    setApproachedPeople((prev) => [...prev, person]);
    const companions = approachedPeople.map(p => p.name).join(", ");
    onChange("companions", companions);
    setIsAddingPerson(false);
    toast({
      title: "Sucesso",
      description: "Pessoa adicionada com sucesso.",
    });
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

      <div className="space-y-4">
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleAddPerson}
        >
          <Users className="mr-2 h-4 w-4" />
          Adicionar Abordado
        </Button>

        {approachedPeople.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Pessoas Abordadas:</h4>
            <div className="grid gap-2">
              {approachedPeople.map((person) => (
                <div
                  key={person.id}
                  className="p-3 bg-gray-50 rounded-lg flex items-center gap-3"
                >
                  {person.photos?.[0] && (
                    <img
                      src={person.photos[0]}
                      alt={person.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <p className="font-medium">{person.name}</p>
                    <p className="text-sm text-gray-600">RG: {person.rg}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Dialog open={isAddingPerson} onOpenChange={setIsAddingPerson}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Adicionar Abordado</DialogTitle>
          </DialogHeader>
          <ApproachedPersonForm
            onSave={handleSavePerson}
            onCancel={() => setIsAddingPerson(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};