import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export interface VehicleInfo {
  plate: string;
  brand: string;
  color: string;
  observations: string;
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#E1E2E5]">Placa</label>
          <Input
            placeholder="ABC-1234"
            value={vehicle.plate}
            onChange={(e) => handleChange("plate", e.target.value)}
            className="bg-[#1A1F35] border-[#2A2F45] text-[#E1E2E5]"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#E1E2E5]">Marca/Modelo</label>
          <Input
            placeholder="Ex: Fiat Uno"
            value={vehicle.brand}
            onChange={(e) => handleChange("brand", e.target.value)}
            className="bg-[#1A1F35] border-[#2A2F45] text-[#E1E2E5]"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#E1E2E5]">Cor</label>
          <Input
            placeholder="Ex: Prata"
            value={vehicle.color}
            onChange={(e) => handleChange("color", e.target.value)}
            className="bg-[#1A1F35] border-[#2A2F45] text-[#E1E2E5]"
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#E1E2E5]">Observações do Veículo</label>
        <Textarea
          placeholder="Observações sobre o veículo..."
          value={vehicle.observations}
          onChange={(e) => handleChange("observations", e.target.value)}
          className="bg-[#1A1F35] border-[#2A2F45] text-[#E1E2E5]"
        />
      </div>
    </div>
  );
};