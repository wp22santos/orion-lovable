import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PersonalInfoForm } from "./PersonalInfoForm";
import { PersonSearch } from "./PersonSearch";
import { PhotoCapture } from "./PhotoCapture";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";

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
    if (!formData.name) {
      toast({
        title: "Erro",
        description: "O nome é obrigatório.",
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
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
      <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 p-6 shadow-lg rounded-2xl">
        <div className="space-y-6">
          <PersonSearch onPersonFound={handlePersonFound} />
          
          <div className="space-y-6">
            <PersonalInfoForm formData={formData} onChange={handleChange} />
            <PhotoCapture photos={photos} onPhotosChange={setPhotos} />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              className="bg-white hover:bg-gray-50 text-gray-900 border-gray-200"
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Salvar
            </Button>
          </div>
        </div>
      </Card>
    </form>
  );
};