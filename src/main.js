const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');

// Add hot reload for development
if (process.env.NODE_ENV === 'development') {
  const path = require('path');
  require('electron-reload')(__dirname + '/../', {
    electron: path.join(__dirname, '..', 'node_modules', '.bin', 'electron'),
    hardResetMethod: 'exit',
  });
}

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // In development, load from Vite dev server
  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:5174');
  } else {
    // In production, load the built files
    win.loadFile('ui/dist/index.html');
  }

  // Open DevTools in development
  if (process.env.NODE_ENV === 'development') {
    win.webContents.openDevTools();
  }
};

// IPC handlers
ipcMain.handle('ping', () => 'pong');

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
