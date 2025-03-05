# 1. Download FFmpeg from "https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-essentials.zip"
# 2. Extract the zip file
# 3. Copy the ffmpeg-<version>-essentials_build\bin\ffmpeg.exe to the scripts folder
# 4. Rename the ffmpeg.exe to ffmpeg-x86_64-pc-windows-msvc.exe

$ffmpegZipUrl = "https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-essentials.zip"
$ffmpegZipFile = "ffmpeg-release-essentials.zip"
$ffmpegFolderWildcard = "ffmpeg-*-essentials_build"
$ffmpegExe = "ffmpeg.exe"
$destinationExe = "ffmpeg-x86_64-pc-windows-msvc.exe"

Invoke-WebRequest -Uri $ffmpegZipUrl -OutFile $ffmpegZipFile -MaximumRedirection 5
Expand-Archive -Path $ffmpegZipFile -DestinationPath .
$ffmpegFolder = Get-ChildItem -Directory | Where-Object { $_.Name -like $ffmpegFolderWildcard } | Select-Object -First 1
Copy-Item -Path "$($ffmpegFolder.FullName)\bin\$ffmpegExe" -Destination $destinationExe
Remove-Item -Path $ffmpegZipFile -Force
Remove-Item -Path $ffmpegFolder.FullName -Recurse -Force
