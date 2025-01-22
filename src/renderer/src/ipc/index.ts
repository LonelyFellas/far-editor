/**
 * 打开工程文件夹
 * @returns 文件夹信息
 */
export async function openFile(): Promise<FileInfo | null> {
  const fileRes = await window.ipcRenderer.invoke("open-file");
  return fileRes;
}

// /**
//  * 展开或折叠文件夹
//  * @param rootName 文件夹名称
//  * @returns 文件夹信息
//  */
// export async function expandOrCollapseFile(
//   rootName: string
// ): Promise<FileInfo[]> {
//   const filesRes = await window.ipcRenderer.invoke(
//     "expand-or-collapse-file",
//     rootName
//   );
//   return filesRes;
// }

/**
 * 读取文件内容
 * @param fileName 文件名称
 * @returns 文件内容
 */
export async function readFile(fileName: string): Promise<string> {
  const fileContent = await window.ipcRenderer.invoke("read-file", fileName);
  return fileContent;
}

/**
 * 重命名文件
 * @param newName 新文件名
 * @returns 是否成功
 */
export async function renameFile(
  parentPath: string,
  oldName: string,
  newName: string
): Promise<boolean> {
  const res = await window.ipcRenderer.invoke(
    "rename-file",
    parentPath,
    oldName,
    newName
  );
  return res;
}
