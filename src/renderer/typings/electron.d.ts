interface InvokeChannelMap {
  "open-file": [[boolean], FileInfo | null];
  "read-file": [[string], string];
  "rename-file": [[string, string, string], boolean];
  "expand-or-collapse-file": [[string], FileInfo[]];
  "file-watcher": [[string], boolean];
}

type OnMapValue<T = null> = GenericsFn<[Electron.IpcRendererEvent, T], void>;
interface OnChannelMap {
  "file-watcher": OnMapValue<string>;
}

interface IpcRenderer extends Omit<IpcRenderer, "invoke" | "send"> {
  invoke: <T extends keyof InvokeChannelMap>(
    channel: T,
    ...args: InvokeChannelMap[T][0]
  ) => Promise<InvokeChannelMap[T][1]>;
  // send: <T extends keyof SendChannelMap>(channel: T, ...args: SendChannelMap[T]) => Promise<any>;
  on: <T extends keyof OnChannelMap>(
    channel: T,
    listener: OnChannelMap[T]
  ) => void;
  off: <T extends keyof OnChannelMap>(
    channel: T,
    listener: OnChannelMap[T]
  ) => void;
}
