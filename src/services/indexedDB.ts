import { backupService } from './backupService';
import { Approach } from '@/types/person';

class IndexedDBService {
  private dbName = 'policeRecordsDB';
  private version = 1;
  private db: IDBDatabase | null = null;

  async initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log("Iniciando conexão com o IndexedDB...");
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => {
        console.error("Erro ao abrir banco de dados:", request.error);
        reject(request.error);
      };
      
      request.onsuccess = () => {
        console.log("Banco de dados aberto com sucesso");
        this.db = request.result;
        
        // Configurar para persistência
        if (navigator.storage && navigator.storage.persist) {
          navigator.storage.persist().then(isPersisted => {
            console.log(`Persistência de armazenamento ${isPersisted ? 'concedida' : 'negada'}`);
          });
        }
        
        resolve();
      };

      request.onupgradeneeded = (event) => {
        console.log("Atualizando estrutura do banco de dados");
        const db = (event.target as IDBOpenDBRequest).result;
        
        if (!db.objectStoreNames.contains('approaches')) {
          const store = db.createObjectStore('approaches', { keyPath: 'id' });
          store.createIndex('date', 'date', { unique: false });
          console.log("Store 'approaches' criada com sucesso");
        }
      };
    });
  }

  async addApproach(approach: Approach): Promise<void> {
    if (!this.db) {
      await this.initDB();
    }
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['approaches'], 'readwrite');
      const store = transaction.objectStore('approaches');
      const request = store.add(approach);

      request.onerror = () => {
        console.error("Erro ao salvar abordagem:", request.error);
        reject(request.error);
      };

      request.onsuccess = async () => {
        console.log("Abordagem salva com sucesso");
        // Tenta criar backup automático após salvar
        const allData = await this.getApproaches();
        await backupService.saveBackup(allData);
        resolve();
      };
    });
  }

  async getApproaches(): Promise<Approach[]> {
    if (!this.db) {
      await this.initDB();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['approaches'], 'readonly');
      const store = transaction.objectStore('approaches');
      const request = store.getAll();

      request.onerror = () => {
        console.error("Erro ao buscar abordagens:", request.error);
        reject(request.error);
      };
      
      request.onsuccess = () => {
        const approaches = request.result;
        console.log("Abordagens recuperadas:", approaches);
        resolve(approaches);
      };
    });
  }

  async restoreFromBackup(data: Approach[]): Promise<void> {
    if (!this.db) {
      await this.initDB();
    }

    const transaction = this.db!.transaction(['approaches'], 'readwrite');
    const store = transaction.objectStore('approaches');

    // Limpa dados existentes
    await store.clear();

    // Adiciona dados do backup
    for (const approach of data) {
      await store.add(approach);
    }
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

  async updateApproach(approach: Approach): Promise<void> {
    if (!this.db) {
      await this.initDB();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['approaches'], 'readwrite');
      const store = transaction.objectStore('approaches');
      const request = store.put(approach);

      request.onerror = () => {
        console.error("Erro ao atualizar abordagem:", request.error);
        reject(request.error);
      };

      request.onsuccess = async () => {
        console.log("Abordagem atualizada com sucesso");
        const allData = await this.getApproaches();
        await backupService.saveBackup(allData);
        resolve();
      };
    });
  }
}

export const indexedDBService = new IndexedDBService();
