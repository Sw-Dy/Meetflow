# MeetFlow

MeetFlow is a local-first desktop meeting assistant for recording conversations, transcribing speech, translating multilingual meeting audio into English notes, and producing structured summaries on your own machine.

Developed by **Swagnik Dey**.

![MeetFlow interface](scrnshots/Screenshot%202026-07-03%20172329.png)

## Overview

MeetFlow combines a modern desktop interface with native audio processing and local AI model orchestration. The application is built for teams, students, researchers, operators, and creators who need reliable meeting notes without depending on a browser-only workflow.

The supported product is the Tauri desktop client in `desktop-client/`. It uses a Next.js interface, a Rust backend, local storage, native desktop commands, FFmpeg-based media conversion, transcription engines, and summary-generation workflows.

## What MeetFlow Does

- Records microphone and system audio from the desktop app.
- Imports existing audio files for transcription and summarization.
- Converts and resamples audio into transcription-ready formats.
- Runs local transcription through configured speech models.
- Supports English output for multilingual meetings, including Bengali and Hindi speech when translation mode is enabled.
- Stores meetings, transcripts, notes, summaries, preferences, and model state locally.
- Provides a desktop onboarding flow for downloading required models.
- Generates meeting summaries from transcript content.
- Supports CPU mode by default, with optional CUDA, Vulkan, Metal, CoreML, OpenBLAS, and HIP build paths.

## Product Screenshots

| Home and meeting workspace | Import and processing flow |
| --- | --- |
| ![MeetFlow home workspace](scrnshots/Screenshot%202026-07-03%20172329.png) | ![MeetFlow import workflow](scrnshots/Screenshot%202026-07-03%20172344.png) |

| Notes and transcript experience | Settings and configuration |
| --- | --- |
| ![MeetFlow notes view](scrnshots/Screenshot%202026-07-03%20172405.png) | ![MeetFlow settings](scrnshots/Screenshot%202026-07-03%20172436.png) |

| Summary output | Live summary review |
| --- | --- |
| ![MeetFlow summary output](scrnshots/Screenshot%202026-07-03%20172503.png) | ![MeetFlow live summary review](scrnshots/Screenshot%202026-07-03%20191723.png) |

## Demo Video

Watch the MeetFlow demo video:

