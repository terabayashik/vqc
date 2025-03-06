# 1. Download FFmpeg from "https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-essentials.zip"
# 2. Extract the zip file
# 3. Copy the ffmpeg-<version>-essentials_build\bin\ffmpeg.exe to "src-tauri\bin"
# 4. Rename the ffmpeg.exe to ffmpeg-x86_64-pc-windows-msvc.exe

$ffmpegZipUrl = "https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-essentials.zip"
$ffmpegZipFile = "ffmpeg-release-essentials.zip"
$ffmpegFolderWildcard = "ffmpeg-*-essentials_build"
$ffmpegExe = "ffmpeg.exe"
$destinationFolder = "src-tauri\bin"
$destinationExe = "ffmpeg-x86_64-pc-windows-msvc.exe"

# Download the FFmpeg zip file
Invoke-WebRequest -Uri $ffmpegZipUrl -OutFile $ffmpegZipFile -MaximumRedirection 5

# Extract the zip file
Expand-Archive -Path $ffmpegZipFile -DestinationPath .

# Locate the extracted folder
$ffmpegFolder = Get-ChildItem -Directory -Recurse | Where-Object { $_.Name -like $ffmpegFolderWildcard } | Select-Object -First 1

# Copy the FFmpeg executable to the destination folder and rename it
Copy-Item -Path "$($ffmpegFolder.FullName)\bin\$ffmpegExe" -Destination "$destinationFolder\$destinationExe" -Force

# Clean up: remove the downloaded zip file and the extracted folder
Remove-Item -Path $ffmpegZipFile -Force
Remove-Item -Path $ffmpegFolder.FullName -Recurse -Force
