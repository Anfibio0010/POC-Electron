import { contextBridge, ipcRenderer } from 'electron';

interface Versions {
  node: () => string;
  chrome: () => string;
  electron: () => string;
  ping: () => Promise<string>;
}

declare global {
  interface Window {
    versions: Versions;
  }
}

contextBridge.exposeInMainWorld('versions', {
  node: (): string => process.versions.node,
  chrome: (): string => process.versions.chrome,
  electron: (): string => process.versions.electron,
  ping: (): Promise<string> => ipcRenderer.invoke('ping'),
  // we can also expose variables, not just functions
});
