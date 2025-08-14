import { fileURLToPath } from 'url';
import path from 'node:path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { app, BrowserWindow, ipcMain } from 'electron';
import fs from 'fs';
import fsp from 'fs/promises';



const createWindow = (): void => {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, '../../dist/src/preload.js'),
    },
  });

  // In development, load from Vite dev server
  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:5174');
  } else {
    // In production, load the built files
    win.loadFile(path.join(__dirname, '../../index.html'));
  }

  // Open DevTools in development
  if (process.env.NODE_ENV === 'development') {
    win.webContents.openDevTools();
  }
};


// Carpeta donde se guardan las notas
const notasDir = path.join(__dirname, '../../notas');

// Guardar nota
ipcMain.handle('guardar-nota', async (_event, { titulo, contenido }) => {
  const filePath = path.join(notasDir, `${titulo}.txt`);
  await fsp.writeFile(filePath, contenido, 'utf8');
  return true;
});

// Leer todas las notas
ipcMain.handle('leer-notas', async () => {
  const files = await fsp.readdir(notasDir);
  const notas = await Promise.all(
    files.filter(f => f.endsWith('.txt')).map(async (file) => {
      const contenido = await fsp.readFile(path.join(notasDir, file), 'utf8');
      return { titulo: file.replace('.txt', ''), contenido };
    })
  );
  return notas;
});

ipcMain.handle('ping', (): string => 'pong');
app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
