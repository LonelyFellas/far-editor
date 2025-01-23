import chokidar from "chokidar";
import type { BrowserWindow } from "electron";
import os from "node:os";
import path from "node:path";
import configJson from "../config.json";

export class Chokidar {
  constructor(win: BrowserWindow) {
    console.log(path.join(os.homedir(), "Dev/far-editor"));

    chokidar
      .watch(path.join(os.homedir(), "Dev/far-editor"), {
        ignoreInitial: true,
        ignorePermissionErrors: true,
        ignored: configJson.ignoreFiles,
      })
      .on("all", (event, path) => {
        console.log(event, path);
        win.webContents.send("file-watcher", path, event);
      });
  }
}
