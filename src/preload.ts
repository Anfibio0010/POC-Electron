import { contextBridge, ipcRenderer } from 'electron';

// Define interface for the API exposed to renderer
interface Versions {
  node: () => string;
  chrome: () => string;
  electron: () => string;
  ping: () => Promise<string>;
}

// Extend the Window interface to include our API
declare global {
  interface Window {
    versions: Versions;
  }
}

// Expose the API to the renderer process
contextBridge.exposeInMainWorld('versions', {
  node: (): string => process.versions.node,
  chrome: (): string => process.versions.chrome,
  electron: (): string => process.versions.electron,
  ping: (): Promise<string> => ipcRenderer.invoke('ping'),
  // we can also expose variables, not just functions
});
