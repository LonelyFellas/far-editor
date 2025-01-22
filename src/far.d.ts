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

  type AnyFunc = (...args: any[]) => any;
  type Switch<B, A = null> = A extends null ? B : A;

  type GenericsFn<P extends any[] | AnyObj = null, R = null> = P extends null
    ? () => Switch<void, R>
    : P extends any[]
    ? (...args: P) => Switch<void, R>
    : (arg: P) => Switch<void, R>;
}
export {};
