import { PlusSquareIcon } from 'lucide-react';
import React from 'react';

export const DraggableNode = ({ onDragStart }) => (
  <div
    onDragStart={(event) => onDragStart(event, 'blockNode', 400)}
    draggable
    className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-500 text-white"
  >
    <PlusSquareIcon className="w-8 h-8" />
  </div>
);
