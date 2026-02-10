/* eslint-disable @typescript-eslint/no-require-imports */
const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const fs = require('fs-extra');
const { execSync } = require('child_process');
const axios = require('axios');
const AdmZip = require('adm-zip');

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
  const assetUrl =
    'https://github.com/mermert1/mermert1/releases/latest/download/Graphi-Desktop-Windows-Assets.zip';

  try {
    if (action === 'install' || action === 'repair') {
      console.log(`Starting ${action} (Downloader Mode)...`);

      await fs.ensureDir(targetDir);

      // 1. Download the ZIP file
      const tempZipPath = path.join(targetDir, 'assets.zip');
      const response = await axios({
        url: assetUrl,
        method: 'GET',
        responseType: 'arraybuffer'
      });

      await fs.writeFile(tempZipPath, Buffer.from(response.data));

      // 2. Unzip the contents
      const zip = new AdmZip(tempZipPath);
      zip.extractAllTo(targetDir, true);

      // 3. Cleanup ZIP
      await fs.remove(tempZipPath);

      // 4. Create Shortcut (Windows specific)
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
