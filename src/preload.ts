import { contextBridge, ipcRenderer } from 'electron';


interface Versions {
  node: () => string;
  chrome: () => string;
  electron: () => string;
  ping: () => Promise<string>;
}

interface NotasAPI {
  guardarNota: (titulo: string, contenido: string) => Promise<boolean>;
  leerNotas: () => Promise<Array<{ titulo: string; contenido: string }>>;
}


declare global {
  interface Window {
    versions: Versions;
    notasAPI: NotasAPI;
  }
}


contextBridge.exposeInMainWorld('versions', {
  node: (): string => process.versions.node,
  chrome: (): string => process.versions.chrome,
  electron: (): string => process.versions.electron,
  ping: (): Promise<string> => ipcRenderer.invoke('ping'),
});

contextBridge.exposeInMainWorld('notasAPI', {
  guardarNota: (titulo: string, contenido: string) => ipcRenderer.invoke('guardar-nota', { titulo, contenido }),
  leerNotas: () => ipcRenderer.invoke('leer-notas'),
});
