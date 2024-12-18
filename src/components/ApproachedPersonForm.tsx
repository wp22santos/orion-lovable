import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PersonalInfoForm } from "./PersonalInfoForm";
import { PersonSearch } from "./PersonSearch";
import { PhotoCapture } from "./PhotoCapture";

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
  const [photos, setPhotos] = useState<string[]>(existingPerson?.photos || []);
  const [formData, setFormData] = useState({
    name: existingPerson?.name || "",
    motherName: existingPerson?.motherName || "",
    rg: existingPerson?.rg || "",
    cpf: existingPerson?.cpf || "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePersonFound = (person: any) => {
    setFormData({
      name: person.name,
      motherName: person.motherName,
      rg: person.rg,
      cpf: person.cpf,
    });
    
    if (person.pessoas?.[0]?.dados?.foto) {
      setPhotos([person.pessoas[0].dados.foto]);
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
    <form onSubmit={handleSubmit} className="space-y-6 p-4 max-w-2xl mx-auto">
      <div className="space-y-6 rounded-lg bg-gradient-to-b from-[#1A1F35]/90 to-[#2A2F45]/90 
                    backdrop-blur-sm p-6 shadow-xl animate-fade-in">
        <PersonSearch onPersonFound={handlePersonFound} />
        
        <div className="space-y-6 animate-fade-in">
          <PersonalInfoForm formData={formData} onChange={handleChange} />
          <PhotoCapture photos={photos} onPhotosChange={setPhotos} />
        </div>

        <div className="flex justify-end gap-4 pt-4 animate-fade-in">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            className="bg-[#1A1F35]/80 text-white border-[#2A2F45] hover:bg-[#2A2F45]
                     backdrop-blur-sm transition-all duration-300"
          >
            Cancelar
          </Button>
          <Button 
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 transition-all duration-300"
          >
            Salvar
          </Button>
        </div>
      </div>
    </form>
  );
};