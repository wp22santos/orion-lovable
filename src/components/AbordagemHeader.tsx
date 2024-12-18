import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const AbordagemHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white/80 border-b border-gray-100 sticky top-0 z-10 backdrop-blur-sm shadow-sm">
      <div className="max-w-3xl mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          <Button
            variant="ghost"
            className="text-gray-600 hover:text-gray-900 transition-colors"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <h1 className="text-lg font-medium text-gray-900">Nova Abordagem</h1>
          <div className="w-10" /> {/* Espaçador para centralizar o título */}
        </div>
      </div>
    </div>
  );
};