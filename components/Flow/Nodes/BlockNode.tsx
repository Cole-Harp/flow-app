import React, { memo, useState, useRef, useEffect } from "react";
import { Handle, NodeResizeControl, Position } from "reactflow";
import Editor from "@/TipTapEditor/editor"; // Make sure this path is correct
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTextWidth } from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

const WIDTH_SIZES = [600, 1200, 1800]; // Actual sizes
const SCALE_FACTOR = 0.25; // Scale factor for displaying the sizes

interface BlockNodeProps {
  id: string;
  data: {
    content: string;
    updateNodeText: (id: string, content: string) => void;
    getNodeText: (id: string, text: string) => string;
  };
}

const Editor_: React.FC<BlockNodeProps> = ({ id, data }) => {
  const { content, updateNodeText, getNodeText } = data;
  const [localContent, setContent] = useState<string>(content);
  const editorRef = useRef(null);
  const popupRef = useRef(null); // Ref for the popup
  const [editorHeight, setEditorHeight] = useState(0);
  const [editorWidth, setEditorWidth] = useState(WIDTH_SIZES[0]); // Default width
  const [showPopup, setShowPopup] = useState(false); // For showing/hiding the popup
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (editorRef.current) {
      setEditorHeight(editorRef.current.offsetHeight);
    }
  }, [editorRef, editorRef.current]);

  useEffect(() => {
    const handleResize = () => {
      const scale = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
      setScale(scale);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Function to handle click event
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowPopup(false);
      }
    };

    // Attach the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Remove the event listener on cleanup
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popupRef]);

  const handleSave = (content: string) => {
    console.log("BLOCK NODES", content);
    updateNodeText(id, content);
  };

  const handleGetText = (content: string) => {
    console.log("BLOCK NODES", content);
    getNodeText(id, content);
  };

  const selectWidth = (width) => {
    setEditorWidth(width);
    setShowPopup(false);
  };

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const nodeStyle = {
    border: "1px solid black",
    borderRadius: "20px",
    flexDirection: "column" as const,
    alignItems: "center",
    padding: "20px",
    width: `${editorWidth}px`,
  };

  const popupStyle = {
    position: "absolute" as const,
    border: "1px solid #ddd",
    padding: "10px",
    borderRadius: "5px",
    boxShadow: "0px 0px 10px rgba(0,0,0,0.2)",
    display: showPopup ? "block" : "none"
  };

  const widthBoxStyle = (width) => ({
    width: `${width * SCALE_FACTOR}px`,
    height: '20px',
    margin: '5px',
    cursor: 'pointer',
    border: '1px solid #ccc',
    textAlign: 'center' as const,
    lineHeight: '20px'
  });

  return (
    <div className="text-node-editable" style={nodeStyle}>
      <button onClick={togglePopup}>
      <FontAwesomeIcon icon={faTextWidth as IconProp} className="p-2" />
      </button>

      <div ref={popupRef} className="bg-white z-50" style={popupStyle}>
        {WIDTH_SIZES.map(size => (
          <div key={size} style={widthBoxStyle(size)} onClick={() => selectWidth(size)}>
          </div>
        ))}
      </div>

      <Handle type="target" id="a" isConnectable={true} position={Position.Top} />
      <Handle type="target" id="b" isConnectable={true} position={Position.Left} />
      <div className="nodrag" ref={editorRef}>
        <Editor id={id} onChange={setContent} onSave={handleSave} onGetText={handleGetText} defaultContent={localContent} newQuery={null} />
      </div>
      <Handle type="source" id="a" isConnectable={true} position={Position.Bottom} />
      <Handle type="source" id="b" isConnectable={true} position={Position.Right} />
    </div>
  );
};

export default memo(Editor_);
