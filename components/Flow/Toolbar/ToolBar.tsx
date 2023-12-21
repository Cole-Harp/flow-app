import { Menu, MenuIcon } from 'lucide-react';
import React, { useCallback, useState } from 'react';
import { useReactFlow } from 'reactflow';
import NoteCardComponent from '../NoteCard';
import { DropdownMenu } from './DropdownMenu';

interface DirectoryToolbarProps {
  nodes: any;
  edges: any;
  undo: () => void;
  redo: () => void;
  setIsPanningMode: (isPanningMode: boolean) => void;
  onLayoutChange: (layout: any, nodes, edges, rootNodeId) => void;
  isPanningMode: boolean;
}

const Toolbar = ({ nodes, edges, undo, redo, setIsPanningMode, isPanningMode, onLayoutChange }: DirectoryToolbarProps) => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isNoteCardVisible, setIsNoteCardVisible] = useState(false);

  const onDragStart = useCallback((event, nodeType, minWidth) => {
    event.dataTransfer.setData('application/reactflow', nodeType, { data: `node-${Math.random().toString(36)}`, minWidth });
    event.dataTransfer.effectAllowed = 'move';
  }, []);

  const toggleDropdown = () => setIsDropdownVisible(!isDropdownVisible);

  const handlePanningModeToggle = () => {
    setIsPanningMode(!isPanningMode);
  };

  const toggleNoteCard = () => {
    setIsNoteCardVisible(!isNoteCardVisible);
  };

  return (
    <div className=" max-w-max">
      <button className="p-2" onClick={toggleDropdown}>
        <MenuIcon className="w-6 h-6" />
      </button>
      {isDropdownVisible && (
        <DropdownMenu
          undo={undo}
          redo={redo}
          handlePanningModeToggle={handlePanningModeToggle}
          isPanningMode={isPanningMode}
          onDragStart={onDragStart} nodes={nodes} edges={edges}
          onLayoutChange={onLayoutChange} />
      )}
      <NoteCardComponent
        isVisible={isNoteCardVisible}
        onClose={toggleNoteCard}
      />
      
    </div>
  );
}

export default Toolbar;