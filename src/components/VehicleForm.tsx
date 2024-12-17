import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface VehicleInfo {
  type: string;
  model: string;
  plate: string;
  observations?: string;
}

interface VehicleFormProps {
  vehicle: VehicleInfo;
  onChange: (vehicle: VehicleInfo) => void;
}

export const VehicleForm = ({ vehicle, onChange }: VehicleFormProps) => {
  const handleChange = (field: keyof VehicleInfo, value: string) => {
    onChange({ ...vehicle, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Tipo do Veículo</label>
        <Select
          value={vehicle.type}
          onValueChange={(value) => handleChange("type", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="car">Carro</SelectItem>
            <SelectItem value="motorcycle">Moto</SelectItem>
            <SelectItem value="bicycle">Bicicleta</SelectItem>
            <SelectItem value="other">Outro</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Marca/Modelo</label>
        <Input
          placeholder="Ex: Fiat Uno"
          value={vehicle.model}
          onChange={(e) => handleChange("model", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Placa</label>
        <Input
          placeholder="Ex: ABC1234"
          value={vehicle.plate}
          onChange={(e) => handleChange("plate", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Observações</label>
        <Input
          placeholder="Observações sobre o veículo"
          value={vehicle.observations || ""}
          onChange={(e) => handleChange("observations", e.target.value)}
        />
      </div>
    </div>
  );
};