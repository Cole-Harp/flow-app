"use client";
import React, { useState, useCallback, useRef, useEffect } from "react";
import dagre from 'dagre';

import ReactFlow, {
  ReactFlowProvider,
  Node,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  ConnectionLineType,
  Panel,
  getIncomers,
  getOutgoers,
  getConnectedEdges,
  applyNodeChanges,
  OnNodesChange,
  NodeChange,
  isNode,
  useReactFlow,
  OnConnect,
  NodeDragHandler,
  SelectionDragHandler,
  OnNodesDelete,
  OnEdgesDelete,
  updateEdge,
  
  NodeMouseHandler,
  NodeProps,
  MarkerType,
} from "reactflow";
import "@/app/styles/prosemirror.css";
import SimpleTextNode from "./Nodes/SimpleTextNode";
import BlockNode from "./Nodes/BlockNode";

import { getHelperLines } from "components/Flow/FlowUtils/utils";
import HelperLines from "components/Flow/FlowUtils/HelperLines";
import useUndoRedo from "components/Flow/FlowUtils/useUndoRedo";
import DropdownMenu from "components/Flow/FlowUtils/DropdownMenu";

import { FlowInstance } from "@prisma/client";
import { IconButton } from "@mui/material";
import UpgradeIcon from "@mui/icons-material/Upgrade";
import { updateFlow } from "@/lib/serv-actions/Flow";
import ToolBar from "components/Flow/Toolbar/ToolBar";
import { useDebounce } from "use-debounce";
import { ColorDropdown } from "./FlowUtils/ColorPicker";
import { drop } from "./drop";

const nodeTypes = {
  simpleText: SimpleTextNode,
  blockNode: BlockNode,
};

const defaultEdgeOptions = {
  animated: false,
  type: ConnectionLineType.SmoothStep,
}

const fitViewOptions = {
  padding: 3,
};

