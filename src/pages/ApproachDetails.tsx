import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { indexedDBService, type Approach } from "@/services/indexedDB";

const ApproachDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [approach, setApproach] = useState<Approach | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadApproach = async () => {
      if (!id) return;
      try {
        const data = await indexedDBService.getApproachById(id);
        setApproach(data);
      } catch (error) {
        console.error("Error loading approach:", error);
      } finally {
        setLoading(false);
      }
    };

    loadApproach();
  }, [id]);

  if (loading) {
    return <div className="container py-8">Carregando...</div>;
  }

  if (!approach) {
    return <div className="container py-8">Abordagem não encontrada</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-police-primary text-white sticky top-0 z-10 shadow-md">
        <div className="container py-6">
          <Button
            variant="ghost"
            className="text-white hover:text-white/80"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>
      </header>

      <main className="container py-8">
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden">
              {approach.imageUrl ? (
                <img
                  src={approach.imageUrl}
                  alt={approach.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-police-primary text-white text-2xl">
                  {approach.name.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{approach.name}</h1>
              <div className="text-gray-600">RG: {approach.rg}</div>
              <div className="text-gray-600">CPF: {approach.cpf}</div>
            </div>
          </div>

          <div className="grid gap-6">
            <div>
              <h2 className="font-semibold mb-2">Informações Pessoais</h2>
              <div className="space-y-2 text-gray-600">
                <div>Nome da Mãe: {approach.motherName}</div>
                <div>Endereço: {approach.address}</div>
              </div>
            </div>

            <div>
              <h2 className="font-semibold mb-2">Detalhes da Abordagem</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{approach.date}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{approach.location}</span>
                </div>
                {approach.companions && approach.companions.length > 0 && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>{approach.companions.join(", ")}</span>
                  </div>
                )}
              </div>
            </div>

            {approach.observations && (
              <div>
                <h2 className="font-semibold mb-2">Observações</h2>
                <p className="text-gray-600">{approach.observations}</p>
              </div>
            )}
          </div>
        </Card>
      </main>
    </div>
  );
};

export default ApproachDetails;