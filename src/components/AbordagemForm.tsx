import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LocationForm } from "./LocationForm";
import { indexedDBService } from "@/services/indexedDB";
import { useNavigate } from "react-router-dom";
import { ApproachedPersonForm } from "./ApproachedPersonForm";
import { Plus, Save, MapPin, Users } from "lucide-react";
import { toast } from "sonner";
import { ApproachedPerson } from "@/types/person";

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

  const handlePersonSubmit = (person: ApproachedPerson) => {
    setPessoas(prev => {
      const newPessoas = [...prev];
      const existingIndex = newPessoas.findIndex(p => p.id === person.id);
      
      if (existingIndex !== -1) {
        newPessoas[existingIndex] = person;
      } else {
        newPessoas.push(person);
      }
      
      return newPessoas;
    });
    setShowPersonForm(false);
    toast.success("Pessoa adicionada com sucesso");
  };

  const handleSave = async () => {
    try {
      if (pessoas.length === 0) {
        toast.error("Adicione pelo menos uma pessoa à abordagem");
        return;
      }

      if (!location.address) {
        toast.error("Informe a localização da abordagem");
        return;
      }

      const dataAtual = new Date().toISOString();
      const mainPerson = pessoas[0];
      const profilePhoto = mainPerson.photos.find(p => p.isPerfil)?.url;

      const abordagem = {
        id: crypto.randomUUID(),
        date: dataAtual,
        location: location.address || "Localização não informada",
        name: mainPerson.name,
        motherName: mainPerson.motherName,
        rg: mainPerson.rg,
        cpf: mainPerson.cpf,
        imageUrl: profilePhoto || "",
        address: location.address,
        data: dataAtual,
        latitude: location.latitude || 0,
        longitude: location.longitude || 0,
        pessoas: pessoas.map(p => ({
          id: p.id,
          dados: {
            foto: p.photos.find(photo => photo.isPerfil)?.url || "",
            fotos: p.photos,
            nome: p.name,
            dataNascimento: "",
            rg: p.rg,
            cpf: p.cpf,
            nomeMae: p.motherName,
            nomePai: "",
            endereco: location.address,
            profilePhoto: p.photos.find(photo => photo.isPerfil)?.url || ""
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
      };

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
      <div className="max-w-3xl mx-auto p-4 space-y-4 animate-fade-in">
        {/* Step 1: Location */}
        <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 p-4 rounded-xl shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-police-primary p-2 rounded-lg">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-medium text-police-dark">
              1. Localização da Abordagem
            </h2>
          </div>
          <LocationForm formData={location} onChange={handleLocationChange} />
        </Card>

        {/* Step 2: People */}
        <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 p-4 rounded-xl shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-police-primary p-2 rounded-lg">
              <Users className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-medium text-police-dark">
              2. Pessoas Abordadas
            </h2>
          </div>

          {pessoas.length === 0 ? (
            <div className="text-center py-8 px-4">
              <Users className="w-12 h-12 mx-auto text-gray-400 mb-3" />
              <p className="text-gray-600 mb-4">
                Nenhuma pessoa adicionada ainda
              </p>
              <Button
                onClick={() => setShowPersonForm(true)}
                className="bg-police-primary hover:bg-police-dark text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Pessoa
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid gap-3">
                {pessoas.map((person) => (
                  <Card 
                    key={person.id} 
                    className="bg-gray-50/80 p-3 hover:bg-gray-50/90 
                             transition-all duration-200 border border-gray-200 
                             cursor-pointer"
                    onClick={() => {
                      setShowPersonForm(true);
                      setPessoas(prev => prev.filter(p => p.id !== person.id));
                    }}
                  >
                    <div className="flex items-center gap-3">
                      {person.photos?.find(p => p.isPerfil)?.url ? (
                        <img
                          src={person.photos.find(p => p.isPerfil)?.url}
                          alt="Foto do abordado"
                          className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                          <Users className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium text-police-dark truncate">
                          {person.name}
                        </h3>
                        <p className="text-sm text-gray-600 truncate">
                          RG: {person.rg || "Não informado"}
                        </p>
                        <p className="text-sm text-gray-600 truncate">
                          CPF: {person.cpf || "Não informado"}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              
              <Button
                onClick={() => setShowPersonForm(true)}
                className="w-full bg-police-primary hover:bg-police-dark text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Outra Pessoa
              </Button>
            </div>
          )}

          {showPersonForm && (
            <ApproachedPersonForm
              onSave={handlePersonSubmit}
              onCancel={() => setShowPersonForm(false)}
            />
          )}
        </Card>

        {/* Save Button */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-gray-200">
          <div className="max-w-3xl mx-auto">
            <Button
              onClick={handleSave}
              className="w-full bg-police-primary hover:bg-police-dark text-white 
                       py-6 text-lg shadow-lg rounded-xl flex items-center 
                       justify-center gap-2"
              disabled={pessoas.length === 0 || !location.address}
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