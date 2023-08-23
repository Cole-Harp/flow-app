import React, { useState, useEffect } from "react";

interface DropdownMenuProps {
  position: { x: number; y: number };
  toggleDropdown: () => void;
  addTextNode: (x: number, y: number) => void;
  addSimpleTextNode: (x: number, y: number) => void;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  position,
  toggleDropdown,
  addTextNode,
  addSimpleTextNode,
}) => {
  const { x, y } = position;
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    setMenuStyle({
      position: "absolute",
      top: y,
      left: x,
      display: "block",
      zIndex: 100000,
    });
  }, [x, y]);

  const handleAddTextNode = () => {
    addTextNode(x, y);
    toggleDropdown();
  };

  const handleAddSimpleTextNode = () => {
    console.log("HERE2", x, y);
    addSimpleTextNode(x, y);
    toggleDropdown();
  };

  return (
    <div className="dropdown-menu" style={menuStyle}>
      <button onClick={handleAddTextNode}>Add Text Node</button>
      <button onClick={handleAddSimpleTextNode}>Add Simple Text Node</button>
    </div>
  );
};

export default DropdownMenu;