[MeetFlow demo video](https://drive.google.com/file/d/1HhRD-j5hbFVUD00RCdhmWi432MG6Hv2J/view?usp=sharing)

Recommended demo structure:

1. Start the desktop app.
2. Complete model setup.
3. Record or import meeting audio.
4. Show transcription progress.
5. Show English notes from multilingual speech.
6. Generate and review the final meeting summary.

## Summary Gallery

Use this section for summary screenshots, exported summary previews, or product walkthrough images.

| Summary preview | Action items | Decisions |
| --- | --- | --- |
| ![MeetFlow live summary review](scrnshots/Screenshot%202026-07-03%20191723.png) | Add image: `scrnshots/action-items.png` | Add image: `scrnshots/decisions.png` |

Suggested image format:

```markdown
![Summary preview](scrnshots/summary-preview.png)
```

## Core Workflow

1. Launch MeetFlow through the Tauri desktop runtime.
2. Download or configure the transcription and summary models during onboarding.
3. Record a meeting or import an existing audio file.
4. MeetFlow prepares the audio, runs transcription, and stores transcript chunks locally.
5. Review the transcript, edit meeting notes, and generate a structured summary.
6. Export, copy, or reuse the notes for follow-up work.

## Architecture

MeetFlow is split into a desktop frontend, a native backend, and local model helpers.

| Layer | Technology | Responsibility |
| --- | --- | --- |
| Desktop shell | Tauri | Native window, permissions, commands, packaging, sidecars |
| Frontend | Next.js, React, Tailwind CSS | App UI, onboarding, settings, meeting workspace, import flows |
| Native backend | Rust | Audio capture, processing, storage, model management, desktop APIs |
| Media pipeline | FFmpeg sidecar | Audio conversion, resampling, format normalization |
| Transcription | Local speech models | Meeting transcript generation and translation-capable workflows |
| Summary helper | Rust sidecar | Local summary orchestration and model execution support |

## Repository Layout

| Path | Purpose |
| --- | --- |
| `desktop-client/` | Main MeetFlow desktop application. |
| `desktop-client/src/` | Next.js UI, React components, contexts, hooks, and client services. |
| `desktop-client/src-tauri/` | Rust backend for Tauri commands, audio, models, database access, notifications, and app state. |
| `desktop-client/src-tauri/binaries/` | Runtime sidecars, FFmpeg binary, native DLLs, and helper executables. |
| `desktop-client/scripts/` | Development and launch helpers. |
| `desktop-client/public/` | App icons and static UI assets. |
| `local-llm-helper/` | Rust sidecar used by local summary workflows. |
| `legacy-service/` | Archived service implementation retained for migration reference. |
| `repo-tools/` | Local maintenance utilities. |
| `scrnshots/` | README screenshots and product media. |
| `vendor/` | Vendored Rust dependency patch sources used by the workspace. |

## Requirements

Install the following before running the desktop app:

- Node.js 20 or newer
- pnpm through Corepack
- Rust stable toolchain with Cargo
- Tauri prerequisites for your operating system
- FFmpeg sidecar handled by the build script

Windows requirements:

- Microsoft Visual Studio Build Tools
- Desktop development with C++ workload
- Windows SDK
- WebView2 runtime

Optional acceleration:

- NVIDIA GPU: CUDA
- AMD or Intel GPU: Vulkan
- macOS acceleration: Metal or CoreML
- CPU optimization: OpenBLAS
- AMD GPU compute path: HIP/hipBLAS where supported

## Installation

Follow these steps on Windows to install and run MeetFlow locally.

### 1. Install Node.js

Install Node.js 20 or newer from the official Node.js installer. After installation, open a new PowerShell window and verify it:

```powershell
node --version
corepack --version
```

### 2. Enable pnpm through Corepack

MeetFlow uses pnpm. Corepack ships with modern Node.js versions and manages the correct pnpm version for the project.

```powershell
corepack enable
corepack prepare pnpm@8.15.9 --activate
```

### 3. Install Rust and Cargo

Install Rust using `rustup`, then restart PowerShell and verify both commands are available:

```powershell
rustc --version
cargo --version
```

### 4. Install Windows build prerequisites

Install Microsoft Visual Studio Build Tools with these components:

- Desktop development with C++
- MSVC C++ build tools
- Windows SDK
- CMake tools for Windows, recommended

Also make sure the Microsoft WebView2 runtime is installed. Most Windows 10 and Windows 11 systems already include it.

### 5. Open the project folder

Use the renamed MeetFlow folder:

```powershell
cd D:\meetflow\desktop-client
```

### 6. Install project dependencies

```powershell
corepack pnpm install
```

If this repository was moved or renamed after dependencies were installed, refresh local package links:

```powershell
corepack pnpm install --force
```

### 7. Start the desktop app

Run the full Tauri desktop app from `D:\meetflow\desktop-client`:

```powershell
cd D:\meetflow\desktop-client
corepack pnpm run tauri:dev
```

The first run can take longer because Rust dependencies, the desktop backend, FFmpeg checks, and local sidecars may need to build or verify themselves.

## Development

Run the desktop application with the full native runtime:

```powershell
cd D:\meetflow\desktop-client
corepack pnpm run tauri:dev
```

This is the main command for using MeetFlow during development. It starts the Next.js frontend, launches the Tauri desktop shell, prepares native sidecars, and enables model downloads, audio capture, imports, transcription, and summaries.

Run only the browser frontend:

```powershell
cd D:\meetflow\desktop-client
corepack pnpm run dev
```

The frontend dev server runs on:

```text
http://127.0.0.1:3118
```

Model downloads, desktop audio capture, native storage, and local sidecars require the Tauri desktop runtime. The browser preview is useful for UI development but is not enough for the full product workflow.

## Build Commands

Production desktop build:

```powershell
cd desktop-client
corepack pnpm run tauri:build
```

Frontend production build:

```powershell
cd desktop-client
corepack pnpm run build
```

Rust workspace verification:

```powershell
cargo check -p meetflow
```

Rust tests:

```powershell
cargo test -p meetflow
```

## Acceleration Commands

The default development path runs in CPU mode. Use the feature-specific commands when the matching drivers and SDKs are installed.

| Mode | Development command | Build command |
| --- | --- | --- |
| CPU | `corepack pnpm run tauri:dev:cpu` | `corepack pnpm run tauri:build:cpu` |
| CUDA | `corepack pnpm run tauri:dev:cuda` | `corepack pnpm run tauri:build:cuda` |
| Vulkan | `corepack pnpm run tauri:dev:vulkan` | `corepack pnpm run tauri:build:vulkan` |
| Metal | `corepack pnpm run tauri:dev:metal` | `corepack pnpm run tauri:build:metal` |
| CoreML | `corepack pnpm run tauri:dev:coreml` | `corepack pnpm run tauri:build:coreml` |
| OpenBLAS | `corepack pnpm run tauri:dev:openblas` | `corepack pnpm run tauri:build:openblas` |
| HIP | `corepack pnpm run tauri:dev:hipblas` | `corepack pnpm run tauri:build:hipblas` |

Helper scripts are also available in `desktop-client/`:

- `dev-gpu.sh`
- `dev-gpu.ps1`
- `dev-gpu.bat`
- `build-gpu.sh`
- `build-gpu.ps1`
- `build-gpu.bat`

## Configuration

Configuration is managed through the desktop app settings and local runtime state. Typical configuration areas include:

- Recording save folder
- Auto-save behavior
- Audio format
- Microphone device
- System audio device
- Transcription model provider
- Transcription model selection
- Summary model selection
- Language and translation mode

For multilingual meetings, use translation-capable transcription mode when the desired output should be English notes instead of same-language transcription.

## Runtime Data

MeetFlow stores app data locally through platform-specific desktop storage paths and configured save folders. Runtime data can include:

- Recordings
- Imported audio metadata
- Transcript chunks
- Meeting records
- Edited notes
- Generated summaries
- User preferences
- Model download state
- Local sidecar state

The recording save location can be changed from the app settings.

## Production Checklist

Before publishing or distributing a build:

- Run `corepack pnpm install` from `desktop-client/`.
- Run `corepack pnpm run build`.
- Run `cargo check -p meetflow`.
- Run `corepack pnpm run tauri:build`.
- Launch the packaged app and verify onboarding.
- Confirm model downloads complete in the desktop runtime.
- Import a short audio file and verify transcription.
- Generate a summary and confirm notes render correctly.
- Check that screenshots, demo video links, and documentation links are current.

## Troubleshooting

### Cargo is not recognized

Make sure Rust is installed and Cargo is available in the same shell used to start the app:

```powershell
cargo --version
rustc --version
```

Restart the terminal after installing Rust.

### Tauri still points to an old folder

If the project folder was renamed or moved, clean stale generated Rust artifacts:

```powershell
cd ..
cargo clean
```

Then reinstall frontend dependencies:

```powershell
cd desktop-client
corepack pnpm install --force
```

### Model downloads fail in the browser preview

Start the full desktop runtime:

```powershell
corepack pnpm run tauri:dev
```

The browser-only preview can render the interface, but native model downloads and sidecar workflows require Tauri.

### Windows cannot replace `meetflow.exe`

Close any running MeetFlow window and stop background `meetflow.exe` processes before rebuilding.

### FFmpeg errors appear during import

Run the desktop build again so the build script can verify the cached FFmpeg binary. If the app folder was moved, clean and rebuild once.

### CPU processing is slow

CPU-only transcription and summary processing can be slow on long recordings. Install the matching acceleration stack for your hardware, then use the appropriate feature command from the acceleration table.

## Documentation

- [Desktop client guide](desktop-client/README.md)
- [Desktop API notes](desktop-client/API.md)
- [Contributor guide](CONTRIBUTOR_GUIDE.md)
- [Privacy notice](PRIVACY_NOTICE.md)
- [Audio playback notice](AUDIO_PLAYBACK_NOTICE.md)

## License

MIT. See [LICENSE.md](LICENSE.md).





