import React, { MouseEventHandler } from 'react';
import { Handle, NodeProps, Position, useReactFlow } from 'reactflow';


type GetLabelParams = {
  expanded: boolean;
  expandable: boolean;
};

function getLabel({ expanded, expandable }: GetLabelParams): string {
  if (!expandable) {
    return 'nothing to expand';
  }

  return expanded ? 'Click to collapse ▲' : 'Click to expand ▼';
}

export default function CustomNode({ data, id, xPos, yPos }: NodeProps) {
  const { addNodes, addEdges } = useReactFlow();

  const addChildNode: MouseEventHandler = (evt) => {
    if (data.expanded) {
      evt.preventDefault();
      evt.stopPropagation();
    }

    const newNodeId = `${id}__${new Date().getTime()}`;

    addNodes({ id: newNodeId, position: { x: xPos, y: yPos + 100 }, data: { label: 'X' } });
    addEdges({ id: `${id}->${newNodeId}`, source: id, target: newNodeId });
  };

  const label = getLabel(data);

  return (
    <div className="bg-black">
      <div className="text-center font-mono text-sm">{label}</div>
      <Handle position={Position.Top} type="target" />
      <Handle position={Position.Bottom} type="source" />
      <div
        className="absolute bottom-[-20px] left-1/2 transform -translate-x-1/2 w-24 text-center text-xs font-mono text-gray-500 bg-gray-200 hover:text-gray-800"
        onClick={addChildNode}
      >
        + add child node
      </div>
    </div>
  );
}
