export interface Photo {
  id: string;
  url: string;
  timestamp: number;
  isPerfil: boolean;
}

export interface Endereco {
  rua: string;
  numero: string;
  bairro: string;
  complemento: string;
}

export interface VehicleInfo {
  plate: string;
  brand: string;
  color: string;
  observations: string;
}

export interface PersonData {
  foto: string;
  fotos: Photo[];
  nome: string;
  dataNascimento: string;
  rg: string;
  cpf: string;
  nomeMae: string;
  nomePai: string;
  endereco?: string;
  profilePhoto?: string;
}

export interface Person {
  id: string;
  dados: PersonData;
  endereco: Endereco;
  veiculo?: VehicleInfo;
  observacoes?: string;
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