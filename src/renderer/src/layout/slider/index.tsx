import { cn, IconFont } from "@/common";
import { useProject } from "@/store";
import {
  createContext,
  Fragment,
  useContext,
  useEffect,
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
  const [selectedId, setSelectedId] = useState(projectInfo.id);

  const handleSelectedId = (id: UUID, isDir: boolean, fileName: string) => {
    setSelectedId(id);
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
                  <FileItem key={file?.id} fileInfo={file} paddingLeft={16} />
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
}
function FileItem(props: FileItemProps) {
  const { selectedId, handleSelectedId } = useContext(SliderContext);
  const [isOpen, setIsOpen] = useState(false);
  const isDir = props.fileInfo.type === "directory";

  const handleSingleClick = async () => {
    // if (!isOpen && props.file.isDir) {
    //   // 展开状态，查询所有子文件数量
    //   const files = await expandOrCollapseFile(props.file.path);
    //   setChildFiles(files);
    // }
    // handleSelectedId(props.file.id, props.file.isDir, props.file.path);
    setIsOpen(!isOpen);
  };

  const isSelected = selectedId === props.fileInfo.id; // 是否选择当前文件

  // 文件项
  return (
    <>
      <div
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
          className="flex items-center gap-1.5 w-full z-10"
          style={{
            paddingLeft: isDir ? props.paddingLeft : props.paddingLeft + 16,
          }}
        >
          {/* 目录展开图标 */}
          {isDir ? (
            <IconFont
              name="arrow"
              className={cn("text-white", {
                "rotate-90": isOpen,
              })}
            />
          ) : null}
          {/* 文件图标 */}
          <IconFont
            name={isDir ? `dir_${isOpen ? "expand" : "collapse"}` : "file"}
            className="text-white"
          />
          {/* 文件名 */}
          <span
            className="flex-1 select-none block text-14px text-ellipsis whitespace-nowrap overflow-hidden"
            title={props.fileInfo.name}
          >
            {props.fileInfo.name}
          </span>
        </div>
      </div>
      {isDir && isOpen && (
        <>
          {props.fileInfo.children?.map((file, index) => (
            <Fragment key={file?.id ?? index}>
              {file ? (
                <FileItem
                  key={file?.id ?? index}
                  fileInfo={file}
                  paddingLeft={props.paddingLeft + 8}
                />
              ) : null}
            </Fragment>
          ))}
        </>
      )}
    </>
  );
}
