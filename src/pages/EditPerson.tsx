import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ApproachedPersonForm } from "@/components/ApproachedPersonForm";
import { indexedDBService } from "@/services/indexedDB";
import { toast } from "sonner";
import { Person } from "@/types/person";

const EditPerson = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [person, setPerson] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPerson = async () => {
      if (!id) return;
      try {
        console.log("Loading person data for ID:", id);
        const approaches = await indexedDBService.getApproaches();
        let foundPerson = null;
        
        for (const approach of approaches) {
          if (approach.pessoas) {
            foundPerson = approach.pessoas.find(p => p.id === id);
            if (foundPerson) {
              console.log("Found person:", foundPerson);
              setPerson({
                id: foundPerson.id,
                name: foundPerson.dados.nome,
                motherName: foundPerson.dados.nomeMae,
                rg: foundPerson.dados.rg,
                cpf: foundPerson.dados.cpf,
                profilePhoto: foundPerson.dados.profilePhoto,
                endereco: foundPerson.endereco
              });
              break;
            }
          }
        }
        
        if (!foundPerson) {
          console.log("Person not found");
          toast.error("Pessoa não encontrada");
          navigate("/");
        }
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Erro ao carregar os dados");
      } finally {
        setLoading(false);
      }
    };

    loadPerson();
  }, [id, navigate]);

  const handleSave = async (updatedPerson: any) => {
    try {
      console.log("Saving updated person:", updatedPerson);
      const approaches = await indexedDBService.getApproaches();
      
      for (const approach of approaches) {
        if (approach.pessoas) {
          const personIndex = approach.pessoas.findIndex(p => p.id === id);
          if (personIndex !== -1) {
            approach.pessoas[personIndex] = {
              ...approach.pessoas[personIndex],
              dados: {
                ...approach.pessoas[personIndex].dados,
                nome: updatedPerson.name,
                nomeMae: updatedPerson.motherName,
                rg: updatedPerson.rg,
                cpf: updatedPerson.cpf,
                fotos: updatedPerson.photos,
                profilePhoto: updatedPerson.photos.find((p: Photo) => p.isPerfil)?.url
              },
              endereco: updatedPerson.endereco
            };
            
            await indexedDBService.updateApproach(approach);
            console.log("Person data updated successfully");
            toast.success("Dados atualizados com sucesso");
            navigate(`/person/${id}`);
            return;
          }
        }
      }
      
      console.error("Could not update person data");
      toast.error("Não foi possível atualizar os dados");
    } catch (error) {
      console.error("Error updating data:", error);
      toast.error("Erro ao atualizar os dados");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="container mx-auto max-w-4xl">
        {person && (
          <ApproachedPersonForm
            existingPerson={person}
            onSave={handleSave}
            onCancel={() => navigate(`/person/${id}`)}
          />
        )}
      </div>
    </div>
  );
};

export default EditPerson;