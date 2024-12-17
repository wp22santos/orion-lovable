export interface ApproachedPerson {
  id: string;
  name: string;
  motherName: string;
  rg: string;
  cpf: string;
  photos: string[];
}

export interface Approach {
  id: string;
  name: string;
  motherName: string;
  rg: string;
  cpf: string;
  address: string;
  observations?: string;
  companions?: string[];
  approachedPeople?: ApproachedPerson[];
  date: string;
  location: string;
  imageUrl?: string;
  latitude?: number;
  longitude?: number;
  vehicle?: {
    type: string;
    model: string;
    plate: string;
    observations?: string;
  };
}

class IndexedDBService {
  private dbName = 'policeRecordsDB';
  private version = 1;
  private db: IDBDatabase | null = null;

  async initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => {
        console.error("Erro ao abrir banco de dados:", request.error);
        reject(request.error);
      };
      
      request.onsuccess = () => {
        console.log("Banco de dados aberto com sucesso");
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        console.log("Atualizando estrutura do banco de dados");
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('approaches')) {
          const store = db.createObjectStore('approaches', { keyPath: 'id' });
          store.createIndex('name', 'name', { unique: false });
          store.createIndex('rg', 'rg', { unique: false });
          store.createIndex('cpf', 'cpf', { unique: false });
          console.log("Store 'approaches' criada com sucesso");
        }
      };
    });
  }

  async addApproach(approach: Approach): Promise<void> {
    if (!this.db) await this.initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['approaches'], 'readwrite');
      const store = transaction.objectStore('approaches');
      console.log("Salvando abordagem:", approach);
      const request = store.add(approach);

      request.onerror = () => {
        console.error("Erro ao salvar abordagem:", request.error);
        reject(request.error);
      };
      request.onsuccess = () => {
        console.log("Abordagem salva com sucesso");
        resolve();
      };
    });
  }

  async getApproaches(): Promise<Approach[]> {
    if (!this.db) await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['approaches'], 'readonly');
      const store = transaction.objectStore('approaches');
      const request = store.getAll();

      request.onerror = () => {
        console.error("Erro ao buscar abordagens:", request.error);
        reject(request.error);
      };
      request.onsuccess = () => {
        console.log("Abordagens recuperadas com sucesso:", request.result);
        resolve(request.result);
      };
    });
  }

  async getApproachById(id: string): Promise<Approach | null> {
    if (!this.db) await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['approaches'], 'readonly');
      const store = transaction.objectStore('approaches');
      const request = store.get(id);

      request.onerror = () => {
        console.error("Erro ao buscar abordagem por ID:", request.error);
        reject(request.error);
      };
      request.onsuccess = () => {
        console.log("Abordagem recuperada por ID:", request.result);
        resolve(request.result || null);
      };
    });
  }

  async searchApproaches(query: string): Promise<Approach[]> {
    const approaches = await this.getApproaches();
    const searchStr = query.toLowerCase();
    
    return approaches.filter(approach => {
      const searchableStr = `
        ${approach.name} 
        ${approach.motherName} 
        ${approach.rg} 
        ${approach.cpf} 
        ${approach.address} 
        ${approach.observations || ''} 
        ${approach.companions?.join(' ') || ''}
      `.toLowerCase();
      
      return searchableStr.includes(searchStr);
    });
  }
}

export const indexedDBService = new IndexedDBService();
