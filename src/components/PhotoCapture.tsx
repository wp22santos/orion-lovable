import { Camera } from "lucide-react";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";

interface PhotoCaptureProps {
  onPhotoCapture: (photos: string[], profilePhotoIndex: number) => void;
  currentPhotos?: string[];
  currentProfilePhotoIndex?: number;
}

export const PhotoCapture = ({ onPhotoCapture, currentPhotos = [], currentProfilePhotoIndex = 0 }: PhotoCaptureProps) => {
  const { toast } = useToast();
  const [photos, setPhotos] = useState<string[]>(currentPhotos);
  const [selectedProfileIndex, setSelectedProfileIndex] = useState<number>(currentProfilePhotoIndex);

  const handlePhotoCapture = async () => {
    try {
      if (photos.length >= 10) {
        toast({
          title: "Limite atingido",
          description: "Você já atingiu o limite de 10 fotos.",
          variant: "destructive",
        });
        return;
      }

      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.capture = 'environment';

      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
          const photoUrl = reader.result as string;
          const newPhotos = [...photos, photoUrl];
          setPhotos(newPhotos);
          
          // Se for a primeira foto, automaticamente define como foto de perfil
          if (newPhotos.length === 1) {
            setSelectedProfileIndex(0);
          }
          
          onPhotoCapture(newPhotos, selectedProfileIndex);
          toast({
            title: "Foto capturada",
            description: "A foto foi adicionada com sucesso.",
          });
        };
        reader.readAsDataURL(file);
      };

      input.click();
    } catch (error) {
      console.error("Erro ao capturar foto:", error);
      toast({
        title: "Erro",
        description: "Não foi possível capturar a foto.",
        variant: "destructive",
      });
    }
  };

  const handleProfileSelection = (index: number) => {
    setSelectedProfileIndex(index);
    onPhotoCapture(photos, index);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <Button
        type="button"
        variant="outline"
        onClick={handlePhotoCapture}
        className="w-full bg-[#1A1F35]/80 text-white border-[#2A2F45] hover:bg-[#2A2F45]
                 backdrop-blur-sm transition-all duration-300 group"
      >
        <Camera className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
        {photos.length > 0 ? `Adicionar Foto (${photos.length}/10)` : 'Capturar Foto'}
      </Button>

      {photos.length > 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {photos.map((photo, index) => (
              <div key={index} className="relative">
                <img
                  src={photo}
                  alt={`Foto ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <RadioGroup
                  value={selectedProfileIndex.toString()}
                  onValueChange={(value) => handleProfileSelection(parseInt(value))}
                  className="absolute bottom-2 right-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={index.toString()}
                      id={`photo-${index}`}
                      className="bg-white/80"
                    />
                    <Label htmlFor={`photo-${index}`} className="text-white text-xs">
                      Foto de perfil
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};