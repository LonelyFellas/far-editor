import fs from "node:fs";
import path from "node:path";
import { isEmptyDir } from ".";
import { randomUUID } from "node:crypto";
import configJson from "../config.json";

/**
 * 获取目录结构
 * @param dirPath 目录路径
 * @returns 目录结构
 */
export function getDirectoryStructure(dirPath: string): FileInfo | null {
  const stats = fs.statSync(dirPath);
  const basename = path.basename(dirPath);
  const parentPath = path.dirname(dirPath);
  const randomId = randomUUID();
  // 忽略文件判断
  const isIgnoreFile = configJson.ignoreFiles.includes(basename);
  // 按需加载文件判断
  const isLazyLoadFile = configJson.lazyLoadFiles.includes(basename);
  if (isLazyLoadFile) return null;

  // 如果是文件
  if (stats.isFile()) {
    return {
      name: basename,
      path: dirPath,
      parentPath: parentPath,
      id: randomId,
      isActive: false,
      type: "file",
    };
  } else if (stats.isDirectory()) {
    const dirFiles: FileInfo[] = [];
    const fileFiles: FileInfo[] = [];
    if (!isLazyLoadFile) {
      fs.readdirSync(dirPath).forEach((child) => {
        const getFileInfo = getDirectoryStructure(path.join(dirPath, child));
        if (getFileInfo?.type === "directory") {
          dirFiles.push(getFileInfo);
        } else if (getFileInfo?.type === "file") {
          fileFiles.push(getFileInfo);
        }
      });
      dirFiles.sort((a, b) => a.name.localeCompare(b.name));
      fileFiles.sort((a, b) => a.name.localeCompare(b.name));
    }
    return {
      name: basename,
      path: dirPath,
      parentPath: parentPath,
      isEmptyDir: isEmptyDir(dirPath),
      id: randomId,
      type: "directory",
      isOpen: false,
      isActive: false,
      children: [...dirFiles, ...fileFiles],
    };
  }

  return null;
}
