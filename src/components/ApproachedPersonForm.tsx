import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PersonalInfoForm } from "./PersonalInfoForm";
import { useToast } from "@/hooks/use-toast";
import { Camera, Search } from "lucide-react";
import { Input } from "./ui/input";
import { indexedDBService } from "@/services/indexedDB";

interface ApproachedPerson {
  id: string;
  name: string;
  motherName: string;
  rg: string;
  cpf: string;
  photos: string[];
}

interface ApproachedPersonFormProps {
  onSave: (person: ApproachedPerson) => void;
  onCancel: () => void;
  existingPerson?: ApproachedPerson;
}

export const ApproachedPersonForm = ({ onSave, onCancel, existingPerson }: ApproachedPersonFormProps) => {
  const { toast } = useToast();
  const [photos, setPhotos] = useState<string[]>(existingPerson?.photos || []);
  const [formData, setFormData] = useState({
    name: existingPerson?.name || "",
    motherName: existingPerson?.motherName || "",
    rg: existingPerson?.rg || "",
    cpf: existingPerson?.cpf || "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearch = async () => {
    if (!searchTerm) {
      toast({
        title: "Erro",
        description: "Digite um termo para busca",
        variant: "destructive",
      });
      return;
    }

    try {
      const approaches = await indexedDBService.getApproaches();
      const foundPerson = approaches.find(approach => 
        approach.rg === searchTerm || 
        approach.cpf === searchTerm || 
        approach.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      if (foundPerson) {
        setFormData({
          name: foundPerson.name,
          motherName: foundPerson.motherName,
          rg: foundPerson.rg,
          cpf: foundPerson.cpf,
        });
        
        // Se houver foto da pessoa encontrada
        if (foundPerson.pessoas?.[0]?.dados?.foto) {
          setPhotos([foundPerson.pessoas[0].dados.foto]);
        }

        toast({
          title: "Sucesso",
          description: "Pessoa encontrada!",
        });
      } else {
        toast({
          title: "Aviso",
          description: "Nenhuma pessoa encontrada com os dados informados.",
        });
      }
    } catch (error) {
      console.error("Erro ao buscar pessoa:", error);
      toast({
        title: "Erro",
        description: "Erro ao buscar pessoa",
        variant: "destructive",
      });
    }
  };

  const handlePhotoCapture = async () => {
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.multiple = true;
      input.capture = 'environment';

      input.onchange = async (e) => {
        const files = (e.target as HTMLInputElement).files;
        if (!files) return;

        const newPhotos: string[] = [];
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const reader = new FileReader();
          
          await new Promise((resolve) => {
            reader.onloadend = () => {
              newPhotos.push(reader.result as string);
              resolve(null);
            };
            reader.readAsDataURL(file);
          });
        }

        setPhotos((prev) => [...prev, ...newPhotos]);
        toast({
          title: "Fotos adicionadas",
          description: `${newPhotos.length} foto(s) adicionada(s) com sucesso.`,
        });
      };

      input.click();
    } catch (error) {
      console.error("Erro ao capturar fotos:", error);
      toast({
        title: "Erro",
        description: "Não foi possível capturar as fotos.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.motherName || !formData.rg || !formData.cpf) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    onSave({
      id: existingPerson?.id || crypto.randomUUID(),
      ...formData,
      photos,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex gap-4 mb-4">
        <Input
          type="text"
          placeholder="Buscar por nome, RG ou CPF..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-[#1A1F35] text-white border-[#2A2F45]"
        />
        <Button
          type="button"
          onClick={handleSearch}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Search className="w-4 h-4" />
        </Button>
      </div>

      <PersonalInfoForm formData={formData} onChange={handleChange} />

      <div className="space-y-4">
        <Button
          type="button"
          variant="outline"
          className="w-full bg-[#1A1F35] text-white border-[#2A2F45] hover:bg-[#2A2F45]"
          onClick={handlePhotoCapture}
        >
          <Camera className="mr-2 h-4 w-4" />
          Adicionar Fotos
        </Button>

        {photos.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {photos.map((photo, index) => (
              <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                <img
                  src={photo}
                  alt={`Foto ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          className="bg-[#1A1F35] text-white border-[#2A2F45] hover:bg-[#2A2F45]"
        >
          Cancelar
        </Button>
        <Button 
          type="submit"
          className="bg-green-600 hover:bg-green-700"
        >
          Salvar
        </Button>
      </div>
    </form>
  );
};