import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LocationForm } from "./LocationForm";
import { indexedDBService } from "@/services/indexedDB";
import { useNavigate } from "react-router-dom";
import { ApproachedPersonForm } from "./ApproachedPersonForm";
import { Plus, Save } from "lucide-react";
import { toast } from "sonner";
import { ApproachedPerson, Endereco } from "@/types/person";

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
        endereco: {
          rua: "",
          numero: "",
          bairro: "",
          complemento: "",
        },
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
        companions: pessoas.slice(1).map(p => p.name),
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
      <div className="px-2 sm:px-4 py-4 space-y-4 max-w-3xl mx-auto animate-fade-in pb-24">
        <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 p-3 sm:p-6 shadow-lg rounded-xl">
          <LocationForm formData={location} onChange={handleLocationChange} />
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 p-3 sm:p-6 shadow-lg rounded-xl">
          <div className="flex justify-between items-center mb-4 sm:mb-6 flex-wrap gap-2">
            <h2 className="text-lg sm:text-xl font-medium text-police-dark">Pessoas Abordadas</h2>
            <Button
              onClick={() => setShowPersonForm(true)}
              className="bg-police-primary hover:bg-police-dark text-white w-full sm:w-auto"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Adicionar Pessoa
            </Button>
          </div>

          {showPersonForm && (
            <ApproachedPersonForm
              onSave={handlePersonSubmit}
              onCancel={() => setShowPersonForm(false)}
            />
          )}

          {pessoas.length > 0 && (
            <div className="space-y-3 mt-4">
              {pessoas.map((person) => (
                <Card 
                  key={person.id} 
                  className="bg-gray-50/80 backdrop-blur-sm p-3 sm:p-4 hover:bg-gray-50/90 
                           transition-all duration-200 border border-gray-200 cursor-pointer"
                  onClick={() => {
                    setShowPersonForm(true);
                    setPessoas(prev => prev.filter(p => p.id !== person.id));
                  }}
                >
                  <div className="flex items-center gap-3">
                    {person.photos?.find(p => p.isPerfil)?.url && (
                      <img
                        src={person.photos.find(p => p.isPerfil)?.url}
                        alt="Foto do abordado"
                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-gray-200"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-police-dark truncate">{person.name}</h3>
                      <p className="text-sm text-gray-600 truncate">RG: {person.rg}</p>
                      <p className="text-sm text-gray-600 truncate">CPF: {person.cpf}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Card>

        <div className="fixed bottom-0 left-0 right-0 p-3 sm:p-4 bg-white/80 backdrop-blur-md border-t border-gray-200">
          <div className="max-w-3xl mx-auto">
            <Button
              onClick={handleSave}
              className="w-full bg-police-primary hover:bg-police-dark text-white py-4 sm:py-6 text-base sm:text-lg
                       shadow-lg rounded-xl flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4 sm:w-5 sm:h-5" />
              Salvar Abordagem
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
