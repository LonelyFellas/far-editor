import { dialog, ipcMain } from "electron";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import {
  getDirectoryFiles,
  getProjectFiles,
} from "./utils/getDirectoryStructure";

/**
 * 打开文件
 */
ipcMain.handle("open-file", () => {
  const root = dialog.showOpenDialogSync({
    // 用户目录
    defaultPath: path.join(os.homedir(), "Dev/far-editor"),
    // 只能选择文件夹
    properties: ["openDirectory"],
  });

  if (root && Array.isArray(root) && root.length > 0) {
    const dirStructure = getProjectFiles(root[0]);
    console.log(dirStructure);

    return dirStructure;
  }
  return null;
});

/**
 * 读取文件内容
 */
ipcMain.handle("read-file", (_, fileName: string) => {
  return fs.readFileSync(fileName, "utf-8");
});

/**
 * 重命名文件
 */
ipcMain.handle(
  "rename-file",
  (_, parentPath: string, oldName: string, newName: string) => {
    console.log("rename-file", parentPath, oldName, newName);
    try {
      fs.renameSync(
        path.join(parentPath, oldName),
        path.join(parentPath, newName)
      );
      console.log("rename-file success");
      return true;
    } catch (error) {
      return false;
    }
  }
);

/**
 * 展开或折叠文件夹
 */
ipcMain.handle("expand-or-collapse-file", (_, rootName: string) => {
  return getDirectoryFiles(rootName);
});
