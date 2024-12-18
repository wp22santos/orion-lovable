import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PersonalInfoForm } from "./PersonalInfoForm";
import { PersonSearch } from "./PersonSearch";
import { PhotoCapture } from "./PhotoCapture";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { X, Camera } from "lucide-react";

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
        description: "O nome é obrigatório",
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
      <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 p-6 rounded-xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-medium text-police-dark">Dados do Abordado</h3>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onCancel}
            className="rounded-full hover:bg-gray-100"
          >
            <X className="h-5 w-5 text-gray-500" />
          </Button>
        </div>
        
        <div className="space-y-6">
          <PersonSearch onPersonFound={handlePersonFound} />
          
          <div className="space-y-6">
            <PersonalInfoForm formData={formData} onChange={handleChange} />
            
            <div className="space-y-4">
              <PhotoCapture photos={photos} onPhotosChange={setPhotos} />
              {photos.length === 0 && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full bg-white hover:bg-gray-50 border-gray-200 h-12"
                  onClick={() => document.getElementById('photo-input')?.click()}
                >
                  <Camera className="mr-2 h-5 w-5" />
                  Capturar Foto
                </Button>
              )}
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-gray-200">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              className="flex-1 bg-white hover:bg-gray-50 text-police-dark border-gray-200 h-12"
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              className="flex-1 bg-police-primary hover:bg-police-dark text-white h-12"
            >
              Adicionar
            </Button>
          </div>
        </div>
      </Card>
    </form>
  );
};