import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LocationForm } from "./LocationForm";
import { indexedDBService } from "@/services/indexedDB";
import { useNavigate } from "react-router-dom";
import { ApproachedPersonForm } from "./ApproachedPersonForm";
import { Plus, MapPin, ArrowLeft } from "lucide-react";
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
}

export const AbordagemForm = () => {
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
    latitude: 0,
    longitude: 0,
  });

  const handleLocationChange = (field: string, value: string | number) => {
    setLocation(prev => ({ ...prev, [field]: value }));
  };

  const handleAddPerson = (person: ApproachedPerson) => {
    setPessoas(prev => [...prev, person]);
    setShowPersonForm(false);
    toast.success("Pessoa adicionada com sucesso.");
  };

  const handleSave = async () => {
    try {
      console.log("Iniciando salvamento da abordagem...");
      
      if (pessoas.length === 0) {
        toast.error("Adicione pelo menos uma pessoa à abordagem.");
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
        endereco: {
          rua: endereco.rua || "",
          numero: endereco.numero || "",
          bairro: endereco.bairro || "",
          complemento: endereco.complemento || "",
        },
        latitude: location.latitude || 0,
        longitude: location.longitude || 0,
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
          endereco: {
            rua: endereco.rua || "",
            numero: endereco.numero || "",
            bairro: endereco.bairro || "",
            complemento: endereco.complemento || "",
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

      console.log("Dados da abordagem preparados:", abordagem);
      
      await indexedDBService.addApproach(abordagem);
      console.log("Abordagem salva com sucesso no IndexedDB");
      
      toast.success("Abordagem salva com sucesso.");
      navigate("/");
    } catch (error) {
      console.error("Erro ao salvar abordagem:", error);
      toast.error("Erro ao salvar a abordagem.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar
          </button>
          <h1 className="text-lg font-medium text-gray-900">Nova Abordagem</h1>
          <div className="w-10" /> {/* Espaçador para centralizar o título */}
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6 max-w-3xl animate-fade-in">
        {/* Localização */}
        <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 p-6 shadow-lg rounded-2xl">
          <div className="flex items-center gap-3 mb-6">
            <MapPin className="w-6 h-6 text-purple-500" />
            <h2 className="text-xl font-medium text-gray-900">
              Localização da Abordagem
            </h2>
          </div>
          <LocationForm formData={location} onChange={handleLocationChange} />
        </Card>

        {/* Pessoas Abordadas */}
        <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 p-6 shadow-lg rounded-2xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-medium text-gray-900">Pessoas Abordadas</h2>
            <Button
              onClick={() => setShowPersonForm(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white shadow-purple-200/50 shadow-lg"
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
                           transition-all duration-200 border border-gray-100 rounded-xl"
                >
                  <div className="flex items-center space-x-4">
                    {person.photos?.[0] && (
                      <img
                        src={person.photos[0]}
                        alt="Foto do abordado"
                        className="w-16 h-16 rounded-full object-cover ring-2 ring-purple-100"
                      />
                    )}
                    <div>
                      <h3 className="font-medium text-gray-900">{person.name}</h3>
                      <p className="text-gray-600 text-sm">RG: {person.rg}</p>
                      <p className="text-gray-600 text-sm">CPF: {person.cpf}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Card>

        {/* Botão Salvar */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-gray-100">
          <div className="container mx-auto max-w-3xl">
            <Button
              onClick={handleSave}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg
                       shadow-green-200/50 shadow-lg rounded-xl"
            >
              Salvar Abordagem
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};