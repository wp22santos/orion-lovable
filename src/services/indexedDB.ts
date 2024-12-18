import { openDB, IDBPDatabase } from 'idb';

const DB_NAME = 'police-app';
const DB_VERSION = 1;
const STORE_NAME = 'approaches';

let dbInstance: IDBPDatabase | null = null;

export interface Approach {
  id: string;
  name: string;
  date: string;
  location: string;
  companions?: string[];
  imageUrl?: string;
  latitude?: number;
  longitude?: number;
  motherName: string;
  rg: string;
  cpf: string;
  address: string;
  observations?: string;
  pessoas?: Array<{
    id: string;
    dados: {
      foto: string;
      nome: string;
      dataNascimento: string;
      rg: string;
      cpf: string;
      nomeMae: string;
      nomePai: string;
      endereco?: string;
      fotos?: Array<{
        url: string;
        isPerfil: boolean;
      }>;
    };
  }>;
}

// Initialize the database
const initDB = async () => {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    },
  });

  return dbInstance;
};

export const indexedDBService = {
  async addApproach(approach: Approach) {
    const db = await initDB();
    await db.put(STORE_NAME, approach);
  },

  async getApproaches() {
    const db = await initDB();
    return await db.getAll(STORE_NAME);
  },

  async getApproachById(id: string) {
    const db = await initDB();
    return await db.get(STORE_NAME, id);
  },

  async deleteApproach(id: string) {
    const db = await initDB();
    await db.delete(STORE_NAME, id);
  },

  async updateApproach(approach: Approach) {
    const db = await initDB();
    await db.put(STORE_NAME, approach);
  }
};