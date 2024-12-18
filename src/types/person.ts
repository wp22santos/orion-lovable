export interface Photo {
  id: string;
  url: string;
  timestamp: number;
}

export interface PersonData {
  foto: string;
  fotos: Photo[];
  profilePhoto?: string;
  nome: string;
  dataNascimento: string;
  rg: string;
  cpf: string;
  nomeMae: string;
  nomePai: string;
  endereco?: string;
}