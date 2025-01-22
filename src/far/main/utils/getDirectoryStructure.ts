import fs from "node:fs";
import path from "node:path";
import { isEmptyDir } from ".";
import { randomUUID } from "node:crypto";
import configJson from "../config.json";

export const getProjectFiles = (dirPath: string): FileInfo | null => {
  const stats = fs.statSync(dirPath);
  const basename = path.basename(dirPath);
  const parentPath = path.dirname(dirPath);
  const randomId = randomUUID();
  // 忽略文件判断
  const isIgnoreFile = configJson.ignoreFiles.includes(basename);
  // 按需加载文件判断
  const isLazyLoadFile = configJson.lazyLoadFiles.includes(basename);
  if (isIgnoreFile) return null;

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
        const getFileInfo = getProjectFiles(path.join(dirPath, child));
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
      isLazyLoadDir: isLazyLoadFile,
      children: [...dirFiles, ...fileFiles],
    };
  }

  return null;
};

export function getDirectoryFiles(rootPath: string): FileInfo[] {
  const files = fs.readdirSync(rootPath, { withFileTypes: true });
  const dirFiles: FileInfo[] = [];
  const fileFiles: FileInfo[] = [];
  const ignoreFiles = configJson.ignoreFiles;

  for (const file of files) {
    if (ignoreFiles.includes(file.name)) continue;
    if (file.isFile()) {
      fileFiles.push({
        name: file.name,
        path: file.parentPath,
        id: randomUUID(),
        type: "file",
        isActive: false,
        parentPath: file.parentPath,
      });
    } else if (file.isDirectory()) {
      dirFiles.push({
        name: file.name,
        path: file.parentPath,
        id: randomUUID(),
        type: "directory",
        isActive: false,
        parentPath: file.parentPath,
        isOpen: false,
        isLazyLoadDir: true,
        children: [],
      });
    }
  }
  dirFiles.sort((l, r) => l.name.localeCompare(r.name));
  fileFiles.sort((l, r) => l.name.localeCompare(r.name));
  return [...dirFiles, ...fileFiles];
}
