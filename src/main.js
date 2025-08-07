const { app, BrowserWindow } = require('electron');

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
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  win.loadFile('ui/index.html');

  // Open DevTools in development
  if (process.env.NODE_ENV === 'development') {
    win.webContents.openDevTools();
  }
};

app.whenReady().then(() => {
  createWindow();
});
