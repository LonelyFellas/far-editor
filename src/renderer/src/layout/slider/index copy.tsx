// import { Fragment, useRef, useState, createContext, useContext } from "react";
// import { useProject } from "@/store";
// import { IconFont, useUpdateEffect, cn } from "@common";
// import { expandOrCollapseFile, readFile, renameFile } from "@/ipc";
// import { useFileContent } from "@/store/useFileContent.store";

// const SliderContext = createContext<{
//   selectedId: string;
//   handleSelectedId: (id: string, isDir: boolean, fileName: string) => void;
//   sliderWidth: number;
// }>({
//   selectedId: "",
//   handleSelectedId: () => {},
//   sliderWidth: 0, // TODO: 多余，之后删除
// });
// export default function Slider() {
//   const projectInfo = useProject((state) => state.projectInfo);
//   const setFileContent = useFileContent((state) => state.setFileContent);
//   const setSelectedFileInfo = useFileContent(
//     (state) => state.setSelectedFileInfo
//   );
//   const [selectedId, setSelectedId] = useState(projectInfo.id);
//   const sliderRef = useRef<HTMLDivElement>(null);

//   const handleSelectedId = async (
//     id: string,
//     isDir: boolean,
//     fileName: string
//   ) => {
//     setSelectedId(id);
//     // 如何是单纯的文件，则需要读取文件内容
//     if (!isDir) {
//       const fileContent = await readFile(fileName);
//       setFileContent(fileContent);
//       setSelectedFileInfo({
//         id,
//         name: fileName,
//         path: fileName,
//         // 文件类型
//         type: fileName.split(".").pop(),
//       });
//     }
//   };

//   return (
//     // 文件列表
//     <div
//       className="my-scrollable-div py-2 h-full overflow-y-auto"
//       ref={sliderRef}
//     >
//       <SliderContext.Provider
//         value={{
//           selectedId,
//           handleSelectedId,
//           sliderWidth: sliderRef.current?.clientWidth ?? 0,
//         }}
//       >
//         {[projectInfo].map((file) => (
//           <Fragment key={file.name}>
//             <FileItem
//               file={file}
//               isActive={file.isActive}
//               index={0}
//               defaultFiles={file.files}
//             />
//           </Fragment>
//         ))}
//       </SliderContext.Provider>
//     </div>
//   );
// }

// interface FileItemProps {
//   file: FileInfo;
//   isActive: boolean;
//   index: number;
//   defaultFiles?: FileInfo[];
// }
// function FileItem(props: FileItemProps) {
//   const modifyInputRef = useRef<HTMLInputElement>(null);
//   const [isFocusVisible, setIsFocusVisible] = useState(false);
//   const { selectedId, handleSelectedId } = useContext(SliderContext);
//   const [isOpen, setIsOpen] = useState(props.isActive);
//   const [childFiles, setChildFiles] = useState<FileInfo[]>(
//     props.defaultFiles || []
//   );
//   const handleSingleClick = async () => {
//     if (!isOpen && props.file.isDir) {
//       // 展开状态，查询所有子文件数量
//       const files = await expandOrCollapseFile(props.file.path);
//       setChildFiles(files);
//     }
//     handleSelectedId(props.file.id, props.file.isDir, props.file.path);
//     setIsOpen(!isOpen);
//   };

//   const isSelected = selectedId === props.file.id; // 是否选择当前文件

//   const handleKeyboardEnter = (e: React.KeyboardEvent<HTMLDivElement>) => {
//     if (e.key === "Enter") {
//       setIsFocusVisible(true);
//     }
//   };

//   useUpdateEffect(() => {
//     if (isFocusVisible) {
//       modifyInputRef.current?.setSelectionRange(
//         0,
//         props.file.name.lastIndexOf(".")
//       );
//     }
//   }, [isFocusVisible]);

//   const handleFileItemBlur = async () => {
//     if (!modifyInputRef.current) return; // 没有输入框，直接返回
//     if (modifyInputRef.current?.value === props.file.name) return; // 输入框内容与文件名相同，直接返回
//     const newName = modifyInputRef.current?.value ?? "";
//     console.log("newName", newName);
//     const res = await renameFile(
//       props.file.parentPath,
//       props.file.name,
//       newName
//     );
//     if (res) {
//       setIsFocusVisible(false);
//     }
//   };

//   return (
//     // 文件项
//     <>
//       <div
//         onKeyDown={handleKeyboardEnter}
//         // onBlur={handleFileItemBlur}
//         tabIndex={0}
//         className={cn(
//           "flex items-center gap-1.5 px-4 focus:outline-none focus-visible:outline-none",
//           {
//             "hover:bg-bg_hover": !isSelected,
//             "bg-bg_active": isSelected,
//           }
//         )}
//         onClick={handleSingleClick}
//       >
//         <div className="flex items-center gap-1.5 w-full z-10">
//           {/* 目录展开图标 */}
//           <IconFont
//             name="arrow"
//             className={cn("text-white invisible", {
//               visible: props.file.isDir && !props.file.isEmpty,
//               "rotate-90": isOpen,
//             })}
//           />
//           {/* 文件图标 */}
//           <IconFont
//             name={
//               props.file.isDir
//                 ? `dir_${isOpen ? "expand" : "collapse"}`
//                 : "file"
//             }
//             className="text-white"
//           />
//           {/* 文件名 */}
//           {isFocusVisible ? (
//             <input
//               ref={modifyInputRef}
//               defaultValue={props.file.name}
//               onBlur={handleFileItemBlur}
//               autoFocus
//               className="flex-1 bg-transparent outline-none border-[1px] border-solid border-red-500 h-[calc(100%+4px)]"
//               title={props.file.name}
//             />
//           ) : (
//             <span
//               className="flex-1 select-none block text-ellipsis whitespace-nowrap overflow-hidden"
//               title={props.file.name}
//             >
//               {props.file.name}
//             </span>
//           )}
//         </div>

//         {/* <div
//           className={cn("h-18px bg-transparent absolute left-0", {
//             "group-hover:bg-bg_hover": !isSelected,
//             "bg-bg_active": isSelected,
//           })}
//           style={{ width: sliderWidth }}
//         ></div> */}
//       </div>

//       <div className="pl-4">
//         {/* 子文件 */}
//         {isOpen &&
//           childFiles.map((file) => (
//             <FileItem
//               file={file}
//               isActive={file.isActive}
//               key={file.name}
//               index={props.index}
//             />
//           ))}
//       </div>
//     </>
//   );
// }
