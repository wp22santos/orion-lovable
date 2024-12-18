import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SaveButtonProps {
  onSave: () => void;
  disabled: boolean;
}

export const SaveButton = ({ onSave, disabled }: SaveButtonProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-gray-200">
      <div className="max-w-3xl mx-auto">
        <Button
          onClick={onSave}
          className="w-full bg-police-primary hover:bg-police-dark text-white 
                   py-6 text-lg shadow-lg rounded-xl flex items-center 
                   justify-center gap-2"
          disabled={disabled}
        >
          <Save className="w-5 h-5" />
          Salvar Abordagem
        </Button>
      </div>
    </div>
  );
};