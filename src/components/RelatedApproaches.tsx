import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { indexedDBService, type Approach } from "@/services/indexedDB";
import { useNavigate } from "react-router-dom";
import { Users, CalendarDays, MapPin } from "lucide-react";

interface RelatedApproachesProps {
  personId: string;
  currentApproachId?: string;
}

export const RelatedApproaches = ({ personId, currentApproachId }: RelatedApproachesProps) => {
  const [relatedApproaches, setRelatedApproaches] = useState<Approach[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadRelatedApproaches = async () => {
      try {
        console.log("Carregando abordagens relacionadas para:", personId);
        const approaches = await indexedDBService.getApproaches();
        console.log("Todas as abordagens:", approaches);
        
        // Primeiro, encontra os dados da pessoa atual
        let targetPerson = null;
        for (const approach of approaches) {
          const person = approach.pessoas?.find(p => p.id === personId);
          if (person) {
            targetPerson = person;
            break;
          }
        }

        if (!targetPerson) {
          console.log("Pessoa não encontrada");
          return;
        }

        // Filtra abordagens onde a pessoa aparece (por ID ou nome)
        const related = approaches.filter(approach => {
          // Verifica se a pessoa está em qualquer posição na lista de pessoas
          return approach.pessoas?.some(p => 
            p.id === personId || 
            p.dados.nome.toLowerCase() === targetPerson?.dados.nome.toLowerCase()
          ) && approach.id !== currentApproachId;
        });

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

  const getCompanionNames = (approach: Approach) => {
    return approach.pessoas
      ?.filter(p => p.id !== personId)
      .map(p => p.dados.nome)
      .join(", ") || "Nenhum acompanhante";
  };

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
            <div className="space-y-4">
              {approach.pessoas && approach.pessoas.length > 0 && (
                <div className="flex -space-x-2 overflow-hidden">
                  {approach.pessoas.slice(0, 3).map((person) => (
                    person.dados.foto ? (
                      <img
                        key={person.id}
                        src={person.dados.foto}
                        alt={person.dados.nome}
                        className="inline-block h-12 w-12 rounded-full ring-2 ring-white object-cover"
                      />
                    ) : (
                      <div
                        key={person.id}
                        className="inline-block h-12 w-12 rounded-full ring-2 ring-white bg-gray-300 flex items-center justify-center text-gray-600"
                      >
                        {person.dados.nome.charAt(0)}
                      </div>
                    )
                  ))}
                </div>
              )}

              <div className="space-y-2">
                <h4 className="font-medium">{approach.name}</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4" />
                    <p>{new Date(approach.date).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <p>{approach.location}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <p className="text-xs">
                      Com: {getCompanionNames(approach)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};