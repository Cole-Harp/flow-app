import { useMemo } from 'react';
import { Node, Edge, XYPosition } from 'reactflow';
import { HierarchyNode, HierarchyPointNode, stratify, tree } from 'd3-hierarchy';
import { ExpandCollapseNode } from '../types';

export type UseExpandCollapseOptions = {
  layoutNodes?: boolean;
  treeWidth?: number;
  treeHeight?: number;
};

function useExpandCollapse(
    nodes: Node[],
    edges: Edge[],
    { layoutNodes = true }: UseExpandCollapseOptions = {}
  ): { nodes: Node[]; edges: Edge[] } {
    return useMemo(() => {
      const expandedNodes = nodes.map((node) => {
        const parentNode = edges.find((edge) => edge.target === node.id);
        const expandable = edges.some((edge) => edge.source === node.id);
  
        if (!parentNode) {
          return { ...node, data: { ...node.data, expandable } };
        }
        const parent = nodes.find((n) => n.id === parentNode.source);
        return parent && parent.data.expanded
          ? { ...node, data: { ...node.data, expandable } }
          : node;
      });
  
      const filteredEdges = edges.filter((edge) =>
        expandedNodes.find((node) => node.id === edge.source) && expandedNodes.find((node) => node.id === edge.target)
      );
  
      return {
        nodes: expandedNodes,
        edges: filteredEdges,
      };
    }, [nodes, edges, layoutNodes]);
  }

export default useExpandCollapse;