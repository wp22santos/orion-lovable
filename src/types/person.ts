export interface Photo {
  url: string;
  isPerfil: boolean;
}

export interface PersonData {
  foto: string;
  nome: string;
  dataNascimento: string;
  rg: string;
  cpf: string;
  nomeMae: string;
  nomePai: string;
  endereco?: string;
  fotos: Photo[];
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

export interface ApproachedPerson {
  id: string;
  name: string;
  motherName: string;
  rg: string;
  cpf: string;
  photos: Photo[];
  endereco?: Endereco;
}