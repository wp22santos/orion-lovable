import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const AbordagemHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#141829] border-b border-[#2A2F45] sticky top-0 z-10">
      <div className="max-w-3xl mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          <Button
            variant="ghost"
            className="text-[#E1E2E5]"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <h1 className="text-[#E1E2E5] font-medium">Nova Abordagem</h1>
        </div>
      </div>
    </div>
  );
};