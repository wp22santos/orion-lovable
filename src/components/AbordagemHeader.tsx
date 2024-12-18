import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const AbordagemHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-r from-purple-500/90 to-blue-500/90 backdrop-blur-sm fixed top-0 left-0 right-0 z-50">
      <div className="max-w-3xl mx-auto">
        <div className="h-16 flex items-center justify-between px-4">
          <Button
            variant="ghost"
            className="text-white hover:text-white/80 transition-colors"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <h1 className="text-lg font-medium text-white">Nova Abordagem</h1>
          <div className="w-10" />
        </div>
      </div>
    </div>
  );
};