import { useState } from "react";
import { Card } from "@/components/ui/card";
import { LocationForm } from "./LocationForm";
import { indexedDBService } from "@/services/indexedDB";
import { useNavigate } from "react-router-dom";
import { ApproachedPersonForm } from "./ApproachedPersonForm";
import { MapPin, Users } from "lucide-react";
import { toast } from "sonner";
import { ApproachedPerson } from "@/types/person";
import { StepIndicator } from "./abordagem/StepIndicator";
import { PersonList } from "./abordagem/PersonList";
import { SaveButton } from "./abordagem/SaveButton";

const STEPS = [
  {
    title: "Localização",
    description: "Onde ocorreu?"
  },
  {
    title: "Pessoas",
    description: "Quem foi abordado?"
  }
];

export const AbordagemForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [pessoas, setPessoas] = useState<ApproachedPerson[]>([]);
  const [showPersonForm, setShowPersonForm] = useState(false);
  const [location, setLocation] = useState({
    address: "",
    latitude: 0,
    longitude: 0,
  });

  const handleLocationChange = (field: string, value: string | number) => {
    setLocation(prev => ({ ...prev, [field]: value }));
    if (field === 'address' && value) {
      setCurrentStep(1);
    }
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

  const handleEditPerson = (person: ApproachedPerson) => {
    setPessoas(prev => prev.filter(p => p.id !== person.id));
    setShowPersonForm(true);
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
        <StepIndicator currentStep={currentStep} steps={STEPS} />

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

          <PersonList 
            pessoas={pessoas}
            onAddPerson={() => setShowPersonForm(true)}
            onEditPerson={handleEditPerson}
          />

          {showPersonForm && (
            <ApproachedPersonForm
              onSave={handlePersonSubmit}
              onCancel={() => setShowPersonForm(false)}
            />
          )}
        </Card>

        <SaveButton 
          onSave={handleSave}
          disabled={pessoas.length === 0 || !location.address}
        />
      </div>
    </div>
  );
};