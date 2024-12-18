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
    <div className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium text-gray-700">
          Nome Completo *
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={(e) => onChange("name", e.target.value)}
            className="pl-11 bg-white/50 border-gray-200 focus:border-purple-500 
                     h-12 text-lg rounded-xl"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="motherName" className="text-sm font-medium text-gray-700">
          Nome da Mãe
        </label>
        <Input
          id="motherName"
          name="motherName"
          value={formData.motherName}
          onChange={(e) => onChange("motherName", e.target.value)}
          className="bg-white/50 border-gray-200 focus:border-purple-500 
                   h-12 text-lg rounded-xl"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="rg" className="text-sm font-medium text-gray-700">
            RG
          </label>
          <Input
            id="rg"
            name="rg"
            value={formData.rg}
            onChange={(e) => onChange("rg", e.target.value)}
            className="bg-white/50 border-gray-200 focus:border-purple-500 
                     h-12 text-lg rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="cpf" className="text-sm font-medium text-gray-700">
            CPF
          </label>
          <Input
            id="cpf"
            name="cpf"
            value={formData.cpf}
            onChange={(e) => onChange("cpf", e.target.value)}
            className="bg-white/50 border-gray-200 focus:border-purple-500 
                     h-12 text-lg rounded-xl"
          />
        </div>
      </div>
    </div>
  );
};