import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  Search, 
  MapPin, 
  User,
  Plus,
  X,
  ChevronRight
} from "lucide-react";
import { PersonalInfoDisplay } from "@/components/PersonalInfoDisplay";
import { VehicleForm, type VehicleInfo } from "@/components/VehicleForm";
import { indexedDBService } from "@/services/indexedDB";

// Dados simulados
const PESSOAS_CADASTRADAS = [
  {
    id: "1",
    foto: "/api/placeholder/120/120",
    nome: "José Carlos da Silva",
    dataNascimento: "15/03/1985",
    rg: "12.345.678-9",
    cpf: "123.456.789-00",
    nomeMae: "Maria Aparecida da Silva",
    nomePai: "João Carlos da Silva",
    endereco: "Rua das Flores, 123 - Centro"
  },
  {
    id: "2",
    foto: "/api/placeholder/120/120",
    nome: "Maria Santos",
    dataNascimento: "22/07/1990",
    rg: "98.765.432-1",
    cpf: "987.654.321-00",
    nomeMae: "Ana Santos",
    nomePai: "José Santos",
    endereco: "Av. Principal, 456"
  }
];

interface Endereco {
  rua: string;
  numero: string;
  bairro: string;
  complemento: string;
}

interface PessoaAbordagem {
  id: string;
  dados: typeof PESSOAS_CADASTRADAS[0];
  endereco: Endereco;
  veiculo: VehicleInfo;
  observacoes: string;
}

