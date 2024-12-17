export interface Approach {
  id: string;
  name: string;
  motherName: string;
  rg: string;
  cpf: string;
  address: string;
  observations?: string;
  companions?: string[];
  date: string;
  location: string;
  imageUrl?: string;
}

class IndexedDBService {
  private dbName = 'policeRecordsDB';
  private version = 1;
  private db: IDBDatabase | null = null;

  async initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('approaches')) {
          db.createObjectStore('approaches', { keyPath: 'id' });
        }
      };
    });
  }

  async addApproach(approach: Approach): Promise<void> {
    if (!this.db) await this.initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['approaches'], 'readwrite');
      const store = transaction.objectStore('approaches');
      const request = store.add(approach);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async getApproaches(): Promise<Approach[]> {
    if (!this.db) await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['approaches'], 'readonly');
      const store = transaction.objectStore('approaches');
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async getApproachById(id: string): Promise<Approach | null> {
    if (!this.db) await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['approaches'], 'readonly');
      const store = transaction.objectStore('approaches');
      const request = store.get(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || null);
    });
  }
}

export const indexedDBService = new IndexedDBService();