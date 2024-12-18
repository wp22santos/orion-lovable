import { Card } from "@/components/ui/card";
import { User, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface PersonalInfoDisplayProps {
  person: {
    id?: string;
    foto: string;
    nome: string;
    dataNascimento: string;
    rg: string;
    cpf: string;
    nomeMae: string;
    nomePai: string;
    endereco?: string;
    profilePhoto?: string;
  };
}

export const PersonalInfoDisplay = ({ person }: PersonalInfoDisplayProps) => {
  const navigate = useNavigate();

  const handleEditClick = () => {
    navigate(`/edit-person/${person.id}`);
  };

  return (
    <Card className="bg-[#141829] border-[#2A2F45] p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          {person.profilePhoto || person.foto ? (
            <img
              src={person.profilePhoto || person.foto}
              alt={person.nome}
              className="w-24 h-24 rounded-full object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-[#2A2F45] flex items-center justify-center">
              <User className="w-12 h-12 text-[#5C5F70]" />
            </div>
          )}
          
          <div className="flex-1 space-y-4">
            <div>
              <h3 className="text-lg font-medium text-[#E1E2E5]">{person.nome}</h3>
              <p className="text-sm text-[#5C5F70]">{person.dataNascimento}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-[#5C5F70]">RG</label>
                <p className="text-[#E1E2E5]">{person.rg}</p>
              </div>
              <div>
                <label className="text-sm text-[#5C5F70]">CPF</label>
                <p className="text-[#E1E2E5]">{person.cpf}</p>
              </div>
              <div className="col-span-2">
                <label className="text-sm text-[#5C5F70]">Nome da Mãe</label>
                <p className="text-[#E1E2E5]">{person.nomeMae}</p>
              </div>
              <div className="col-span-2">
                <label className="text-sm text-[#5C5F70]">Nome do Pai</label>
                <p className="text-[#E1E2E5]">{person.nomePai}</p>
              </div>
            </div>
          </div>
        </div>
        
        <Button
          onClick={handleEditClick}
          variant="ghost"
          className="text-[#5C5F70] hover:text-[#E1E2E5] hover:bg-[#2A2F45] transition-all duration-300"
        >
          <Edit className="w-5 h-5" />
        </Button>
      </div>
    </Card>
  );
};