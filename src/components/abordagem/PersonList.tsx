import { Users, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ApproachedPerson } from "@/types/person";

interface PersonListProps {
  pessoas: ApproachedPerson[];
  onAddPerson: () => void;
  onEditPerson: (person: ApproachedPerson) => void;
}

export const PersonList = ({ pessoas, onAddPerson, onEditPerson }: PersonListProps) => {
  if (pessoas.length === 0) {
    return (
      <div className="text-center py-8 px-4">
        <Users className="w-12 h-12 mx-auto text-gray-400 mb-3" />
        <p className="text-gray-600 mb-4">
          Nenhuma pessoa adicionada ainda
        </p>
        <Button
          onClick={onAddPerson}
          className="bg-police-primary hover:bg-police-dark text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Pessoa
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3">
        {pessoas.map((person) => (
          <Card 
            key={person.id} 
            className="bg-gray-50/80 p-3 hover:bg-gray-50/90 
                     transition-all duration-200 border border-gray-200 
                     cursor-pointer"
            onClick={() => onEditPerson(person)}
          >
            <div className="flex items-center gap-3">
              {person.photos?.find(p => p.isPerfil)?.url ? (
                <img
                  src={person.photos.find(p => p.isPerfil)?.url}
                  alt="Foto do abordado"
                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                  <Users className="w-6 h-6 text-gray-400" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h3 className="font-medium text-police-dark truncate">
                  {person.name}
                </h3>
                <p className="text-sm text-gray-600 truncate">
                  RG: {person.rg || "Não informado"}
                </p>
                <p className="text-sm text-gray-600 truncate">
                  CPF: {person.cpf || "Não informado"}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      <Button
        onClick={onAddPerson}
        className="w-full bg-police-primary hover:bg-police-dark text-white"
      >
        <Plus className="w-4 h-4 mr-2" />
        Adicionar Outra Pessoa
      </Button>
    </div>
  );
};