import { useEffect } from "react";
export function useFileWatcher(
  listener: (event: Electron.IpcRendererEvent) => void
) {
  useEffect(() => {
    window.ipcRenderer.on("file-watcher", listener);

    return () => {
      window.ipcRenderer.off("file-watcher", listener);
    };
  }, []);
}
