import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, User, FileText, MapPin, Calendar, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RelatedApproaches } from "@/components/RelatedApproaches";
import { indexedDBService } from "@/services/indexedDB";
import { toast } from "sonner";
import { Person } from "@/types/person";

const PersonProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [person, setPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPerson = async () => {
      if (!id) return;
      try {
        const approaches = await indexedDBService.getApproaches();
        let foundPerson = null;
        
        for (const approach of approaches) {
          if (approach.pessoas) {
            foundPerson = approach.pessoas.find(p => p.id === id);
            if (foundPerson) {
              setPerson(foundPerson);
              break;
            }
          }
        }
        
        if (!foundPerson) {
          toast.error("Pessoa não encontrada");
          navigate("/");
        }
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
        toast.error("Erro ao carregar os dados do perfil");
      } finally {
        setLoading(false);
      }
    };

    loadPerson();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
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
      <header className="bg-gray-800 text-white sticky top-0 z-10 shadow-md">
        <div className="container mx-auto py-6">
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

      <main className="container mx-auto py-8">
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden">
              {person.dados.profilePhoto ? (
                <img
                  src={person.dados.profilePhoto}
                  alt={person.dados.nome}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white text-3xl">
                  {person.dados.nome.charAt(0)}
                </div>
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{person.dados.nome}</h1>
              <div className="text-gray-600 mt-1">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Data de Nascimento: {person.dados.dataNascimento}</span>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate(`/edit-person/${id}`)}
              className="flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Editar Perfil
            </Button>
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
                  <p>{person.dados.nomeMae}</p>
                </div>
                <div>
                  <span className="font-medium">Nome do Pai:</span>
                  <p>{person.dados.nomePai}</p>
                </div>
                <div>
                  <span className="font-medium">RG:</span>
                  <p>{person.dados.rg}</p>
                </div>
                <div>
                  <span className="font-medium">CPF:</span>
                  <p>{person.dados.cpf}</p>
                </div>
                <div className="md:col-span-2">
                  <span className="font-medium">Endereço:</span>
                  <p className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {`${person.endereco.rua}, ${person.endereco.numero} - ${person.endereco.bairro}`}
                    {person.endereco.complemento && ` (${person.endereco.complemento})`}
                  </p>
                </div>
              </div>
            </section>

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