import fs from "node:fs";
import path from "node:path";
import { isEmptyDir } from ".";
import { randomUUID } from "node:crypto";

/**
 * 获取目录结构
 * @param dirPath 目录路径
 * @returns 目录结构
 */
export function getDirectoryStructure(dirPath: string): FileInfo | null {
  const stats = fs.statSync(dirPath);

  // 如果是文件
  if (stats.isFile()) {
    return {
      name: path.basename(dirPath),
      path: dirPath,
      parentPath: path.dirname(dirPath),
      id: randomUUID(),
      isActive: false,
      type: "file",
    };
  } else if (stats.isDirectory()) {
    const dirFiles: FileInfo[] = [];
    const fileFiles: FileInfo[] = [];
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
    return {
      name: path.basename(dirPath),
      path: dirPath,
      parentPath: path.dirname(dirPath),
      isEmptyDir: isEmptyDir(dirPath),
      id: randomUUID(),
      type: "directory",
      isOpen: false,
      isActive: false,
      children: [...dirFiles, ...fileFiles],
    };
  }

  return null;
}
