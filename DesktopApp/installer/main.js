/* eslint-disable @typescript-eslint/no-require-imports */
const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const fs = require('fs-extra');
const { execSync } = require('child_process');

function createWindow() {
  const win = new BrowserWindow({
    width: 660,
    height: 440,
    resizable: false,
    frame: false,
    backgroundColor: '#111214',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.loadFile('index.html');
}

app.whenReady().then(createWindow);

// --- Installation Logic ---

ipcMain.handle('perform-action', async (event, action) => {
  const targetDir = path.join(process.env.LOCALAPPDATA, 'Programs', 'GraphiDesktop');

  try {
    if (action === 'install' || action === 'repair') {
      console.log(`Starting ${action}...`);
      const sourceDir = path.join(__dirname, 'resources', 'app_files');

      if (!fs.existsSync(sourceDir)) {
        throw new Error('Application files not found in installer package.');
      }

      await fs.ensureDir(targetDir);
      await fs.copy(sourceDir, targetDir, { overwrite: true });

      if (process.platform === 'win32') {
        const psCommand = `
          $WshShell = New-Object -ComObject WScript.Shell
          $Shortcut = $WshShell.CreateShortcut("$([Environment]::GetFolderPath('Desktop'))\\Graphi Desktop.lnk")
          $Shortcut.TargetPath = "${path.join(targetDir, 'graphi-desktop-app.exe')}"
          $Shortcut.WorkingDirectory = "${targetDir}"
          $Shortcut.Save()
        `;
        execSync(`powershell -Command "${psCommand}"`);
      }

      return {
        success: true,
        message: `${action === 'install' ? 'Installation' : 'Repair'} successful!`
      };
    }

    if (action === 'uninstall') {
      if (fs.existsSync(targetDir)) {
        await fs.remove(targetDir);
        const desktopPath = path.join(process.env.USERPROFILE, 'Desktop', 'Graphi Desktop.lnk');
        if (fs.existsSync(desktopPath)) await fs.remove(desktopPath);
        return { success: true, message: 'Uninstallation successful!' };
      }
      return { success: false, message: 'App not found.' };
    }
  } catch (err) {
    console.error(err);
    return { success: false, message: err.message };
  }
});

ipcMain.on('close-app', () => app.quit());
ipcMain.on('minimize-app', () => BrowserWindow.getFocusedWindow().minimize());
ipcMain.on('open-link', (event, url) => shell.openExternal(url));
