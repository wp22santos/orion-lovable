import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PersonalInfoForm } from "./PersonalInfoForm";
import { LocationForm } from "./LocationForm";
import { VehicleForm, type VehicleInfo } from "./VehicleForm";

interface ApproachFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export const ApproachForm = ({ isOpen, onClose, onSubmit }: ApproachFormProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    motherName: "",
    rg: "",
    cpf: "",
    address: "",
    observations: "",
    companions: "",
    imageUrl: "",
    vehicle: {
      plate: "",
      brand: "",
      color: "",
      observations: "",
    } as VehicleInfo,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      companions: formData.companions
        ? formData.companions.split(",").map((c) => c.trim())
        : [],
    });
    onClose();
    toast({
      title: "Abordagem salva",
      description: "Os dados foram salvos com sucesso.",
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleVehicleChange = (vehicle: VehicleInfo) => {
    setFormData((prev) => ({ ...prev, vehicle }));
  };

  const handleImageCapture = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, imageUrl: reader.result as string }));
        toast({
          title: "Foto capturada",
          description: "A foto foi adicionada com sucesso.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white">
        <DialogHeader>
          <DialogTitle className="text-police-dark">Nova Abordagem</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-police-light p-6 rounded-lg border border-gray-200">
            <PersonalInfoForm formData={formData} onChange={handleChange} />
          </div>

          <div className="bg-police-light p-6 rounded-lg border border-gray-200">
            <LocationForm formData={formData} onChange={handleChange} />
          </div>
          
          <div className="bg-police-light p-6 rounded-lg border border-gray-200">
            <h3 className="text-sm font-medium text-police-dark mb-4">Informações do Veículo</h3>
            <VehicleForm
              vehicle={formData.vehicle}
              onChange={handleVehicleChange}
            />
          </div>

          <div className="bg-police-light p-6 rounded-lg border border-gray-200">
            <label htmlFor="observations" className="text-sm font-medium text-police-dark">
              Observações
            </label>
            <Textarea
              id="observations"
              name="observations"
              value={formData.observations}
              onChange={(e) => handleChange("observations", e.target.value)}
              rows={4}
              className="mt-2"
            />
          </div>

          <div className="space-y-4">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              capture="environment"
              onChange={handleImageChange}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              className="w-full bg-white hover:bg-gray-50 border-gray-200"
              onClick={handleImageCapture}
            >
              <Camera className="mr-2 h-4 w-4" />
              Capturar Foto
            </Button>
            {formData.imageUrl && (
              <div className="relative w-32 h-32 mx-auto">
                <img
                  src={formData.imageUrl}
                  alt="Foto capturada"
                  className="w-full h-full object-cover rounded-lg border border-gray-200"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="bg-white hover:bg-gray-50 text-police-dark border-gray-200"
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              className="bg-police-primary hover:bg-police-dark text-white"
            >
              Salvar Abordagem
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};