import { Input } from "@/components/ui/input";
import { User } from "lucide-react";

interface PersonalInfoFormProps {
  formData: {
    name: string;
    motherName: string;
    rg: string;
    cpf: string;
  };
  onChange: (field: string, value: string) => void;
}

export const PersonalInfoForm = ({ formData, onChange }: PersonalInfoFormProps) => {
  return (
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
            onChange={(e) => onChange("name", e.target.value)}
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
          onChange={(e) => onChange("motherName", e.target.value)}
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
          onChange={(e) => onChange("rg", e.target.value)}
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
          onChange={(e) => onChange("cpf", e.target.value)}
          required
        />
      </div>
    </div>
  );
};