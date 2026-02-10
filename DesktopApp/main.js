/* eslint-disable */
const { app, BrowserWindow } = require('electron');
const serve = require('electron-serve');
const path = require('path');
const fs = require('fs');

// Determine if we are in development mode
const isDev = !app.isPackaged;

// Determine the path to the static files
// In development, they are in the parent 'docs' folder.
// In production (packaged w/o asar), they are in the 'docs' folder inside the app content.
let docsPath;
if (isDev) {
  docsPath = path.join(__dirname, '../docs');
} else {
  // When unpackaged (asar: false), structure is: resources/app/docs
  // __dirname should be resources/app/
  docsPath = path.join(__dirname, 'docs');
}

// Initialize the file server
const loadURL = serve({ directory: docsPath });

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    },
    autoHideMenuBar: true,
    icon: isDev ? path.join(__dirname, 'graphi-icon.png') : path.join(__dirname, 'graphi-icon.png')
  });

  // Open DevTools only in dev mode
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  // Load the application
  loadURL(mainWindow)
    .then(() => {
      // success
    })
    .catch((err) => {
      console.error('Failed to load application:', err);
    });

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

// Proceed when app is ready
app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
  if (mainWindow === null) createWindow();
});
