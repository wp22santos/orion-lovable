import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PersonalInfoForm } from "./PersonalInfoForm";
import { PersonSearch } from "./PersonSearch";
import { PhotoManager } from "./PhotoManager";
import { Card } from "@/components/ui/card";
import { X } from "lucide-react";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { ApproachedPerson, Endereco, Photo } from "@/types/person";

interface ApproachedPersonFormProps {
  onSave: (person: ApproachedPerson) => void;
  onCancel: () => void;
  existingPerson?: ApproachedPerson;
}

export const ApproachedPersonForm = ({ onSave, onCancel, existingPerson }: ApproachedPersonFormProps) => {
  const [formData, setFormData] = useState({
    name: existingPerson?.name || "",
    motherName: existingPerson?.motherName || "",
    rg: existingPerson?.rg || "",
    cpf: existingPerson?.cpf || "",
  });
  
  const [photos, setPhotos] = useState<Photo[]>(existingPerson?.photos || []);
  const [endereco, setEndereco] = useState<Endereco>(existingPerson?.endereco || {
    rua: "",
    numero: "",
    bairro: "",
    complemento: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleEnderecoChange = (field: string, value: string) => {
    setEndereco(prev => ({ ...prev, [field]: value }));
  };

  const handlePersonFound = (person: any) => {
    setFormData({
      name: person.name,
      motherName: person.motherName,
      rg: person.rg,
      cpf: person.cpf,
    });
    
    if (person.endereco) {
      setEndereco(person.endereco);
    }

    if (person.photos) {
      setPhotos(person.photos);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name) {
      toast.error("O nome é obrigatório");
      return;
    }

    if (!photos.some(p => p.isPerfil)) {
      toast.error("É necessário definir uma foto de perfil");
      return;
    }

    onSave({
      id: existingPerson?.id || crypto.randomUUID(),
      ...formData,
      photos,
      endereco,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <form onSubmit={handleSubmit}>
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
                <h4 className="font-medium text-gray-700">Endereço</h4>
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                  <div className="md:col-span-4">
                    <Input
                      placeholder="Rua"
                      value={endereco.rua}
                      onChange={(e) => handleEnderecoChange("rua", e.target.value)}
                      className="bg-white/50"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Input
                      placeholder="Número"
                      value={endereco.numero}
                      onChange={(e) => handleEnderecoChange("numero", e.target.value)}
                      className="bg-white/50"
                    />
                  </div>
                  <div className="md:col-span-4">
                    <Input
                      placeholder="Bairro"
                      value={endereco.bairro}
                      onChange={(e) => handleEnderecoChange("bairro", e.target.value)}
                      className="bg-white/50"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Input
                      placeholder="Complemento"
                      value={endereco.complemento}
                      onChange={(e) => handleEnderecoChange("complemento", e.target.value)}
                      className="bg-white/50"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-gray-700">Fotos</h4>
                <PhotoManager 
                  photos={photos}
                  onChange={setPhotos}
                  maxPhotos={10}
                />
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
                Adicionar à Abordagem
              </Button>
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
};