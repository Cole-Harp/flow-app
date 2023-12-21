import React, { useCallback } from "react";
import { Node } from "reactflow";

export function drop(reactFlowWrapper: React.MutableRefObject<any>, reactFlowInstance: any, setNodes: React.Dispatch<React.SetStateAction<Node<Node, string>[]>>) {
  return useCallback(
    (event) => {
      event.preventDefault();
      id: Math.random().toString(36);
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');

      // check if the dropped element is valid
      if (typeof type === undefined || !type) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      const newNode = {
        id: Math.random().toString(36),
        type,
        position,
        data: {
          label: `${type} node`,
        },
      };

      setNodes((ns: any[]) => ns.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );
}
