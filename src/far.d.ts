import type { UUID } from "node:crypto";

declare global {
  interface FileInfo {
    name: string;
    parentPath: string;
    path: string;
    isEmptyDir?: boolean;
    id: UUID;
    type: "file" | "directory";
    isOpen?: boolean;
    isActive: boolean;
    isLazyLoadDir?: boolean;
    children?: (FileInfo | null | undefined)[];
  }
  type UUID = import("node:crypto").UUID;
}
export {};
