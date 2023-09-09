import { Handle, Position } from "reactflow";
import Editor from "@/TipTapEditor/editor";
import React, { useState } from "react";

interface BlockNodeProps {
  id: string;
  data: {
    content: string;
    updateNodeText: (id: string, content: string) => void;
  };
}

const nodeStyle = {
  border: "1px solid black",
  borderRadius: "20px",
  display: "inline-flex",
  flexDirection: "column" as const,
  alignItems: "center",
  padding: "20px",
};


const Editor_: React.FC<BlockNodeProps> = ({ id, data }) => {
  const { content, updateNodeText} = data
  const [localContent, setContent] = useState<string>(content);
  const handleSave = (content: string) => {
    console.log("BLOCK NODES", content)
    updateNodeText(id, content);
  };

  return (
    <div className = "text-node-editable" style={{ ...nodeStyle, minWidth: "400px", position: "relative"}} >
      <Handle type="target"  id="a" isConnectable={true} position={Position.Top} />
      <Handle type="target" id="b" isConnectable={true} position={Position.Left} />
      <div className="nodrag max-w-5xl" style={{ minWidth: "400px" }} >
        <Editor id={id} onChange={setContent} onSave={handleSave} defaultContent={localContent} />
      </div>
      <Handle type="source" id="a" isConnectable={true} position={Position.Bottom} />
      <Handle type="source" id="b" isConnectable={true} position={Position.Right} />
    </div>
  );
};
export default Editor_;