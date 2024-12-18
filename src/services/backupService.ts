interface FileSystemFileHandle {
  createWritable(): Promise<FileSystemWritableFileStream>;
  getFile(): Promise<File>;
}

interface FileSystemWritableFileStream {
  write(data: any): Promise<void>;
  close(): Promise<void>;
}

declare global {
  interface Window {
    showSaveFilePicker(options?: any): Promise<FileSystemFileHandle>;
    showOpenFilePicker(options?: any): Promise<FileSystemFileHandle[]>;
  }
}

export const backupService = {
  async saveBackup(data: any) {
    try {
      console.log('Iniciando backup automático...');
      
      // Verifica se File System API está disponível
      if ('showSaveFilePicker' in window) {
        const handle = await window.showSaveFilePicker({
          suggestedName: `police-data-backup-${new Date().toISOString().split('T')[0]}.json`,
          types: [{
            description: 'JSON File',
            accept: { 'application/json': ['.json'] },
          }],
        });
        
        const writable = await handle.createWritable();
        await writable.write(JSON.stringify(data));
        await writable.close();
        
        console.log('Backup realizado com sucesso');
        return true;
      }
      
      console.log('File System API não disponível');
      return false;
    } catch (error) {
      console.error('Erro ao salvar backup:', error);
      return false;
    }
  },

  async loadBackup() {
    try {
      console.log('Tentando carregar backup...');
      
      if ('showOpenFilePicker' in window) {
        const [handle] = await window.showOpenFilePicker({
          types: [{
            description: 'JSON File',
            accept: { 'application/json': ['.json'] },
          }],
        });
        
        const file = await handle.getFile();
        const content = await file.text();
        console.log('Backup carregado com sucesso');
        return JSON.parse(content);
      }
      
      console.log('File System API não disponível para carregar backup');
      return null;
    } catch (error) {
      console.error('Erro ao carregar backup:', error);
      return null;
    }
  }
};