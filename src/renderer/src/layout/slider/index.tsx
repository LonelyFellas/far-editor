import { cn, IconFont, useUpdateEffect } from "@/common";
import { expandOrCollapseFile, getProjectInfo, readFile } from "@/ipc/invoke";
import { useFileWatcher } from "@/ipc/on";
import { useProject } from "@/store";
import { useFileContent } from "@/store/useFileContent.store";
import {
  createContext,
  Fragment,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

const SliderContext = createContext<{
  selectedId: string;
  handleSelectedId: (id: UUID, isDir: boolean, fileName: string) => void;
}>({
  selectedId: "",
  handleSelectedId: () => {},
});
export default function Slider() {
  const [collapsed, setCollapsed] = useState(true);
  const projectInfo = useProject((state) => state.projectInfo);
  const setProjectInfo = useProject((state) => state.setProjectInfo);
  const [selectedId, setSelectedId] = useState(projectInfo.id);
  const setFileContent = useFileContent((state) => state.setFileContent);
  const setSelectedFileInfo = useFileContent(
    (state) => state.setSelectedFileInfo
  );

  useFileWatcher((event) => {
    // getProjectInfo().then((res) => {
    //   if (res) {
    //     setProjectInfo(res);
    //   }
    // });
  });
  const handleSelectedId = async (
    id: UUID,
    isDir: boolean,
    fileName: string
  ) => {
    setSelectedId(id);

    // 如何是单纯的文件，则需要读取文件内容
    if (!isDir) {
      const fileContent = await readFile(fileName);
      setFileContent(fileContent);
      setSelectedFileInfo({
        id,
        name: fileName,
        path: fileName,
        // 文件类型
        type: fileName.split(".").pop(),
      });
    }
  };

  const handleCollapse = (
    parentPath: string,
    name: string,
    isCollapse: boolean
  ) => {
    parentPath = `${parentPath}/`;
    const paths = parentPath.replace(`${projectInfo.path}/`, "").split("/");

    const modifyChildrenTree = (paths: string[], children: any[]): any[] => {
      const path = paths[0];
      if (path === "") {
        return children.map((item) =>
          item.name === name ? { ...item, isOpen: !isCollapse } : { ...item }
        );
      }
      return children.map((item) =>
        item.name === path
          ? {
              ...item,
              children: modifyChildrenTree(paths.slice(1), item.children),
            }
          : item
      );
    };
    setProjectInfo({
      ...projectInfo,
      children: modifyChildrenTree(paths, projectInfo.children as any[]),
    } as any);
  };
  return (
    <div className="my-scrollable-div h-full overflow-y-auto pt-1.5">
      <div className="flex items-center justify-between pl-[8px]">
        <div
          className="select-none text-12px font-bold flex items-center gap-1.5 cursor-pointer"
          onClick={() => setCollapsed(!collapsed)}
        >
          <IconFont
            name="arrow"
            className={cn("text-white", {
              "rotate-90": collapsed,
            })}
          />
          {projectInfo.name.toUpperCase()}
        </div>
      </div>
      <div className="flex flex-col">
        <SliderContext
          value={{
            selectedId,
            handleSelectedId,
          }}
        >
          {collapsed &&
            projectInfo.children?.map((file, index) => (
              <Fragment key={file?.id ?? index}>
                {file ? (
                  <FileItem
                    key={file?.id}
                    fileInfo={file}
                    paddingLeft={16}
                    handleCollapse={handleCollapse}
                  />
                ) : null}
              </Fragment>
            ))}
        </SliderContext>
      </div>
    </div>
  );
}

interface FileItemProps {
  fileInfo: FileInfo;
  paddingLeft: number;
  handleCollapse: (
    parentPath: string,
    name: string,
    isCollapse: boolean
  ) => void;
}
function FileItem(props: FileItemProps) {
  const [isFocusVisible, setIsFocusVisible] = useState(false);
  const [childFiles, setChildFiles] = useState<FileInfo[]>([]);
  const modifyInputRef = useRef<HTMLInputElement>(null);
  const fileItemRef = useRef<HTMLDivElement>(null);
  const { selectedId, handleSelectedId } = useContext(SliderContext);
  const isDir = props.fileInfo.type === "directory";

  const handleSingleClick = async () => {
    if (props.fileInfo.isLazyLoadDir) {
      // 懒加载目录
      const files = await expandOrCollapseFile(props.fileInfo.path);
      setChildFiles(files);
    }
    handleSelectedId(props.fileInfo.id, isDir, props.fileInfo.path);
    if (isDir && props.fileInfo.isOpen !== undefined) {
      // setIsOpen(!isOpen);
      props.handleCollapse(
        props.fileInfo.parentPath,
        props.fileInfo.name,
        props.fileInfo.isOpen
      );
    }
  };

  const isSelected = selectedId === props.fileInfo.id; // 是否选择当前文件

  const handleKeyboardEnter = (e: React.KeyboardEvent<HTMLDivElement>) => {
    console.log("enter");
    if (e.key === "Enter") {
      if (!isFocusVisible) {
        setIsFocusVisible(true);
      } else {
        setIsFocusVisible(false);
        fileItemRef.current?.focus();
      }
      // handleSingleClick();
    }
  };

  useUpdateEffect(() => {
    if (isFocusVisible) {
      modifyInputRef.current?.setSelectionRange(
        0,
        props.fileInfo.name.lastIndexOf(".")
      );
    }
  }, [isFocusVisible]);

  const handleFileItemBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    setIsFocusVisible(false);
  };

  // 文件项
  return (
    <>
      <div
        onKeyDown={handleKeyboardEnter}
        ref={fileItemRef}
        tabIndex={0}
        className={cn(
          "flex h-25px items-center gap-1.5 focus:outline-none focus-visible:outline-none",
          {
            "hover:bg-bg_hover": !isSelected,
            "bg-bg_active": isSelected,
          }
        )}
        onClick={handleSingleClick}
      >
        <div
          className="flex items-center gap-1.5 w-full h-full"
          style={{
            paddingLeft: isDir ? props.paddingLeft : props.paddingLeft + 16,
          }}
        >
          {/* 目录展开图标 */}
          {isDir ? (
            <IconFont
              name="arrow"
              className={cn("text-white", {
                "rotate-90": props.fileInfo.isOpen,
              })}
            />
          ) : null}
          {/* 文件图标 */}
          <IconFont
            name={
              isDir
                ? `dir_${props.fileInfo.isOpen ? "expand" : "collapse"}`
                : "file"
            }
            className="text-white"
          />
          {/* 文件名 */}
          {isFocusVisible ? (
            <input
              ref={modifyInputRef}
              defaultValue={props.fileInfo.name}
              onBlur={handleFileItemBlur}
              autoFocus
              className="flex-1 text-14px h-full bg-transparent outline-none border-[1px] border-solid border-red-500"
              title={props.fileInfo.name}
            />
          ) : (
            <span
              className="flex-1 select-none block text-14px text-ellipsis whitespace-nowrap overflow-hidden"
              title={props.fileInfo.name}
            >
              {props.fileInfo.name}
            </span>
          )}
        </div>
      </div>
      {isDir && props.fileInfo.isOpen && (
        <>
          {(props.fileInfo.isLazyLoadDir
            ? childFiles
            : props.fileInfo.children
          )?.map((file, index) => (
            <Fragment key={file?.id ?? index}>
              {file ? (
                <FileItem
                  key={file?.id ?? index}
                  fileInfo={file}
                  paddingLeft={props.paddingLeft + 8}
                  handleCollapse={props.handleCollapse}
                />
              ) : null}
            </Fragment>
          ))}
        </>
      )}
    </>
  );
}
