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
      <Handle type="target" position={Position.Top} />
      <div className="nodrag" style={{ minWidth: "400px" }} >
        <Editor id={id} onChange={setContent} onSave={handleSave} defaultContent={localContent} />
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};
export default Editor_;