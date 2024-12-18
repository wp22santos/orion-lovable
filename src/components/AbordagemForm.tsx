import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LocationForm } from "./LocationForm";
import { indexedDBService } from "@/services/indexedDB";
import { useNavigate } from "react-router-dom";
import { ApproachedPersonForm } from "./ApproachedPersonForm";
import { Plus, Save } from "lucide-react";
import { toast } from "sonner";

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
  endereco?: Endereco;
}

export const AbordagemForm = () => {
  const navigate = useNavigate();
  const [pessoas, setPessoas] = useState<ApproachedPerson[]>([]);
  const [showPersonForm, setShowPersonForm] = useState(false);
  const [location, setLocation] = useState({
    address: "",
    latitude: 0,
    longitude: 0,
  });

  const handleLocationChange = (field: string, value: string | number) => {
    setLocation(prev => ({ ...prev, [field]: value }));
  };

  const handleAddPerson = (person: ApproachedPerson) => {
    setPessoas(prev => [...prev, person]);
    setShowPersonForm(false);
    toast.success("Pessoa adicionada com sucesso");
  };

  const handleSave = async () => {
    try {
      if (pessoas.length === 0) {
        toast.error("Adicione pelo menos uma pessoa à abordagem");
        return;
      }

      const dataAtual = new Date().toISOString();
      const mainPerson = pessoas[0];

      const abordagem = {
        id: crypto.randomUUID(),
        date: dataAtual,
        location: location.address || "Localização não informada",
        name: mainPerson.name,
        motherName: mainPerson.motherName,
        rg: mainPerson.rg,
        cpf: mainPerson.cpf,
        imageUrl: mainPerson.photos?.[0] || "",
        address: location.address,
        data: dataAtual,
        latitude: location.latitude || 0,
        longitude: location.longitude || 0,
        endereco: {
          rua: "",
          numero: "",
          bairro: "",
          complemento: "",
        },
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
          endereco: p.endereco || {
            rua: "",
            numero: "",
            bairro: "",
            complemento: "",
          },
          veiculo: {
            plate: "",
            brand: "",
            color: "",
            observations: "",
          },
          observacoes: "",
        })),
        companions: pessoas.slice(1).map(p => p.name),
      };

      console.log("Salvando abordagem:", abordagem);
      await indexedDBService.addApproach(abordagem);
      toast.success("Abordagem salva com sucesso");
      navigate("/");
    } catch (error) {
      console.error("Erro ao salvar abordagem:", error);
      toast.error("Erro ao salvar a abordagem");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-6 space-y-6 max-w-3xl animate-fade-in">
        <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 p-6 shadow-lg rounded-xl">
          <LocationForm formData={location} onChange={handleLocationChange} />
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 p-6 shadow-lg rounded-xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-medium text-police-dark">Pessoas Abordadas</h2>
            <Button
              onClick={() => setShowPersonForm(true)}
              className="bg-police-primary hover:bg-police-dark text-white"
            >
              <Plus className="w-5 h-5 mr-2" />
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
            <div className="space-y-4 mt-6">
              {pessoas.map((person) => (
                <Card 
                  key={person.id} 
                  className="bg-gray-50/80 backdrop-blur-sm p-4 hover:bg-gray-50/90 
                           transition-all duration-200 border border-gray-200"
                >
                  <div className="flex items-center space-x-4">
                    {person.photos?.[0] && (
                      <img
                        src={person.photos[0]}
                        alt="Foto do abordado"
                        className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                      />
                    )}
                    <div>
                      <h3 className="font-medium text-police-dark">{person.name}</h3>
                      <p className="text-gray-600 text-sm">RG: {person.rg}</p>
                      <p className="text-gray-600 text-sm">CPF: {person.cpf}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Card>

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-gray-200">
          <div className="container mx-auto max-w-3xl">
            <Button
              onClick={handleSave}
              className="w-full bg-police-primary hover:bg-police-dark text-white py-6 text-lg
                       shadow-lg rounded-xl flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              Salvar Abordagem
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};