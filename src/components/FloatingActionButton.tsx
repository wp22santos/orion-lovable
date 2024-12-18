import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const FloatingActionButton = () => {
  const navigate = useNavigate();

  return (
    <Button
      onClick={() => navigate("/nova-abordagem")}
      className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg bg-blue-600 hover:bg-blue-700 p-0 flex items-center justify-center"
    >
      <Plus className="h-6 w-6" />
    </Button>
  );
};