import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { LocationForm } from "./LocationForm";
import { indexedDBService } from "@/services/indexedDB";
import { useNavigate } from "react-router-dom";

interface Endereco {
  rua: string;
  numero: string;
  bairro: string;
  complemento: string;
}

export const AbordagemForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [endereco, setEndereco] = useState<Endereco>({
    rua: "",
    numero: "",
    bairro: "",
    complemento: "",
  });
  const [location, setLocation] = useState({
    address: "",
    latitude: undefined,
    longitude: undefined,
  });

  const handleLocationChange = (field: string, value: string | number) => {
    setLocation(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      const dataAtual = new Date().toISOString();
      const abordagem = {
        id: crypto.randomUUID(),
        date: dataAtual,
        location: location.address,
        address: location.address,
        data: dataAtual,
        endereco: endereco,
        latitude: location.latitude,
        longitude: location.longitude,
      };

      await indexedDBService.addApproach(abordagem);
      toast({
        title: "Sucesso",
        description: "Abordagem salva com sucesso.",
      });
      navigate("/");
    } catch (error) {
      console.error("Erro ao salvar abordagem:", error);
      toast({
        title: "Erro",
        description: "Erro ao salvar a abordagem.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      <Card className="bg-[#141829] border-[#2A2F45] p-4">
        <h2 className="text-[#E1E2E5] text-lg font-medium mb-4">
          Localização da Abordagem
        </h2>
        <LocationForm formData={location} onChange={handleLocationChange} />
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={!location.address}
          className="px-6"
        >
          Salvar Abordagem
        </Button>
      </div>
    </div>
  );
};