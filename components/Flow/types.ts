import { Node, XYPosition } from 'reactflow';

export type NodeData = {
  expanded: boolean;
  expandable: boolean;
  position?: XYPosition;
};

export type ExpandCollapseNode = Node<NodeData>;

