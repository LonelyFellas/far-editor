interface InvokeChannelMap {
  "open-file": [[], FileInfo | null];
  "read-file": [[string], string];
  "rename-file": [[string, string, string], boolean];
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
  // off: <T extends keyof OnChannelMap>(channel: T, listener: OnChannelMap[T]) => void;
}
