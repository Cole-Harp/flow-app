import { Handle, Position, NodeResizer } from "reactflow";
import Editor from "@/ui/editor";
import { useState } from "react";

interface BlockNodeProps {
  id: string;
  data: {
    content: string;
    updateNodeText: (nodeId: string, newText: string) => void;
  };
}

const nodeStyle = {
  border: "1px solid black",
  borderRadius: "5px",
  display: "inline-flex",
  flexDirection: "column" as const,
  alignItems: "center",
  padding: "20px",
};


const Editor_: React.FC<BlockNodeProps> = ({ id, data }) => {
  const { content, updateNodeText} = data
  const [localContent, setContent] = useState<string>(content);
  const handleSave = (content: string) => {
    updateNodeText(id, content);
  };

  return (
    <div style={{ ...nodeStyle, width: "600px", position: "relative" }}>
      <Handle type="target" position={Position.Top} />
      <div className="text-node-editable nodrag" style={{ width: "597px" }}>
        <Editor id={id} onChange={setContent} onSave={handleSave} defaultContent={localContent} />
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};
export default Editor_;