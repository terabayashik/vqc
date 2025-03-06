# VQC - Video Quality Checker

![Chart](./docs/assets/chart.png)


# Prerequisites

## Download static FFmpeg binary

Run script below. These scripts let you put ffmpeg binary to `src-tauri/bin`.
> [!WARNING]
> Windows and Linux on Arm is not supported.

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
pnpm tauri:dev
```
