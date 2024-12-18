import { Camera } from "lucide-react";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";

interface PhotoCaptureProps {
  photos: string[];
  onPhotosChange: (photos: string[]) => void;
}

export const PhotoCapture = ({ photos, onPhotosChange }: PhotoCaptureProps) => {
  const { toast } = useToast();

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
            <div key={index} className="relative aspect-square rounded-lg overflow-hidden 
                                      hover:scale-105 transition-transform duration-300">
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
  );
};