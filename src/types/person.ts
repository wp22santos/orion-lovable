export interface PersonData {
  foto: string;
  nome: string;
  dataNascimento: string;
  rg: string;
  cpf: string;
  nomeMae: string;
  nomePai: string;
  endereco?: string;
  fotos: {
    url: string;
    isPerfil: boolean;
  }[];
}

export interface Endereco {
  rua: string;
  numero: string;
  bairro: string;
  complemento: string;
}

export interface Person {
  id: string;
  dados: PersonData;
  endereco: Endereco;
}