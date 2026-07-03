#!/usr/bin/env node
/**
 * Auto-detect GPU support, prepare native sidecars, and run Tauri.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const command = process.argv[2];
if (!command || !['dev', 'build'].includes(command)) {
  console.error('Usage: node scripts/tauri-auto.js [dev|build]');
  process.exit(1);
}

const workspaceRoot = path.resolve(__dirname, '..', '..');
const desktopRoot = path.resolve(__dirname, '..');
const tauriRoot = path.join(desktopRoot, 'src-tauri');
const sidecarRoot = path.join(workspaceRoot, 'local-llm-helper');
const binariesDir = path.join(tauriRoot, 'binaries');
const devWebviewDataDir = path.join(workspaceRoot, '.tauri-dev-webview');
const platform = os.platform();
const env = { ...process.env };

function envPathKey() {
  return Object.keys(env).find((key) => key.toLowerCase() === 'path') || (platform === 'win32' ? 'Path' : 'PATH');
}

function prependToEnvPath(...entries) {
  const key = envPathKey();
  const current = env[key] || env.PATH || env.Path || '';
  const additions = entries.filter(Boolean);
  env[key] = [...additions, current].filter(Boolean).join(path.delimiter);

  if (platform === 'win32') {
    // Avoid PATH/Path shadowing in child processes launched through cmd.exe.
    if (key !== 'PATH') delete env.PATH;
    if (key !== 'Path') delete env.Path;
  }
}

function cargoBinDir() {
  const cargoHome = env.CARGO_HOME || (env.USERPROFILE ? path.join(env.USERPROFILE, '.cargo') : '');
  if (!cargoHome) return '';

  const binDir = path.join(cargoHome, 'bin');
  const cargoExe = path.join(binDir, platform === 'win32' ? 'cargo.exe' : 'cargo');
  return fs.existsSync(cargoExe) ? binDir : '';
}

// whisper-rs 0.13.x can generate an opaque whisper_full_params binding on
// Windows/MSVC. The crate's bundled bindings contain the fields it expects.
env.WHISPER_DONT_GENERATE_BINDINGS = env.WHISPER_DONT_GENERATE_BINDINGS || '1';

if (platform === 'win32') {
  const ortDll = path.join(binariesDir, 'onnxruntime.dll');
  if (!fs.existsSync(ortDll)) {
    throw new Error(
      `Missing ONNX Runtime DLL: ${ortDll}\n` +
        'Download ONNX Runtime 1.22.0 for Windows x64 and copy onnxruntime.dll into src-tauri/binaries.'
    );
  }

  env.ORT_DYLIB_PATH = ortDll;
  prependToEnvPath(binariesDir, cargoBinDir());
}

if (command === 'dev' && platform === 'win32') {
  fs.mkdirSync(devWebviewDataDir, { recursive: true });
  env.WEBVIEW2_USER_DATA_FOLDER = env.WEBVIEW2_USER_DATA_FOLDER || devWebviewDataDir;
  env.WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS =
    env.WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS || '--remote-debugging-port=9333';
}

function detectGpuFeature() {
  if (process.env.TAURI_GPU_FEATURE) {
    console.log(`Using forced GPU feature from environment: ${process.env.TAURI_GPU_FEATURE}`);
    return process.env.TAURI_GPU_FEATURE;
  }

  try {
    const result = execSync('node scripts/auto-detect-gpu.js', {
      cwd: desktopRoot,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'inherit'],
    });
    return result.trim();
  } catch (_err) {
    return '';
  }
}

function targetTriple() {
  const arch = os.arch();

  if (platform === 'win32') {
    return arch === 'arm64' ? 'aarch64-pc-windows-msvc' : 'x86_64-pc-windows-msvc';
  }

  if (platform === 'darwin') {
    return arch === 'arm64' ? 'aarch64-apple-darwin' : 'x86_64-apple-darwin';
  }

  if (platform === 'linux') {
    return arch === 'arm64' ? 'aarch64-unknown-linux-gnu' : 'x86_64-unknown-linux-gnu';
  }

  throw new Error(`Unsupported sidecar platform: ${platform}/${arch}`);
}

function prepareLlamaSidecar() {
  if (!fs.existsSync(sidecarRoot)) {
    throw new Error(`Missing sidecar source directory: ${sidecarRoot}`);
  }

  const release = command === 'build';
  const profileDir = release ? 'release' : 'debug';
  const exe = platform === 'win32' ? '.exe' : '';
  const sourceBinary = path.join(workspaceRoot, 'target', profileDir, `llama-helper${exe}`);
  const bundledBinary = path.join(binariesDir, `llama-helper-${targetTriple()}${exe}`);
  const buildCmd = release ? 'cargo build -p llama-helper --release' : 'cargo build -p llama-helper';

  console.log(`Preparing llama-helper sidecar (${profileDir})`);
  execSync(buildCmd, { cwd: workspaceRoot, stdio: 'inherit', env });

  if (!fs.existsSync(sourceBinary)) {
    throw new Error(`Built sidecar was not found: ${sourceBinary}`);
  }

  fs.mkdirSync(binariesDir, { recursive: true });
  fs.copyFileSync(sourceBinary, bundledBinary);
  env.MEETFLOW_LLAMA_HELPER = sourceBinary;

  console.log(`Sidecar ready: ${path.relative(workspaceRoot, bundledBinary)}`);
  console.log('');
}

const feature = detectGpuFeature();

if (platform === 'linux' && feature === 'cuda') {
  console.log('Linux/CUDA detected: setting CMake flags for NVIDIA GPU');
  env.CMAKE_CUDA_ARCHITECTURES = '75';
  env.CMAKE_CUDA_STANDARD = '17';
  env.CMAKE_POSITION_INDEPENDENT_CODE = 'ON';
}

try {
  prepareLlamaSidecar();
} catch (err) {
  console.error(err.message || err);
  process.exit(1);
}

let tauriCmd = `tauri ${command}`;
if (feature && feature !== 'none') {
  tauriCmd += ` -- --features ${feature}`;
  console.log(`Running: tauri ${command} with features: ${feature}`);
} else {
  console.log(`Running: tauri ${command} (CPU-only mode)`);
}
console.log('');

try {
  execSync(tauriCmd, { cwd: desktopRoot, stdio: 'inherit', env });
} catch (err) {
  process.exit(err.status || 1);
}
