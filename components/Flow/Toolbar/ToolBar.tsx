import { Menu } from 'lucide-react';
import React, { useState } from 'react';

const Toolbar = () => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  return (
    <div>
      <button onClick={toggleDropdown}><Menu /></button>
      {isDropdownVisible && (
        <aside style={{ position: 'relative', zIndex: 100000, background: 'black', padding: '1rem', borderRadius: '4px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>

          <div className="dndnode input" onDragStart={(event) => onDragStart(event, 'blockNode')} draggable>
            Block Node
          </div>
          <div className="dndnode" onDragStart={(event) => onDragStart(event, 'customNode')} draggable>
            Expand Node
          </div>
        </aside>
      )}
    </div>
  );
};

export default Toolbar;
