import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MapPin, Camera, User, Users } from "lucide-react";

interface ApproachFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export const ApproachForm = ({ isOpen, onClose, onSubmit }: ApproachFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    motherName: "",
    rg: "",
    cpf: "",
    address: "",
    observations: "",
    companions: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nova Abordagem</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Nome Completo *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="motherName" className="text-sm font-medium">
                Nome da Mãe *
              </label>
              <Input
                id="motherName"
                name="motherName"
                value={formData.motherName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="rg" className="text-sm font-medium">
                RG *
              </label>
              <Input
                id="rg"
                name="rg"
                value={formData.rg}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="cpf" className="text-sm font-medium">
                CPF *
              </label>
              <Input
                id="cpf"
                name="cpf"
                value={formData.cpf}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2 col-span-full">
              <label htmlFor="address" className="text-sm font-medium">
                Endereço *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2 col-span-full">
              <label htmlFor="companions" className="text-sm font-medium">
                Acompanhantes
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  id="companions"
                  name="companions"
                  value={formData.companions}
                  onChange={handleChange}
                  className="pl-10"
                  placeholder="Nomes separados por vírgula"
                />
              </div>
            </div>
            <div className="space-y-2 col-span-full">
              <label htmlFor="observations" className="text-sm font-medium">
                Observações
              </label>
              <Textarea
                id="observations"
                name="observations"
                value={formData.observations}
                onChange={handleChange}
                rows={4}
              />
            </div>
            <div className="col-span-full">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => console.log("Implementar captura de foto")}
              >
                <Camera className="mr-2 h-4 w-4" />
                Capturar Foto
              </Button>
            </div>
          </div>
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Salvar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};