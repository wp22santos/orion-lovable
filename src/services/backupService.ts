export const backupService = {
  async saveBackup(data: any) {
    try {
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
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro ao salvar backup:', error);
      return false;
    }
  },

  async loadBackup() {
    try {
      if ('showOpenFilePicker' in window) {
        const [handle] = await window.showOpenFilePicker({
          types: [{
            description: 'JSON File',
            accept: { 'application/json': ['.json'] },
          }],
        });
        
        const file = await handle.getFile();
        const content = await file.text();
        return JSON.parse(content);
      }
      return null;
    } catch (error) {
      console.error('Erro ao carregar backup:', error);
      return null;
    }
  }
};