const path = require('node:path');
const { app, BrowserWindow, ipcMain } = require('electron');

const mainWindow = new BrowserWindow({
  webPreferences: {
    nodeIntegration: true,    // para poder usar require en el renderer
    contextIsolation: false,  // debe estar desactivado para nodeIntegration = true
  }
});

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
      nodeIntegration: true,
      contextIsolation: false,
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
  if (process.env.ELECTRON_START_URL) {
    mainWindow.loadURL(process.env.ELECTRON_START_URL);
  }else {
    mainWindow.loadFile(path.join(__dirname, "build", "index.html"));
  }
});


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

mainWindow.loadURL(`file://${__dirname}/build/index.html`);