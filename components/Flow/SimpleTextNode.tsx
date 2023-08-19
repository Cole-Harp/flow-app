import React, { useState, useRef, useEffect, ChangeEvent, memo } from "react";
import { Handle, Position } from "reactflow";

interface TextNodeProps {
  id: string;
  data: {
    text: string;
    updateNodeText: (id: string, text: string) => void;
  };
}

const nodeStyle = {
  border: "1px solid black",
  borderRadius: "5px",
  display: "inline-flex",
  flexDirection: "column" as const,
  alignItems: "center",
  padding: "5px",
};

const SimpleTextNode: React.FC<TextNodeProps> = ({ id, data }) => {
  const { text, updateNodeText } = data;
  const [localText, setLocalText] = useState<string>(text);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newText = event.target.value;
    setLocalText(newText);
    updateNodeText(id, newText);
  };

  return (
    <div style={{ ...nodeStyle, maxWidth: "600px" }}>
      <Handle type="target" position={Position.Top} />
      <input
        ref={inputRef}
        value={localText}
        onChange={handleTextChange}
        style={{ width: "100%", border: "none", background: "transparent" }}
      />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default memo(SimpleTextNode);
