import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, MapPin, Users, User, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { indexedDBService, type Approach } from "@/services/indexedDB";
import { useToast } from "@/hooks/use-toast";

const ApproachDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [approach, setApproach] = useState<Approach | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadApproach = async () => {
      if (!id) return;
      try {
        const data = await indexedDBService.getApproachById(id);
        if (!data) {
          toast({
            title: "Erro",
            description: "Abordagem não encontrada",
            variant: "destructive",
          });
          navigate("/");
          return;
        }
        setApproach(data);
      } catch (error) {
        console.error("Error loading approach:", error);
        toast({
          title: "Erro",
          description: "Erro ao carregar os dados da abordagem",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadApproach();
  }, [id, navigate, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">Carregando...</div>
      </div>
    );
  }

  if (!approach) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">Abordagem não encontrada</div>
      </div>
    );
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
            <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden">
              {approach.imageUrl ? (
                <img
                  src={approach.imageUrl}
                  alt={approach.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-police-primary text-white text-3xl">
                  {approach.name.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{approach.name}</h1>
              <div className="text-gray-600 mt-1">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{approach.date}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6">
            <section>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Informações Pessoais
              </h2>
              <div className="grid md:grid-cols-2 gap-4 text-gray-600">
                <div>
                  <span className="font-medium">Nome da Mãe:</span>
                  <p>{approach.motherName}</p>
                </div>
                <div>
                  <span className="font-medium">RG:</span>
                  <p>{approach.rg}</p>
                </div>
                <div>
                  <span className="font-medium">CPF:</span>
                  <p>{approach.cpf}</p>
                </div>
                <div>
                  <span className="font-medium">Endereço:</span>
                  <p className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {approach.address}
                  </p>
                </div>
              </div>
            </section>

            {approach.companions && approach.companions.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Acompanhantes
                </h2>
                <div className="text-gray-600">
                  {approach.companions.map((companion, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 py-1"
                    >
                      <User className="w-4 h-4" />
                      <span>{companion}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {approach.observations && (
              <section>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Observações
                </h2>
                <p className="text-gray-600 whitespace-pre-wrap">
                  {approach.observations}
                </p>
              </section>
            )}
          </div>
        </Card>
      </main>
    </div>
  );
};

export default ApproachDetails;