/* eslint-disable */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const STAGING_DIR = 'build_staging';
const PACKAGER_DIR = 'dist-packager';

console.log('🚀 Starting Clean Build Process...');

// 1. Clean previous build artifacts
console.log('🧹 Cleaning up...');
try {
  if (fs.existsSync(STAGING_DIR)) fs.rmSync(STAGING_DIR, { recursive: true, force: true });
  if (fs.existsSync(PACKAGER_DIR)) fs.rmSync(PACKAGER_DIR, { recursive: true, force: true });
} catch (e) {
  console.warn('Warning during cleanup (might be open in another process):', e.message);
}

// 2. Create staging directory
console.log('📂 Creating staging directory...');
if (!fs.existsSync(STAGING_DIR)) {
  fs.mkdirSync(STAGING_DIR);
}

// 3. Copy application files
console.log('📄 Copying app files...');
const filesToCopy = ['package.json', 'main.js', 'graphi-icon.png', 'graphi-icon.ico'];
filesToCopy.forEach((file) => {
  if (fs.existsSync(file)) {
    fs.copyFileSync(file, path.join(STAGING_DIR, file));
  } else {
    console.warn(`Warning: ${file} not found.`);
    // Fallback for missing ico
    if (file === 'graphi-icon.ico' && fs.existsSync('graphi-icon.png')) {
      console.log('Renaming png to ico as fallback (not real ico, but works for packager)');
      fs.copyFileSync('graphi-icon.png', path.join(STAGING_DIR, 'graphi-icon.ico'));
    }
  }
});

// 4. Copy docs folder
console.log('📚 Copying docs folder...');
if (fs.existsSync('docs')) {
  fs.cpSync('docs', path.join(STAGING_DIR, 'docs'), { recursive: true });
} else {
  console.error('ERROR: docs folder not found! Build the web app first.');
  process.exit(1);
}

// 5. Install Production Dependencies
console.log('📦 Installing production dependencies...');
try {
  // Only install runtime dependencies (electron-serve)
  execSync('pnpm install --prod --ignore-scripts', { cwd: STAGING_DIR, stdio: 'inherit' });
} catch (e) {
  console.error('Failed to install dependencies:', e);
  process.exit(1);
}

// Verify staging directory content
console.log('🔍 verifying staging directory...');
const stagingFiles = fs.readdirSync(STAGING_DIR);
console.log(`Contents of ${STAGING_DIR}:`, stagingFiles);
if (stagingFiles.includes('docs')) {
  const docsFiles = fs.readdirSync(path.join(STAGING_DIR, 'docs'));
  console.log(`Contents of ${STAGING_DIR}/docs:`, docsFiles.slice(0, 5));
} else {
  console.error('ERROR: docs folder missing in staging!');
  process.exit(1);
}

// 6. Package the application
console.log('🎁 Packaging application...');
try {
  // We run electron-packager from the root, pointing to the staging dir
  // We use the local node_modules/.bin/electron-packager
  const packagerPath = path.join('node_modules', '.bin', 'electron-packager');
  const cmd = `npx electron-packager "${STAGING_DIR}" "Graphi Desktop" --platform=win32 --arch=x64 --icon=graphi-icon.ico --out="${PACKAGER_DIR}" --overwrite`;

  console.log(`Executing: ${cmd}`);
  execSync(cmd, { stdio: 'inherit' });

  console.log('✅ Build Complete!');
  console.log(`Find your app in: ${PACKAGER_DIR}\\Graphi Desktop-win32-x64\\Graphi Desktop.exe`);
} catch (e) {
  console.error('Packaging failed:', e);
  process.exit(1);
}
