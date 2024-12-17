import { Input } from "@/components/ui/input";
import { MapPin, Users } from "lucide-react";

interface LocationFormProps {
  formData: {
    address: string;
    companions: string;
  };
  onChange: (field: string, value: string) => void;
}

export const LocationForm = ({ formData, onChange }: LocationFormProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="address" className="text-sm font-medium">
          Endereço *
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            id="address"
            name="address"
            value={formData.address}
            onChange={(e) => onChange("address", e.target.value)}
            className="pl-10"
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="companions" className="text-sm font-medium">
          Acompanhantes
        </label>
        <div className="relative">
          <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            id="companions"
            name="companions"
            value={formData.companions}
            onChange={(e) => onChange("companions", e.target.value)}
            className="pl-10"
            placeholder="Nomes separados por vírgula"
          />
        </div>
      </div>
    </div>
  );
};