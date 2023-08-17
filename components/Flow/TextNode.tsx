"use client"
import React, { useState, memo } from "react";
import { Handle, Position } from "reactflow";
import RichTextEditor from "../RichTextEditor/RichTextEditor";

interface TextNodeProps {
  id: string;
  data: {
    text: string;
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

const TextNode: React.FC<TextNodeProps> = ({ id, data }) => {
  const { text, updateNodeText } = data;
  const [localText, setLocalText] = useState<string>(text);

  const handleTextChange = (newText: string) => {
    setLocalText(newText);
    updateNodeText(id, newText);
  };

  return (
    <div style={{ ...nodeStyle, width: "600px" }}>
      <Handle type="target" position={Position.Top} />
      <div className="text-node-editable nodrag" style={{ width: "600px" }}>
        <RichTextEditor value={localText} onChange={handleTextChange} />
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default memo(TextNode);
