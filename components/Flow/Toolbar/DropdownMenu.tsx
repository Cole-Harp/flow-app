import React from 'react';
import NodeDirectory from './NodeDirectory';
import { FlowNavButtons } from './FlowNavButtons';
import { DraggableNode } from './DraggableNode';

export const DropdownMenu = ({ nodes, edges, undo, redo, handlePanningModeToggle, isPanningMode, onDragStart, onLayoutChange }) => (
  <div className="absolute z-50">
    <div className="bg-white border border-black rounded-lg shadow-lg">
      <div className="flex justify-center items-center p-2 px-4">
        <FlowNavButtons
          undo={undo}
          redo={redo}
          handlePanningModeToggle={handlePanningModeToggle}
          isPanningMode={isPanningMode} />
      </div>
      {/* <button onClick={() => setIsNoteCardVisible(true)}>Open Note Card</button> */}
      <div className="p-3">
        <DraggableNode onDragStart={onDragStart} />
      </div>
    </div>
    <div className="absolute bg-white border border-black rounded-lg shadow-lg border-t mt-4 max-w-md">
      <NodeDirectory
        onLayoutChange={onLayoutChange}
        nodes={nodes}
        edges={edges} />
    </div>
  </div>
);
