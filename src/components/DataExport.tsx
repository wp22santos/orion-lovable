import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { indexedDBService } from "@/services/indexedDB";

export const DataExport = () => {
  const { toast } = useToast();

  const handleExport = async () => {
    try {
      console.log("Iniciando exportação de dados...");
      const approaches = await indexedDBService.getApproaches();
      console.log("Dados recuperados:", approaches);

      const dataStr = JSON.stringify(approaches, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = window.URL.createObjectURL(dataBlob);
      
      const now = new Date().toISOString().split('T')[0];
      const link = document.createElement('a');
      link.href = url;
      link.download = `registro-abordagens-${now}.json`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Exportação concluída",
        description: "Os dados foram exportados com sucesso.",
      });
    } catch (error) {
      console.error("Erro na exportação:", error);
      toast({
        title: "Erro na exportação",
        description: "Não foi possível exportar os dados.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      onClick={handleExport}
      variant="outline"
      className="w-full md:w-auto flex items-center gap-2"
    >
      <Download className="w-4 h-4" />
      Exportar Dados
    </Button>
  );
};