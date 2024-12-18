import { backupService } from './backupService';
import { Approach } from '@/types/person';

class IndexedDBService {
  private dbName = 'policeRecordsDB';
  private version = 1;
  private db: IDBDatabase | null = null;
  private dbPromise: Promise<IDBDatabase> | null = null;

  private async getDB(): Promise<IDBDatabase> {
    if (this.db) return this.db;
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => {
        console.error("Error opening database:", request.error);
        reject(request.error);
      };
      
      request.onsuccess = () => {
        this.db = request.result;
        resolve(request.result);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        if (!db.objectStoreNames.contains('approaches')) {
          const store = db.createObjectStore('approaches', { keyPath: 'id' });
          store.createIndex('date', 'date', { unique: false });
        }
      };
    });

    return this.dbPromise;
  }

  async addApproach(approach: Approach): Promise<void> {
    const db = await this.getDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['approaches'], 'readwrite');
      const store = transaction.objectStore('approaches');
      const request = store.add(approach);

      request.onerror = () => reject(request.error);
      request.onsuccess = async () => {
        const allData = await this.getApproaches();
        await backupService.saveBackup(allData);
        resolve();
      };
    });
  }

  async getApproaches(): Promise<Approach[]> {
    const db = await this.getDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['approaches'], 'readonly');
      const store = transaction.objectStore('approaches');
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async getApproachById(id: string): Promise<Approach | null> {
    const db = await this.getDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['approaches'], 'readonly');
      const store = transaction.objectStore('approaches');
      const request = store.get(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || null);
    });
  }

  async updateApproach(approach: Approach): Promise<void> {
    const db = await this.getDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['approaches'], 'readwrite');
      const store = transaction.objectStore('approaches');
      const request = store.put(approach);

      request.onerror = () => reject(request.error);
      request.onsuccess = async () => {
        const allData = await this.getApproaches();
        await backupService.saveBackup(allData);
        resolve();
      };
    });
  }
}

export const indexedDBService = new IndexedDBService();