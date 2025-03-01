# VQC - Video Quality Checker

# Prerequisites

## FFmpeg

Ensure `ffmpeg` binary exists in `./src-tauri/bin`.

- Linux (x64)
    ```sh
    mkdir src-tauri/bin
    curl -O https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz
    tar xf ffmpeg-release-amd64-static.tar.xz
    mv ffmpeg-*-static/ffmpeg src-tauri/bin/ffmpeg-x86_64-unknown-linux-gnu
    rm -rf ffmpeg-*-static ffmpeg-release-amd64-static.tar.xz
    ```

- Linux (aarch64)
    ```sh
    mkdir src-tauri/bin
    curl -O https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-arm64-static.tar.xz
    tar xf ffmpeg-release-arm64-static.tar.xz
    mv ffmpeg-*-static/ffmpeg src-tauri/bin/ffmpeg-aarch64-unknown-linux-gnu
    rm -rf ffmpeg-*-static ffmpeg-release-amd64-static.tar.xz
    ```

- macOS (Apple Silicon)
    ```sh
    mkdir src-tauri/bin
    curl -O https://www.osxexperts.net/ffmpeg71arm.zip
    unzip ffmpeg71arm.zip
    mv ffmpeg src-tauri/bin/ffmpeg-aarch64-apple-darwin
    rm -rf ffmpeg71arm.zip __MACOSX
    ```

<!-- windows-x64: https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-essentials.zip -->
<!-- macos-x64: https://www.osxexperts.net/ffmpeg71intel.zip -->
