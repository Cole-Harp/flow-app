import { Handle, NodeProps, Position } from 'reactflow';

type GetLabelParams = {
  expanded: boolean;
  expandable: boolean;
  visible: boolean;
};

function getLabel({ expanded, expandable, type, visible }: GetLabelParams & { type: string }): string {


  return expanded ? 'Click to collapse ▲' : 'Click to expand ▼';
}

export default function CustomNode({ data, id, xPos, yPos, type }: NodeProps) {
  const label = getLabel({ ...data, type });

  return (
    <div>
      <div>{label}</div>
      <Handle position={Position.Top} type="target" />
      <Handle position={Position.Bottom} type="source" />
    </div>
  );
}