# MeetFlow Desktop Client

MeetFlow's desktop client is the supported application surface. It combines a Next.js interface with a Tauri/Rust backend for recording, local transcription, meeting storage, and summary workflows.

Developed by **Swagnik Dey**.

## Requirements

- Node.js 20+
- pnpm 8+
- Rust stable
- Visual Studio Build Tools on Windows, Xcode Command Line Tools on macOS, or standard desktop build tools on Linux

## Run

From this folder:

```bash
pnpm install
pnpm run tauri:dev
```

For the browser-only frontend:

```bash
pnpm run dev
```

The local web server runs on:

```text
http://127.0.0.1:3118
```

## Build

```bash
pnpm run tauri:build
```

GPU helper scripts are available in this folder:

```bash
./dev-gpu.sh
./build-gpu.sh
```

Windows equivalents are available as `.bat` and `.ps1` scripts.

## Layout

| Path | Purpose |
| --- | --- |
| `src/` | Next.js interface and React components |
| `src-tauri/` | Rust desktop backend, native commands, audio, models, storage |
| `public/` | Static UI assets |
| `scripts/` | Development and Tauri startup helpers |

## Notes

MeetFlow does not need a separately started FastAPI service for the supported desktop path. Recording, transcription, and data persistence are handled by the Tauri app.
