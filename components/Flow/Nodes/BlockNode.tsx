import { Handle, NodeResizeControl, NodeResizer, Position } from "reactflow";
import Editor from "@/TipTapEditor/editor";
import React, { memo, useState, useRef, useEffect } from "react";

interface BlockNodeProps {
  id: string;
  data: {
    content: string;
    updateNodeText: (id: string, content: string) => void;
    minWidth: number;
  };
}

const nodeStyle = {
  border: "1px solid black",
  borderRadius: "20px",
  flexDirection: "column" as const,
  alignItems: "center",
  padding: "20px",
};

const Editor_: React.FC<BlockNodeProps> = ({ id, data }) => {
  const { content, minWidth, updateNodeText} = data
  const [localContent, setContent] = useState<string>(content);
  const editorRef = useRef(null);
  const [editorHeight, setEditorHeight] = useState(0);

  useEffect(() => {
    if (editorRef.current) {
      setEditorHeight(editorRef.current.offsetHeight);
    }
  }, [editorRef.current]);

  const handleSave = (content: string) => {
    console.log("BLOCK NODES", content)
    updateNodeText(id, content);
  };

  return (
    <div className="text-node-editable flex-auto" style={nodeStyle}>
      <NodeResizeControl minWidth={300} minHeight={editorHeight} maxWidth={1920}  className="max-w-5xl" />

      <Handle type="target" id="a" isConnectable={true} position={Position.Top} />
      <Handle type="target" id="b" isConnectable={true} position={Position.Left} />
      <div className="nodrag" ref={editorRef}>
        <Editor id={id} onChange={setContent} onSave={handleSave} defaultContent={localContent} newQuery={null} />
      </div>
      <Handle type="source" id="a" isConnectable={true} position={Position.Bottom} />
      <Handle type="source" id="b" isConnectable={true} position={Position.Right} />

    </div>
  );
};
export default memo(Editor_);