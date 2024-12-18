import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  MapPin, 
  User,
  Plus,
  X,
  ChevronRight,
  AlertTriangle,
  Camera
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

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

interface NovaPessoa {
  foto: string;
  nome: string;
  dataNascimento: string;
  rg: string;
  cpf: string;
  nomeMae: string;
  nomePai: string;
}

const NovaAbordagem = () => {
  const { toast } = useToast();
  const [endereco, setEndereco] = useState<Endereco>({
    rua: '',
    numero: '',
    bairro: '',
    complemento: ''
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [pessoasSelecionadas, setPessoasSelecionadas] = useState<any[]>([]);
  const [isAddingNewPerson, setIsAddingNewPerson] = useState(false);
  const [novaPessoa, setNovaPessoa] = useState<NovaPessoa>({
    foto: '',
    nome: '',
    dataNascimento: '',
    rg: '',
    cpf: '',
    nomeMae: '',
    nomePai: ''
  });
  const [observacoes, setObservacoes] = useState("");
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  
  // Simula busca dinâmica
  const pessoasFiltradas = PESSOAS_CADASTRADAS.filter(pessoa =>
    pessoa.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pessoa.rg.includes(searchTerm) ||
    pessoa.cpf.includes(searchTerm)
  );

  const handleAddPessoa = (pessoa: any) => {
    if (!pessoasSelecionadas.find(p => p.id === pessoa.id)) {
      setPessoasSelecionadas([...pessoasSelecionadas, pessoa]);
      setSearchTerm("");
      toast({
        title: "Pessoa adicionada",
        description: `${pessoa.nome} foi adicionado à abordagem.`
      });
    }
  };

  const handleRemovePessoa = (pessoaId: string) => {
    setPessoasSelecionadas(pessoasSelecionadas.filter(p => p.id !== pessoaId));
    toast({
      title: "Pessoa removida",
      description: "Pessoa removida da abordagem."
    });
  };

  const handleSaveNewPerson = () => {
    // Aqui você implementaria a lógica para salvar a nova pessoa
    const newPerson = {
      id: crypto.randomUUID(),
      ...novaPessoa,
      endereco: `${endereco.rua}, ${endereco.numero} - ${endereco.bairro}`
    };
    
    handleAddPessoa(newPerson);
    setIsAddingNewPerson(false);
    setNovaPessoa({
      foto: '',
      nome: '',
      dataNascimento: '',
      rg: '',
      cpf: '',
      nomeMae: '',
      nomePai: ''
    });
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Aqui você implementaria a lógica para converter as coordenadas em endereço
          setUseCurrentLocation(true);
          toast({
            title: "Localização obtida",
            description: "Sua localização atual foi capturada com sucesso."
          });
        },
        (error) => {
          toast({
            title: "Erro",
            description: "Não foi possível obter sua localização.",
            variant: "destructive"
          });
        }
      );
    }
  };

  const handleSaveAbordagem = () => {
    const dataAtual = new Date().toLocaleDateString();
    const horaAtual = new Date().toLocaleTimeString();

    const abordagem = {
      id: crypto.randomUUID(),
      data: dataAtual,
      hora: horaAtual,
      endereco,
      pessoas: pessoasSelecionadas,
      observacoes
    };

    // Aqui você implementaria a lógica para salvar a abordagem
    console.log('Abordagem salva:', abordagem);
    
    toast({
      title: "Abordagem salva",
      description: "A abordagem foi registrada com sucesso."
    });
  };

  const isFormValid = endereco.rua && endereco.numero && endereco.bairro && pessoasSelecionadas.length > 0;

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
          
          <div className="space-y-4">
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
              onClick={handleUseCurrentLocation}
              variant="outline"
              className="w-full bg-[#1A1F35] border-[#2A2F45] text-[#E1E2E5] hover:bg-[#2A2F45]"
            >
              <MapPin className="mr-2 h-4 w-4" />
              Usar Localização Atual
            </Button>

            {/* Área do Mapa */}
            <div className="w-full h-48 bg-[#1A1F35] rounded-lg border border-[#2A2F45] flex items-center justify-center">
              <span className="text-[#5C5F70]">Mapa será exibido aqui</span>
            </div>
          </div>
        </Card>

        {/* Seção de Pessoas */}
        <Card className="bg-[#141829] border-[#2A2F45] p-4">
          <h2 className="text-[#E1E2E5] text-lg font-medium mb-4">Pessoas Abordadas</h2>

          {/* Pessoas Selecionadas */}
          {pessoasSelecionadas.length > 0 && (
            <div className="mb-4 space-y-2">
              <div className="text-[#5C5F70] text-sm mb-2">Selecionados:</div>
              {pessoasSelecionadas.map((pessoa) => (
                <div 
                  key={pessoa.id}
                  className="flex items-center justify-between p-2 bg-[#2A2F45] rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <img 
                      src={pessoa.foto}
                      alt={pessoa.nome}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="text-[#E1E2E5]">{pessoa.nome}</span>
                  </div>
                  <button 
                    onClick={() => handleRemovePessoa(pessoa.id)}
                    className="p-1 hover:bg-[#353B51] rounded-full"
                  >
                    <X size={16} className="text-[#5C5F70]" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Busca de Pessoas */}
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Buscar pessoa por nome, RG ou CPF..."
              className="w-full pl-10 pr-4 py-2 bg-[#1A1F35] border border-[#2A2F45] 
                       text-[#E1E2E5] placeholder:text-[#5C5F70] rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-[#2A2F45]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-[#5C5F70]" size={16} />
          </div>

          {/* Resultados da Busca */}
          {searchTerm && (
            <div className="space-y-2">
              {pessoasFiltradas.length > 0 ? (
                pessoasFiltradas.map((pessoa) => (
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
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-[#5C5F70] mb-2">Nenhuma pessoa encontrada</p>
                  <Button 
                    onClick={() => setIsAddingNewPerson(true)}
                    className="inline-flex items-center gap-2"
                  >
                    <Plus size={16} />
                    Cadastrar Nova Pessoa
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Campo de Observações */}
          <div className="mt-6">
            <label className="block text-[#E1E2E5] text-sm font-medium mb-2">
              Observações
            </label>
            <Textarea
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              className="bg-[#1A1F35] border-[#2A2F45] text-[#E1E2E5] placeholder:text-[#5C5F70]"
              placeholder="Digite as observações da abordagem..."
              rows={4}
            />
          </div>

          {/* Botão de Salvar */}
          <div className="mt-6 flex justify-end">
            <Button
              onClick={handleSaveAbordagem}
              disabled={!isFormValid}
              className="px-6"
            >
              Salvar Abordagem
            </Button>
          </div>
        </Card>
      </div>

      {/* Modal de Nova Pessoa */}
      <Dialog open={isAddingNewPerson} onOpenChange={setIsAddingNewPerson}>
        <DialogContent className="bg-[#141829] border-[#2A2F45] text-[#E1E2E5]">
          <DialogHeader>
            <DialogTitle>Cadastrar Nova Pessoa</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Foto */}
            <div className="flex justify-center">
              <div className="relative w-32 h-32 bg-[#1A1F35] rounded-full overflow-hidden">
                {novaPessoa.foto ? (
                  <img
                    src={novaPessoa.foto}
                    alt="Foto"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Camera size={32} className="text-[#5C5F70]" />
                  </div>
                )}
              </div>
            </div>

            <Input
              placeholder="Nome completo"
              value={novaPessoa.nome}
              onChange={(e) => setNovaPessoa({...novaPessoa, nome: e.target.value})}
              className="bg-[#1A1F35] border-[#2A2F45] text-[#E1E2E5]"
            />

            <Input
              type="date"
              value={novaPessoa.dataNascimento}
              onChange={(e) => setNovaPessoa({...novaPessoa, dataNascimento: e.target.value})}
              className="bg-[#1A1F35] border-[#2A2F45] text-[#E1E2E5]"
            />

            <Input
              placeholder="RG"
              value={novaPessoa.rg}
              onChange={(e) => setNovaPessoa({...novaPessoa, rg: e.target.value})}
              className="bg-[#1A1F35] border-[#2A2F45] text-[#E1E2E5]"
            />

            <Input
              placeholder="CPF"
              value={novaPessoa.cpf}
              onChange={(e) => setNovaPessoa({...novaPessoa, cpf: e.target.value})}
              className="bg-[#1A1F35] border-[#2A2F45] text-[#E1E2E5]"
            />

            <Input
              placeholder="Nome da mãe"
              value={novaPessoa.nomeMae}
              onChange={(e) => setNovaPessoa({...novaPessoa, nomeMae: e.target.value})}
              className="bg-[#1A1F35] border-[#2A2F45] text-[#E1E2E5]"
            />

            <Input
              placeholder="Nome do pai"
              value={novaPessoa.nomePai}
              onChange={(e) => setNovaPessoa({...novaPessoa, nomePai: e.target.value})}
              className="bg-[#1A1F35] border-[#2A2F45] text-[#E1E2E5]"
            />

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsAddingNewPerson(false)}
                className="bg-[#1A1F35] border-[#2A2F45] text-[#E1E2E5] hover:bg-[#2A2F45]"
              >
                Cancelar
              </Button>
              <Button onClick={handleSaveNewPerson}>
                Salvar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NovaAbordagem;