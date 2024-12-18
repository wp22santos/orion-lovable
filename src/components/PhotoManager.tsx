import { useState } from "react";
import { Camera, X } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";

interface Photo {
  url: string;
  isPerfil: boolean;
}

interface PhotoManagerProps {
  photos: Photo[];
  onChange: (photos: Photo[]) => void;
  maxPhotos?: number;
}

export const PhotoManager = ({ photos = [], onChange, maxPhotos = 10 }: PhotoManagerProps) => {
  const [isCapturing, setIsCapturing] = useState(false);

  const handleCapture = async () => {
    try {
      if (photos.length >= maxPhotos) {
        toast.error(`Limite máximo de ${maxPhotos} fotos atingido`);
        return;
      }

      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.capture = 'environment';

      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;

        try {
          setIsCapturing(true);
          const reader = new FileReader();
          
          reader.onloadend = () => {
            const newPhoto = {
              url: reader.result as string,
              isPerfil: photos.length === 0 // Primeira foto é automaticamente definida como perfil
            };
            
            const updatedPhotos = [...photos, newPhoto];
            onChange(updatedPhotos);
            toast.success("Foto adicionada com sucesso");
          };

          reader.readAsDataURL(file);
        } catch (error) {
          console.error("Erro ao processar foto:", error);
          toast.error("Erro ao processar a foto");
        } finally {
          setIsCapturing(false);
        }
      };

      input.click();
    } catch (error) {
      console.error("Erro ao capturar foto:", error);
      toast.error("Erro ao capturar a foto");
      setIsCapturing(false);
    }
  };

  const setAsProfile = (index: number) => {
    const updatedPhotos = photos.map((photo, i) => ({
      ...photo,
      isPerfil: i === index
    }));
    onChange(updatedPhotos);
    toast.success("Foto de perfil atualizada");
  };

  const removePhoto = (index: number) => {
    const updatedPhotos = photos.filter((_, i) => i !== index);
    // Se removeu a foto de perfil, define a primeira foto como perfil
    if (photos[index].isPerfil && updatedPhotos.length > 0) {
      updatedPhotos[0].isPerfil = true;
    }
    onChange(updatedPhotos);
    toast.success("Foto removida");
  };

  return (
    <div className="space-y-4">
      <Button
        type="button"
        variant="outline"
        onClick={handleCapture}
        disabled={isCapturing}
        className="w-full bg-white hover:bg-gray-50 border-gray-200"
      >
        <Camera className="mr-2 h-4 w-4" />
        {isCapturing ? "Processando..." : `Capturar Foto (${photos.length}/${maxPhotos})`}
      </Button>

      {photos.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {photos.map((photo, index) => (
            <div key={index} className="relative group">
              <img
                src={photo.url}
                alt={`Foto ${index + 1}`}
                className={`w-full h-32 object-cover rounded-lg border-2 
                          ${photo.isPerfil ? 'border-purple-500' : 'border-gray-200'}`}
              />
              
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 
                            transition-opacity duration-200 rounded-lg flex items-center justify-center gap-2">
                {!photo.isPerfil && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setAsProfile(index)}
                    className="text-white hover:bg-white/20"
                  >
                    Definir como Perfil
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removePhoto(index)}
                  className="text-white hover:bg-white/20"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              {photo.isPerfil && (
                <span className="absolute bottom-2 right-2 bg-purple-500 text-white px-2 py-1 
                               rounded-full text-xs">
                  Perfil
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};