const NovaAbordagem = () => {
  const { toast } = useToast();
  const [endereco, setEndereco] = useState<Endereco>({
    rua: "",
    numero: "",
    bairro: "",
    complemento: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [pessoasSelecionadas, setPessoasSelecionadas] = useState<PessoaAbordagem[]>([]);
  const [pessoaAtual, setPessoaAtual] = useState<PessoaAbordagem | null>(null);
  
  const handleAddPessoa = (pessoa: typeof PESSOAS_CADASTRADAS[0]) => {
    if (!pessoasSelecionadas.find(p => p.id === pessoa.id)) {
      const novaPessoa: PessoaAbordagem = {
        id: pessoa.id,
        dados: pessoa,
        endereco: {
          rua: "",
          numero: "",
          bairro: "",
          complemento: "",
        },
        veiculo: {
          plate: "",
          brand: "",
          color: "",
          observations: "",
        },
        observacoes: "",
      };
      setPessoaAtual(novaPessoa);
    }
  };

  const handleSalvarPessoa = () => {
    if (pessoaAtual) {
      setPessoasSelecionadas(prev => [...prev, pessoaAtual]);
      setPessoaAtual(null);
      setSearchTerm("");
      toast({
        title: "Pessoa adicionada",
        description: "Pessoa adicionada à abordagem com sucesso.",
      });
    }
  };

  const handleRemovePessoa = (pessoaId: string) => {
    setPessoasSelecionadas(prev => prev.filter(p => p.id !== pessoaId));
    toast({
      title: "Pessoa removida",
      description: "Pessoa removida da abordagem.",
    });
  };

  const handleSalvarAbordagem = async () => {
    try {
      const dataAtual = new Date().toISOString();
      const abordagem = {
        id: crypto.randomUUID(),
        name: pessoasSelecionadas[0]?.dados.nome || "",
        date: dataAtual,
        location: `${endereco.rua}, ${endereco.numero} - ${endereco.bairro}`,
        motherName: pessoasSelecionadas[0]?.dados.nomeMae || "",
        rg: pessoasSelecionadas[0]?.dados.rg || "",
        cpf: pessoasSelecionadas[0]?.dados.cpf || "",
        address: `${endereco.rua}, ${endereco.numero} - ${endereco.bairro}`,
        observations: pessoasSelecionadas[0]?.observacoes || "",
        companions: pessoasSelecionadas.slice(1).map(p => p.dados.nome),
        imageUrl: pessoasSelecionadas[0]?.dados.foto,
        data: dataAtual,
        endereco: endereco,
        pessoas: pessoasSelecionadas,
      };

      await indexedDBService.addApproach(abordagem);
      toast({
        title: "Sucesso",
        description: "Abordagem salva com sucesso.",
      });
      // Redirect or clear form
    } catch (error) {
      console.error("Erro ao salvar abordagem:", error);
      toast({
        title: "Erro",
        description: "Erro ao salvar a abordagem.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#1A1F35]">
      {/* Header */}
      <div className="bg-[#141829] border-b border-[#2A2F45] sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4">
          <div className="h-16 flex items-center">
            <h1 className="text-[#E1E2E5] font-medium">Nova Abordagem</h1>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Seção de Localização */}
        <Card className="bg-[#141829] border-[#2A2F45] p-4">
          <h2 className="text-[#E1E2E5] text-lg font-medium mb-4">Localização da Abordagem</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Rua"
              value={endereco.rua}
              onChange={(e) => setEndereco({...endereco, rua: e.target.value})}
              className="bg-[#1A1F35] border-[#2A2F45] text-[#E1E2E5]"
            />
            <Input
              placeholder="Número"
              value={endereco.numero}
              onChange={(e) => setEndereco({...endereco, numero: e.target.value})}
              className="bg-[#1A1F35] border-[#2A2F45] text-[#E1E2E5]"
            />
            <Input
              placeholder="Bairro"
              value={endereco.bairro}
              onChange={(e) => setEndereco({...endereco, bairro: e.target.value})}
              className="bg-[#1A1F35] border-[#2A2F45] text-[#E1E2E5]"
            />
            <Input
              placeholder="Complemento"
              value={endereco.complemento}
              onChange={(e) => setEndereco({...endereco, complemento: e.target.value})}
              className="bg-[#1A1F35] border-[#2A2F45] text-[#E1E2E5]"
            />
          </div>

          <Button
            onClick={() => {/* Implementar uso da localização atual */}}
            variant="outline"
            className="mt-4 w-full bg-[#1A1F35] border-[#2A2F45] text-[#E1E2E5]"
          >
            <MapPin className="mr-2 h-4 w-4" />
            Usar Localização Atual
          </Button>
        </Card>

        {/* Seção de Pessoas */}
        <Card className="bg-[#141829] border-[#2A2F45] p-4">
          <h2 className="text-[#E1E2E5] text-lg font-medium mb-4">Pessoas Abordadas</h2>

          {/* Lista de Pessoas Selecionadas */}
          {pessoasSelecionadas.length > 0 && (
            <div className="mb-6 space-y-4">
              <h3 className="text-[#5C5F70] text-sm">Pessoas nesta abordagem:</h3>
              {pessoasSelecionadas.map((pessoa) => (
                <div key={pessoa.id} className="relative">
                  <PersonalInfoDisplay person={pessoa.dados} />
                  <button 
                    onClick={() => handleRemovePessoa(pessoa.id)}
                    className="absolute top-2 right-2 p-1 hover:bg-[#2A2F45] rounded-full"
                  >
                    <X size={16} className="text-[#5C5F70]" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Busca de Pessoas */}
          <div className="relative mb-4">
            <Input
              placeholder="Buscar pessoa por nome, RG ou CPF..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-[#1A1F35] border-[#2A2F45] text-[#E1E2E5]"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5C5F70]" size={16} />
          </div>

          {/* Pessoa Atual em Edição */}
          {pessoaAtual && (
            <div className="space-y-6">
              <PersonalInfoDisplay person={pessoaAtual.dados} />
              
              {/* Endereço da Pessoa */}
              <div className="space-y-4">
                <h3 className="text-[#E1E2E5] font-medium">Endereço Atual</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Rua"
                    value={pessoaAtual.endereco.rua}
                    onChange={(e) => setPessoaAtual({
                      ...pessoaAtual,
                      endereco: { ...pessoaAtual.endereco, rua: e.target.value }
                    })}
                    className="bg-[#1A1F35] border-[#2A2F45] text-[#E1E2E5]"
                  />
                  <Input
                    placeholder="Número"
                    value={pessoaAtual.endereco.numero}
                    onChange={(e) => setPessoaAtual({
                      ...pessoaAtual,
                      endereco: { ...pessoaAtual.endereco, numero: e.target.value }
                    })}
                    className="bg-[#1A1F35] border-[#2A2F45] text-[#E1E2E5]"
                  />
                  <Input
                    placeholder="Bairro"
                    value={pessoaAtual.endereco.bairro}
                    onChange={(e) => setPessoaAtual({
                      ...pessoaAtual,
                      endereco: { ...pessoaAtual.endereco, bairro: e.target.value }
                    })}
                    className="bg-[#1A1F35] border-[#2A2F45] text-[#E1E2E5]"
                  />
                  <Input
                    placeholder="Complemento"
                    value={pessoaAtual.endereco.complemento}
                    onChange={(e) => setPessoaAtual({
                      ...pessoaAtual,
                      endereco: { ...pessoaAtual.endereco, complemento: e.target.value }
                    })}
                    className="bg-[#1A1F35] border-[#2A2F45] text-[#E1E2E5]"
                  />
                </div>
              </div>

              {/* Informações do Veículo */}
              <div className="space-y-4">
                <h3 className="text-[#E1E2E5] font-medium">Informações do Veículo</h3>
                <VehicleForm
                  vehicle={pessoaAtual.veiculo}
                  onChange={(veiculo) => setPessoaAtual({ ...pessoaAtual, veiculo })}
                />
              </div>

              {/* Observações */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#E1E2E5]">Observações</label>
                <Textarea
                  placeholder="Observações sobre a pessoa..."
                  value={pessoaAtual.observacoes}
                  onChange={(e) => setPessoaAtual({ ...pessoaAtual, observacoes: e.target.value })}
                  className="bg-[#1A1F35] border-[#2A2F45] text-[#E1E2E5]"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setPessoaAtual(null)}
                  className="bg-[#1A1F35] border-[#2A2F45] text-[#E1E2E5]"
                >
                  Cancelar
                </Button>
                <Button onClick={handleSalvarPessoa}>
                  Adicionar à Abordagem
                </Button>
              </div>
            </div>
          )}

          {/* Resultados da Busca */}
          {searchTerm && !pessoaAtual && (
            <div className="space-y-2">
              {PESSOAS_CADASTRADAS.filter(pessoa =>
                pessoa.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                pessoa.rg.includes(searchTerm) ||
                pessoa.cpf.includes(searchTerm)
              ).map((pessoa) => (
                <button
                  key={pessoa.id}
                  className="w-full p-3 bg-[#1A1F35] rounded-lg hover:bg-[#2A2F45] 
                           transition-colors flex items-center justify-between"
                  onClick={() => handleAddPessoa(pessoa)}
                >
                  <div className="flex items-center gap-3">
                    <img 
                      src={pessoa.foto}
                      alt={pessoa.nome}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="text-left">
                      <div className="text-[#E1E2E5]">{pessoa.nome}</div>
                      <div className="text-[#5C5F70] text-sm">
                        RG: {pessoa.rg}
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-[#5C5F70]" />
                </button>
              ))}
            </div>
          )}
        </Card>

        {/* Botão Salvar Abordagem */}
        <div className="flex justify-end">
          <Button
            onClick={handleSalvarAbordagem}
            disabled={!endereco.rua || !endereco.numero || pessoasSelecionadas.length === 0}
            className="px-6"
          >
            Salvar Abordagem
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NovaAbordagem;