function FlowInstancePage({ flow }: { flow: FlowInstance }) {
  console.log(flow.nodes);
  const initial_nodes = JSON.parse(flow.nodes as string);
  const initial_edges = JSON.parse(flow.edges as string);
  const [nodes, setNodes] = useNodesState<Node>(initial_nodes || []);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(initial_edges || []);
  const [undraggableNodeIds, setUndraggableNodeIds] = useState(new Set<string>(),);
  const { undo, redo, canUndo, canRedo, takeSnapshot } = useUndoRedo();
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const edgeUpdateSuccessful = useRef(true);

  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });
  const reactFlowWrapper = useRef(null);
  const connectingNodeId = useRef(null);
  const { project, setCenter, screenToFlowPosition } = useReactFlow();
  

  const [helperLineHorizontal, setHelperLineHorizontal] = useState<
    number | undefined
  >(undefined);
  const [helperLineVertical, setHelperLineVertical] = useState<
    number | undefined
  >(undefined);



  const customApplyNodeChanges = useCallback(
    (changes: NodeChange[], nodes: Node[]): Node[] => {
      // reset the helper lines (clear existing lines, if any)
      setHelperLineHorizontal(undefined);
      setHelperLineVertical(undefined);

      // this will be true if it's a single node being dragged
      // inside we calculate the helper lines and snap position for the position where the node is being moved to
      if (
        changes.length === 1 &&
        changes[0].type === "position" &&
        changes[0].dragging &&
        changes[0].position
      ) {
        // Check if the node is undraggable
        if (undraggableNodeIds.has(changes[0].id)) {
          return nodes;
        }

        const helperLines = getHelperLines(changes[0], nodes);

        // if we have a helper line, we snap the node to the helper line position
        // this is being done by manipulating the node position inside the change object
        changes[0].position.x =
          helperLines.snapPosition.x ?? changes[0].position.x;
        changes[0].position.y =
          helperLines.snapPosition.y ?? changes[0].position.y;

        // if helper lines are returned, we set them so that they can be displayed
        setHelperLineHorizontal(helperLines.horizontal);
        setHelperLineVertical(helperLines.vertical);
      }


      return applyNodeChanges(changes, nodes);
    },
    [undraggableNodeIds],
  );
  
  const getAllChildNodes = (node, nodes, edges) => {
    const childNodes = getOutgoers(node, nodes, edges);
    let allChildNodes = [...childNodes];
  
    childNodes.forEach((childNode) => {
      const grandChildNodes = getAllChildNodes(childNode, nodes, edges);
      allChildNodes = [...allChildNodes, ...grandChildNodes];
    });
  
    return allChildNodes;
  };
  
  const debouncedHandleUpdateFlow = useDebounce(nodes, 1000);
  
  useEffect(() => {
    console.log("updated")
    updateFlow(flow.flowId, JSON.stringify(nodes), JSON.stringify(edges))
  }, [debouncedHandleUpdateFlow, nodes, edges, flow.flowId]);
  
  const onNodesChange: OnNodesChange = useCallback(
    (changes) => {
      setNodes((nodes) => customApplyNodeChanges(changes, nodes));
      

    }, [customApplyNodeChanges, setNodes],
    
  );
  

  const onConnect: OnConnect = useCallback(
    (connection) => {
      // 👇 make adding edges undoable
      takeSnapshot();
      setEdges((edges) => addEdge(connection, edges));
    },
    [ takeSnapshot, setEdges],
  );

  const updateNodeText = useCallback(
    (nodeId: string, newContent: string) => {
      setNodes((prevNodes) =>
        prevNodes.map((node) => {
          if (node.id === nodeId) {
            return { ...node, data: { ...node.data, content: newContent } };
          }
          return node;
        }),
      );
    },
    [setNodes],
  );

  const getNodeText = useCallback(
    (nodeId: string, text: string) => {
      setNodes((prevNodes) =>
        prevNodes.map((node) => {
          if (node.id === nodeId) {
            return { ...node, data: { ...node.data, text: text } };
          }
          return node;
        }),
      );
    },
    [setNodes],
  );


  const onNodesDelete: OnNodesDelete = useCallback(
    (deleted: Node[]) => {
      takeSnapshot();
      setNodes((prevNodes) =>
        prevNodes.filter((node) => !deleted.includes(node)),
      );
      setEdges((prevEdges) =>
        deleted.reduce((acc, node) => {
          const incomers = getIncomers(node, nodes, prevEdges);
          const outgoers = getOutgoers(node, nodes, prevEdges);
          const connectedEdges = getConnectedEdges([node], prevEdges);

          const remainingEdges = acc.filter(
            (edge) => !connectedEdges.includes(edge),
          );

          const createdEdges = incomers.flatMap(({ id: source }) =>
            outgoers.map(({ id: target }) => ({
              id: `${source}->${target}`,
              source,
              target,
            })),
          );

          return [...remainingEdges, ...createdEdges];
        }, prevEdges),
      );
    },
    [nodes, takeSnapshot, setEdges, setNodes],
  );

  const onEdgesDelete: OnEdgesDelete = useCallback(
    (deleted: Edge[]) => {
      takeSnapshot();
      setEdges((prevEdges) =>
        prevEdges.filter((edge) => !deleted.includes(edge)),
      );
    },
    [setEdges, takeSnapshot],
  );

  const onEdgeUpdateStart = useCallback(() => {
    edgeUpdateSuccessful.current = false;
  }, []);

  const onEdgeUpdate = useCallback((oldEdge: Edge, newConnection: any) => {
    edgeUpdateSuccessful.current = true;
    setEdges((els) => updateEdge(oldEdge, newConnection, els));
  }, [setEdges]);

  const onEdgeUpdateEnd = useCallback((_: any, edge: Edge) => {
    if (!edgeUpdateSuccessful.current) {
      setEdges((eds) => eds.filter((e) => e.id !== edge.id));
    }

    edgeUpdateSuccessful.current = true;
  }, [setEdges]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Delete") {
      const selectedNodes = nodes.filter((node) => node.selected);
      onNodesDelete(selectedNodes);

      const selectedEdges = edges.filter((edge) => edge.selected);
      onEdgesDelete(selectedEdges);
    }
  };

  const onConnectStart = useCallback((_, { nodeId }) => {
    connectingNodeId.current = nodeId;
  }, []);


  const addBlockNode = useCallback((x: any, y: any) => {
    const newNode = {
      id: Math.random().toString(36),
      type: "blockNode",
      position: screenToFlowPosition({
        x,
        y,
      }),
      data: {
        content: [],
      },
      hidden: false
    };
    setNodes((ns: any[]) => ns.concat(newNode));
    const edgeId = Math.random().toString(36);
    setEdges((eds: any[]) =>
      eds.concat({
        id: edgeId,
        source: connectingNodeId.current,
        target: newNode.id,
        hidden: false
      }),
    );
  },
  [setNodes, setEdges, screenToFlowPosition],
);

  const addSimpleTextNode = useCallback(
    (x: any, y: any) => {
      const newNode = {
        id: Math.random().toString(36),
        type: "simpleText",
        position: project({
          x,
          y,
        }),
        data: {
          label: "New Text Node",
          text: "New Text Node",

          
        },
      };

      setNodes((ns: any[]) => ns.concat(newNode));

      const edgeId = Math.random().toString(36);
      setEdges((eds: any[]) =>
        eds.concat({
          id: edgeId,
          source: connectingNodeId.current,
          target: newNode.id,
        }),
      );
    },
    [setNodes, setEdges, project],
  );
  const toggleDropdown = useCallback(() => {
    setDropdownVisible(!dropdownVisible);
  }, [dropdownVisible]);

  const onConnectEnd = useCallback(
    (event: any) => {
      const targetIsPane = event.target.classList.contains("react-flow__pane");



      if (targetIsPane) {

        const position = {
          x: event.clientX,
          y: event.clientY,
        };
        addBlockNode(position.x, position.y );
      }
    },
    [screenToFlowPosition]
  );

  const onElementDoubleClick = useCallback(
    (_: any, element: Node) => {
              const zoom = 1;
        const x = element.position.x + element.width / 2;
        const y = element.position.y + 470;
        setCenter(x, y, { zoom, duration: 1000 });
      // if (isNode(element)) {

      //   setUndraggableNodeIds((prevUndraggableNodeIds) => {
      //     const newUndraggableNodeIds = new Set(prevUndraggableNodeIds);
      //     if (newUndraggableNodeIds.has(element.id)) {
      //       newUndraggableNodeIds.delete(element.id);
      //     } else {
      //       newUndraggableNodeIds.add(element.id);
      //     }
      //     return newUndraggableNodeIds;
      //   });
      // }
    },
    [setCenter],
  );

  const onNodeDragStart: NodeDragHandler = useCallback(() => {
    // 👇 make dragging a node undoable
    takeSnapshot();
    // 👉 you can place your event handlers here
  }, [takeSnapshot]);

  const onSelectionDragStart: SelectionDragHandler = useCallback(() => {
    // 👇 make dragging a selection undoable
    takeSnapshot();
  }, [takeSnapshot]);


  const getLayoutedElements = (nodes, edges, rootNode, direction = 'TB') => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    dagreGraph.setGraph({ rankdir: direction });
  
    nodes.forEach(node => {
      dagreGraph.setNode(node.id, { width: node.width, height: node.height });
    });
  
    edges.filter(edge => 
      nodes.some(node => node.id === edge.source || node.id === edge.target)
    ).forEach(edge => {
      dagreGraph.setEdge(edge.source, edge.target);
    });
  
    dagre.layout(dagreGraph);
  
    const rootPosition = rootNode ? rootNode.position : { x: 0, y: 0 };
  
    const updatedNodes = nodes.map(node => {
      const nodeWithPosition = dagreGraph.node(node.id);
  
          // For x-offset, you can adjust as needed. Here, I'm just keeping it centered.
      const xOffset = (node.id !== rootNode.id) ? rootPosition.x - node.width / 2 : nodeWithPosition.x - node.width / 2;

    // Ensuring all nodes are always lower than the root node
      const yOffset = (node.id !== rootNode.id && nodeWithPosition.y < rootPosition.y) ? Math.abs(rootPosition.y*1.2) : nodeWithPosition.y - node.height / 2;

  
      return {
        ...node,
        position: {
          x: nodeWithPosition.x - node.width + xOffset,
          y: nodeWithPosition.y - node.height + yOffset,
        },
      };
    });
  
    return { nodes: updatedNodes, edges };
  };
  
  
  
  

  const onLayout = useCallback(
    (direction, subtreeNodes, allEdges, rootNode) => {
      // Get updated positions for the subtree nodes
      const { nodes: layoutedSubtreeNodes } = getLayoutedElements(
        subtreeNodes,
        allEdges,
        rootNode,
        direction,

      );
  
      // Merge updated subtree nodes with the full set of nodes
      const mergedNodes = nodes.map(node => 
        layoutedSubtreeNodes.find(subtreeNode => subtreeNode.id === node.id) || node
      );
  
      setNodes(mergedNodes); // Update the state with the merged nodes
      // Don't modify the edges state, as we are not changing edges here
    },
    [getLayoutedElements, setNodes, nodes]
  );
  



  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = drop(reactFlowWrapper, reactFlowInstance, setNodes);
  const [isPanningMode, setIsPanningMode] = useState(false);

  const [selectedEdge, setSelectedEdge] = useState(null);

  const handleEdgeClick = (edge) => {
    setSelectedEdge(edge);
  };


  return (
    <div
      className="wrapper"
      ref={reactFlowWrapper}
      style={{ width: "100%", height: "100%", position: "fixed" }}
      
    >
      <ReactFlow
        nodes={nodes
 // Exclude hidden nodes
          .map((node) =>
            node.type === "simpleText" || node.type === "blockNode"
              ? { ...node, data: { ...node.data, updateNodeText, getNodeText } }
              : node
          )}
      
        edges={edges}
        nodesConnectable={!isPanningMode}
        nodesDraggable={!isPanningMode}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onEdgeClick={handleEdgeClick}
      onEdgeUpdate={onEdgeUpdate}
        onConnect={onConnect}
        onNodesDelete={onNodesDelete}
        onKeyDown={handleKeyDown}
        onNodeDragStart={onNodeDragStart}
        onSelectionDragStart={onSelectionDragStart}
        onConnectStart={onConnectStart}
        onConnectEnd={onConnectEnd}
        onEdgeUpdateStart={onEdgeUpdateStart}
        onEdgeUpdateEnd={onEdgeUpdateEnd}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        connectionLineType={ConnectionLineType.SmoothStep}
        onNodeDoubleClick={onElementDoubleClick}
        onInit={setReactFlowInstance}
        onDrop={onDrop}
        onDragOver={onDragOver}
        autoPanOnNodeDrag
        fitView
        fitViewOptions={fitViewOptions}
        
      >

        <Panel position="top-left" className="fixed left-2 top-2">
          <ToolBar nodes={nodes} edges={edges} undo={undo} redo={redo} setIsPanningMode={setIsPanningMode} isPanningMode={isPanningMode} onLayoutChange={onLayout} />
        </Panel>
        <HelperLines
          horizontal={helperLineHorizontal}
          vertical={helperLineVertical}
        />

        {dropdownVisible && (
          <DropdownMenu
            position={dropdownPosition}
            toggleDropdown={toggleDropdown}
            addTextNode={addBlockNode}
            addSimpleTextNode={addSimpleTextNode}
          />
        )}
        {selectedEdge && (
        <LineCustomizationMenu
          x={selectedEdge.sourceX}
          y={selectedEdge.sourceY}
          onItemClicked={(item) => {
            // Update the edge based on the selected item
            const updatedEdge = { ...selectedEdge };
            switch (item.value) {
              case "color":
                updatedEdge.style = { ...updatedEdge.style, stroke: "red" };
                break;
              case "thickness":
                updatedEdge.style = { ...updatedEdge.style, strokeWidth: 5 };
                break;
              case "arrow":
                updatedEdge.style = { ...updatedEdge, markerEnd: {type: MarkerType.ArrowClosed}

                };
                break;
            }
            onEdgeUpdate(selectedEdge, updatedEdge);
            setSelectedEdge(null);
          }}
        />
      )}
      </ReactFlow>



      
    </div>
  );
}

function LineCustomizationMenu({ x, y, onItemClicked }) {
  const items = [
    { label: "Change Color", value: "color" },
    { label: "Set Thickness", value: "thickness" },
    { label: "Add Arrow", value: "arrow" },
  ];

  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: x,
        backgroundColor: "gray",
        borderRadius: 4,
        padding: 8,
        boxShadow: "0 0 4px rgba(0, 0, 0, 0.2)",
        zIndex: 100,
      }}
    >
      {items.map((item) => (
        <button
          key={item.value}
          onClick={() => onItemClicked(item)}
          style={{ display: "block", marginBottom: 4 }}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

function ReactFlowWrapper(props: any) {
  console.log("WRAPPER", props)
  return (

    <ReactFlowProvider>

              <FlowInstancePage flow={props} />
              


    </ReactFlowProvider>

  );
}

export default ReactFlowWrapper;

