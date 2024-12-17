import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, User, FileText, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RelatedApproaches } from "@/components/RelatedApproaches";
import { indexedDBService, type Approach } from "@/services/indexedDB";
import { useToast } from "@/hooks/use-toast";

const PersonProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [person, setPerson] = useState<Approach | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPerson = async () => {
      if (!id) return;
      try {
        console.log("Carregando perfil da pessoa:", id);
        const data = await indexedDBService.getApproachById(id);
        if (!data) {
          toast({
            title: "Erro",
            description: "Perfil não encontrado",
            variant: "destructive",
          });
          navigate("/");
          return;
        }
        setPerson(data);
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
        toast({
          title: "Erro",
          description: "Erro ao carregar os dados do perfil",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadPerson();
  }, [id, navigate, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">Carregando...</div>
      </div>
    );
  }

  if (!person) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">Perfil não encontrado</div>
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
              {person.imageUrl ? (
                <img
                  src={person.imageUrl}
                  alt={person.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-police-primary text-white text-3xl">
                  {person.name.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{person.name}</h1>
              <div className="text-gray-600 mt-1">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Última abordagem: {person.date}</span>
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
                  <p>{person.motherName}</p>
                </div>
                <div>
                  <span className="font-medium">RG:</span>
                  <p>{person.rg}</p>
                </div>
                <div>
                  <span className="font-medium">CPF:</span>
                  <p>{person.cpf}</p>
                </div>
                <div>
                  <span className="font-medium">Endereço:</span>
                  <p className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {person.address}
                  </p>
                </div>
              </div>
            </section>

            {person.observations && (
              <section>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Observações
                </h2>
                <p className="text-gray-600 whitespace-pre-wrap">
                  {person.observations}
                </p>
              </section>
            )}

            <section>
              <RelatedApproaches personId={id!} />
            </section>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default PersonProfile;