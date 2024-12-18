import { Camera, User } from "lucide-react";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface PhotoCaptureProps {
  photos: string[];
  onPhotosChange: (photos: string[]) => void;
  onProfilePhotoChange?: (photoUrl: string) => void;
}

export const PhotoCapture = ({ photos, onPhotosChange, onProfilePhotoChange }: PhotoCaptureProps) => {
  const { toast } = useToast();
  const [selectedProfilePhoto, setSelectedProfilePhoto] = useState<string | null>(null);

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

        onPhotosChange([...photos, ...newPhotos]);
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

  const handleSetProfilePhoto = (photoUrl: string) => {
    setSelectedProfilePhoto(photoUrl);
    if (onProfilePhotoChange) {
      onProfilePhotoChange(photoUrl);
    }
    toast({
      title: "Foto de perfil definida",
      description: "A foto foi definida como foto de perfil.",
    });
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
        Adicionar Fotos
      </Button>

      {photos.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {photos.map((photo, index) => (
            <div key={index} className="relative group">
              <img
                src={photo}
                alt={`Foto ${index + 1}`}
                className={`aspect-square object-cover rounded-lg transition-all duration-300 
                          ${selectedProfilePhoto === photo ? 'ring-2 ring-blue-500' : ''}`}
              />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => handleSetProfilePhoto(photo)}
                className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 
                         transition-opacity duration-300 bg-white/90 hover:bg-white"
              >
                <User className="w-4 h-4 mr-1" />
                {selectedProfilePhoto === photo ? 'Foto de Perfil' : 'Definir como Perfil'}
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};