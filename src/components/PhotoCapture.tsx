import { Camera } from "lucide-react";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface PhotoCaptureProps {
  onPhotoCapture: (photoUrl: string) => void;
  currentPhoto?: string;
}

export const PhotoCapture = ({ onPhotoCapture, currentPhoto }: PhotoCaptureProps) => {
  const { toast } = useToast();
  const [photo, setPhoto] = useState<string | undefined>(currentPhoto);

  const handlePhotoCapture = async () => {
    try {
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
          setPhoto(photoUrl);
          onPhotoCapture(photoUrl);
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
        {photo ? 'Alterar Foto' : 'Capturar Foto'}
      </Button>

      {photo && (
        <div className="relative">
          <img
            src={photo}
            alt="Foto capturada"
            className="w-full h-48 object-cover rounded-lg"
          />
        </div>
      )}
    </div>
  );
};