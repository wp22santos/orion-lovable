import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { LocationForm } from "./LocationForm";
import { indexedDBService } from "@/services/indexedDB";
import { useNavigate } from "react-router-dom";
import { ApproachedPersonForm } from "./ApproachedPersonForm";
import { Plus } from "lucide-react";

interface Endereco {
  rua: string;
  numero: string;
  bairro: string;
  complemento: string;
}

interface ApproachedPerson {
  id: string;
  name: string;
  motherName: string;
  rg: string;
  cpf: string;
  photos: string[];
}

export const AbordagemForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [pessoas, setPessoas] = useState<ApproachedPerson[]>([]);
  const [showPersonForm, setShowPersonForm] = useState(false);
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

  const handleAddPerson = (person: ApproachedPerson) => {
    setPessoas(prev => [...prev, person]);
    setShowPersonForm(false);
    toast({
      title: "Sucesso",
      description: "Pessoa adicionada com sucesso.",
    });
  };

  const handleSave = async () => {
    try {
      if (pessoas.length === 0) {
        toast({
          title: "Erro",
          description: "Adicione pelo menos uma pessoa à abordagem.",
          variant: "destructive",
        });
        return;
      }

      const dataAtual = new Date().toISOString();
      const mainPerson = pessoas[0]; // Usando a primeira pessoa como principal

      const abordagem = {
        id: crypto.randomUUID(),
        date: dataAtual,
        location: location.address,
        address: location.address,
        data: dataAtual,
        endereco: endereco,
        latitude: location.latitude,
        longitude: location.longitude,
        name: mainPerson.name,
        motherName: mainPerson.motherName,
        rg: mainPerson.rg,
        cpf: mainPerson.cpf,
        pessoas: pessoas.map(p => ({
          id: p.id,
          dados: {
            foto: p.photos?.[0] || "",
            nome: p.name,
            dataNascimento: "",
            rg: p.rg,
            cpf: p.cpf,
            nomeMae: p.motherName,
            nomePai: "",
            endereco: location.address,
          },
          endereco: endereco,
          veiculo: {
            plate: "",
            brand: "",
            color: "",
            observations: "",
          },
          observacoes: "",
        })),
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
      <Card className="bg-[#141829] border-[#2A2F45] p-6">
        <h2 className="text-white text-lg font-medium mb-4">
          Localização da Abordagem
        </h2>
        <LocationForm formData={location} onChange={handleLocationChange} />
      </Card>

      <Card className="bg-[#141829] border-[#2A2F45] p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-white text-lg font-medium">Pessoas Abordadas</h2>
          <Button
            onClick={() => setShowPersonForm(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Pessoa
          </Button>
        </div>

        {showPersonForm && (
          <ApproachedPersonForm
            onSave={handleAddPerson}
            onCancel={() => setShowPersonForm(false)}
          />
        )}

        {pessoas.length > 0 && (
          <div className="space-y-4 mt-4">
            {pessoas.map((person) => (
              <Card key={person.id} className="bg-[#1A1F35] p-4 text-white">
                <div className="flex items-center space-x-4">
                  {person.photos?.[0] && (
                    <img
                      src={person.photos[0]}
                      alt="Foto do abordado"
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <h3 className="font-medium">{person.name}</h3>
                    <p className="text-gray-300 text-sm">RG: {person.rg}</p>
                    <p className="text-gray-300 text-sm">CPF: {person.cpf}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={!location.address || pessoas.length === 0}
          className="bg-green-600 hover:bg-green-700 text-white px-6"
        >
          Salvar Abordagem
        </Button>
      </div>
    </div>
  );
};