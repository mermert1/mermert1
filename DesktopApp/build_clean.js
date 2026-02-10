/* eslint-disable */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Try to load png2icons if available
let png2icons;
try {
  png2icons = require('png2icons');
} catch (e) {
  console.warn('Warning: png2icons not found. Icon generation may fail if icons are missing.');
}

const STAGING_DIR = 'build_staging';
const PACKAGER_DIR = 'dist-packager';

// Parse arguments
const args = process.argv.slice(2);
let targetPlatform = 'win32'; // Default to win32

// Check for platform flags
if (args.some((arg) => arg.includes('--platform=darwin') || arg.includes('--platform=mac'))) {
  targetPlatform = 'darwin';
} else if (args.includes('--platform=linux')) {
  targetPlatform = 'linux';
} else if (args.includes('--platform=mas')) {
  targetPlatform = 'mas';
}

let targetArch = 'x64'; // Default to x64 for compatibility
if (args.includes('--arch=arm64')) targetArch = 'arm64';

console.log(`🚀 Starting Clean Build for: ${targetPlatform} (${targetArch})...`);

// 1. Clean previous build artifacts (only for this platform if possible? Packager overwrites usually)
console.log('🧹 Cleaning up...');
try {
  if (fs.existsSync(STAGING_DIR)) fs.rmSync(STAGING_DIR, { recursive: true, force: true });
  // We don't delete PACKAGER_DIR entirely to allow multi-platform builds to coexist
} catch (e) {
  console.warn('Warning during cleanup:', e.message);
}

// 2. Create staging directory
console.log('📂 Creating staging directory...');
if (!fs.existsSync(STAGING_DIR)) {
  fs.mkdirSync(STAGING_DIR);
}

// 3. Generate and Copy Icons
console.log('🎨 Processing Icons...');
const pngPath = 'graphi-icon.png';

if (fs.existsSync(pngPath) && png2icons) {
  const pngBuffer = fs.readFileSync(pngPath);

  // Windows ICO
  if (!fs.existsSync('graphi-icon.ico')) {
    console.log('Generating graphi-icon.ico...');
    const ico = png2icons.createICO(pngBuffer, png2icons.BICUBIC2, 0, false, true);
    if (ico) fs.writeFileSync('graphi-icon.ico', ico);
  }

  // Mac ICNS
  if (!fs.existsSync('graphi-icon.icns')) {
    console.log('Generating graphi-icon.icns...');
    const icns = png2icons.createICNS(pngBuffer, png2icons.BICUBIC2, 0);
    if (icns) fs.writeFileSync('graphi-icon.icns', icns);
  }
}

// 4. Copy application files
console.log('📄 Copying app files...');
// Copy all icon variants to staging just in case
const filesToCopy = [
  'package.json',
  'main.js',
  'graphi-icon.png',
  'graphi-icon.ico',
  'graphi-icon.icns'
];
filesToCopy.forEach((file) => {
  if (fs.existsSync(file)) {
    fs.copyFileSync(file, path.join(STAGING_DIR, file));
  }
});

// 5. Copy docs folder
console.log('📚 Copying docs folder...');
let docsSrc = 'docs';
if (!fs.existsSync(docsSrc)) {
  const parentDocs = path.join('..', 'docs');
  if (fs.existsSync(parentDocs)) {
    docsSrc = parentDocs;
  }
}

if (fs.existsSync(docsSrc)) {
  console.log(`Using docs from: ${path.resolve(docsSrc)}`);
  fs.cpSync(docsSrc, path.join(STAGING_DIR, 'docs'), { recursive: true });
} else {
  console.error(
    `ERROR: docs folder not found! Searched in "docs" and "../docs". (CWD: ${process.cwd()})`
  );
  process.exit(1);
}

// 6. Install Production Dependencies
console.log('📦 Installing production dependencies...');
try {
  // Use npm --omit=dev for the final staging install.
  // This is the most reliable way to package runtime dependencies in CI.
  // We use --ignore-scripts to prevent postinstall scripts (like electron-builder)
  // from running and failing when development dependencies are missing.
  execSync('npm install --omit=dev --no-bin-links --ignore-scripts', {
    cwd: STAGING_DIR,
    stdio: 'inherit'
  });
} catch (e) {
  console.error('Failed to install dependencies:', e);
  process.exit(1);
}

// 7. Package the application
try {
  if (args.includes('--custom-installer')) {
    console.log('✨ Building Custom Premium Installer...');

    // A. Build main app as 'dir' (unpacked)
    console.log('   1. Building main application (unpacked)...');
    execSync('npx electron-builder --win --dir', { stdio: 'inherit' });

    const mainAppDir = path.join(process.cwd(), 'dist', 'win-unpacked');
    const installerResourcesDir = path.join(process.cwd(), 'installer', 'resources', 'app_files');

    // B. Copy main app to installer resources
    console.log('   2. Copying main application to installer staging...');
    if (fs.existsSync(installerResourcesDir)) {
      fs.rmSync(installerResourcesDir, { recursive: true, force: true });
    }
    fs.mkdirSync(installerResourcesDir, { recursive: true });

    // We use fs.cpSync for recursive copy
    fs.cpSync(mainAppDir, installerResourcesDir, { recursive: true });

    // C. Build the installer app
    console.log('   3. Packaging Custom Installer...');
    execSync('npx electron-builder --win', {
      cwd: path.join(process.cwd(), 'installer'),
      stdio: 'inherit'
    });

    console.log('✅ Premium Custom Installer Build Complete!');
    console.log(`Artifact is in: ${path.join(process.cwd(), 'installer', 'dist')}`);
  } else if (args.includes('--use-builder')) {
    // ... existing builders logic ...
    console.log('🎁 Packaging application with electron-packager...');
    let iconArg = '';
    if (targetPlatform === 'darwin') {
      iconArg = `--icon=graphi-icon.icns`; // Use local icns
    } else if (targetPlatform === 'win32') {
      iconArg = `--icon=graphi-icon.ico`;
    }

    const cmd = `npx electron-packager "${STAGING_DIR}" "Graphi Desktop" --platform=${targetPlatform} --arch=${targetArch} ${iconArg} --out="${PACKAGER_DIR}" --overwrite`;

    console.log(`Executing: ${cmd}`);
    execSync(cmd, { stdio: 'inherit' });

    console.log(`✅ Build Complete for ${targetPlatform}!`);
    console.log(`Artifacts are in ${PACKAGER_DIR}`);
  }
} catch (e) {
  console.error('Packaging failed:', e);
  process.exit(1);
}
