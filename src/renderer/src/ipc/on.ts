import { useEffect } from "react";
export function useFileWatcher(
  listener: (
    event: Electron.IpcRendererEvent,
    path: string,
    type: "add" | "unlink"
  ) => void
) {
  useEffect(() => {
    window.ipcRenderer.on("file-watcher", listener);

    return () => {
      window.ipcRenderer.off("file-watcher", listener);
    };
  }, []);
}
