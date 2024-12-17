import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { indexedDBService } from "@/services/indexedDB";
import { useNavigate } from "react-router-dom";
import { Users } from "lucide-react";

interface RelatedApproach {
  id: string;
  name: string;
  date: string;
  location: string;
  companions?: string[];
}

interface RelatedApproachesProps {
  personId: string;
  currentApproachId?: string;
}

export const RelatedApproaches = ({ personId, currentApproachId }: RelatedApproachesProps) => {
  const [relatedApproaches, setRelatedApproaches] = useState<RelatedApproach[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadRelatedApproaches = async () => {
      try {
        console.log("Carregando abordagens relacionadas para:", personId);
        const approaches = await indexedDBService.getApproaches();
        
        // Filtra abordagens onde a pessoa aparece como acompanhante
        const related = approaches.filter(approach => 
          approach.id !== currentApproachId && 
          (approach.companions?.includes(personId) || 
           approach.id === personId)
        );

        console.log("Abordagens relacionadas encontradas:", related);
        setRelatedApproaches(related);
      } catch (error) {
        console.error("Erro ao carregar abordagens relacionadas:", error);
      } finally {
        setLoading(false);
      }
    };

    loadRelatedApproaches();
  }, [personId, currentApproachId]);

  if (loading) {
    return <div className="text-center py-4">Carregando relacionamentos...</div>;
  }

  if (relatedApproaches.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        Nenhuma abordagem relacionada encontrada
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg flex items-center gap-2">
        <Users className="w-5 h-5" />
        Abordagens Relacionadas
      </h3>
      <div className="grid gap-4 md:grid-cols-2">
        {relatedApproaches.map((approach) => (
          <Card
            key={approach.id}
            className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate(`/approach/${approach.id}`)}
          >
            <div className="space-y-2">
              <h4 className="font-medium">{approach.name}</h4>
              <div className="text-sm text-gray-600">
                <p>{approach.date}</p>
                <p>{approach.location}</p>
                {approach.companions && approach.companions.length > 0 && (
                  <p className="text-xs mt-1">
                    Acompanhantes: {approach.companions.join(", ")}
                  </p>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};