# VQC - Video Quality Checker

Visualize [VMAF](https://github.com/Netflix/vmaf).
Download executables from [releases](https://github.com/terabayashik/vqc/releases).

![Chart](./docs/assets/chart.png)

# Prerequisites

- Rust
- pnpm

## Download static FFmpeg binary

Run the script below. These scripts will place the ffmpeg binary in `src-tauri/bin`.
> [!WARNING]
> Windows and Linux on Arm are not supported.

### macOS / Linux
```sh
bash scripts/download_ffmpeg.sh
```

### Windows
```powershell
pwsh scripts\Download-Ffmpeg.ps1
```

# Development
```sh
pnpm install
pnpm tauri:dev
```
