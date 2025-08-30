import { invoke } from "@tauri-apps/api/core";
import { appCacheDir, BaseDirectory, join, sep } from "@tauri-apps/api/path";
import { mkdir, readTextFile } from "@tauri-apps/plugin-fs";
import { Command } from "@tauri-apps/plugin-shell";
import { type Stats, statsSchema } from "./schema";

export const analyze = async (refVideo: string, compVideo: string): Promise<Stats> => {
  await mkdir("vmaf", { baseDir: BaseDirectory.AppCache, recursive: true });
  const appCacheDirPath = await appCacheDir();
  const outputPath = await join(appCacheDirPath, "vmaf", `vmaf_${Date.now()}.log`);
  const threads = await invoke<number>("get_available_threads");

  const sanitizedOutputPath = sep() === "/" ? outputPath : outputPath.replace(/\\/g, "/").replace(/:/g, "\\:");

  // ref: https://nico-lab.net/libvmaf_with_ffmpeg/#ffmpeg_50
  const command = Command.sidecar("bin/ffmpeg", [
    "-i",
    compVideo,
    "-i",
    refVideo,
    "-lavfi",
    `libvmaf=log_fmt=json:log_path='${sanitizedOutputPath}':n_threads=${threads}`,
    "-f",
    "null",
    "-",
  ]);

  // TODO: Use spawn instead of execute to calculate progress
  // ref: https://www.reddit.com/r/tauri/comments/1g1qjd5/ffmpeg_conversions_failing/
  await command.execute();
  const contents = await readTextFile(outputPath);
  const data = statsSchema.parse(JSON.parse(contents));
  return data;
};
