# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

VQC (Video Quality Checker) is a Tauri-based desktop application for visualizing VMAF (Video Multimethod Assessment Fusion) video quality metrics. It compares a reference video against one or more comparison videos and displays quality analysis charts.

## Tech Stack

- **Frontend**: React 19 with TypeScript, Vite, Mantine UI components, Recharts for visualization
- **Backend**: Rust with Tauri v2 framework
- **Video Processing**: FFmpeg with VMAF library integration
- **Code Quality**: Biome for linting and formatting
- **Package Manager**: pnpm (required - enforced by preinstall script)

## Development Commands

```bash
# Install dependencies (must use pnpm)
pnpm install

# Run development server (Tauri app with hot reload)
pnpm tauri:dev

# Run development server in release mode (optimized build)
pnpm tauri:dev:release

# Build for production
pnpm tauri:build

# Format and lint code
pnpm check

# Frontend-only development server
pnpm dev

# Build frontend only
pnpm build
```

## Architecture

### Frontend Structure
- `src/App.tsx` - Main application component managing pane state (file selection vs chart display)
- `src/components/FilePane.tsx` - Handles video file selection and initiates VMAF analysis
- `src/components/ChartPane.tsx` - Displays VMAF analysis results in chart format
- `src/ffmpeg.ts` - Core FFmpeg integration for VMAF analysis, manages command execution via Tauri shell plugin
- `src/schema.ts` - Zod schemas for type-safe VMAF data parsing

### Backend Structure
- `src-tauri/src/lib.rs` - Main Rust entry point with Tauri commands (`get_available_threads`)
- `src-tauri/tauri.conf.json` - Tauri configuration including window settings and build configuration
- `src-tauri/bin/` - Location for FFmpeg binary (must be downloaded before development)

### Key Technical Details

1. **FFmpeg Integration**: The app uses FFmpeg as a sidecar process via Tauri's shell plugin. The FFmpeg binary must be placed in `src-tauri/bin/` directory.

2. **VMAF Analysis Flow**:
   - User selects reference video and comparison videos
   - App invokes FFmpeg with libvmaf filter
   - Results are saved as JSON to app cache directory
   - JSON is parsed using Zod schemas and displayed in charts

3. **Thread Management**: The Rust backend provides available system threads to optimize FFmpeg performance.

4. **Data Schema**: VMAF output includes frame-by-frame metrics and pooled statistics, validated through Zod schemas for type safety.

## Prerequisites for Development

1. **Download FFmpeg Binary** (required before first run):
   ```bash
   # macOS/Linux
   bash scripts/download_ffmpeg.sh
   
   # Windows
   pwsh scripts\Download-Ffmpeg.ps1
   ```

2. **Required Tools**:
   - Rust toolchain
   - pnpm package manager
   - Node.js

## Code Style Guidelines

- **Biome Configuration**: All TypeScript/JavaScript code follows Biome rules defined in `biome.json`
- **Line Width**: 120 characters maximum
- **Indentation**: 2 spaces
- **Imports**: Organized automatically by Biome
- **Rust Code**: Excluded from Biome checks (see `files.ignore` in biome.json)