import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PersonalInfoForm } from "./PersonalInfoForm";
import { useToast } from "@/hooks/use-toast";
import { Camera } from "lucide-react";

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
}

export const ApproachedPersonForm = ({ onSave, onCancel }: ApproachedPersonFormProps) => {
  const { toast } = useToast();
  const [photos, setPhotos] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    motherName: "",
    rg: "",
    cpf: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
      id: crypto.randomUUID(),
      ...formData,
      photos,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PersonalInfoForm formData={formData} onChange={handleChange} />

      <div className="space-y-4">
        <Button
          type="button"
          variant="outline"
          className="w-full"
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
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">Salvar</Button>
      </div>
    </form>
  );
};