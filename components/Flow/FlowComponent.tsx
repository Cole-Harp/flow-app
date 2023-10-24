
import React, { useState, useCallback, useRef, useEffect } from "react";

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

const nodeTypes = {
  simpleText: SimpleTextNode,
  blockNode: BlockNode,
};

const defaultEdgeOptions = {
  animated: true,
  type: 'smoothstep',
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
  const { project } = useReactFlow();
  

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
  useEffect(() => {
  const handleUpdateFlow = () => {
    nodes.map((node) =>
      node.type === "simpleText" || "blockNode"
        ? { ...node, data: { ...node.data, updateNodeText } }
        : node,
    )
    console.log("updated")
    updateFlow(flow.flowId, JSON.stringify(nodes), JSON.stringify(edges))
  }});
  
  const debouncedHandleUpdateFlow = useDebounce(nodes, 2000);
  
  useEffect(() => {
    nodes.map((node) =>
      node.type === "simpleText" || "blockNode"
        ? { ...node, data: { ...node.data, updateNodeText } }
        : node,
    )
    console.log("updated")
    updateFlow(flow.flowId, JSON.stringify(nodes), JSON.stringify(edges))
  }, [debouncedHandleUpdateFlow, nodes, edges]);
  
  const onNodesChange: OnNodesChange = useCallback(
    (changes) => {
      setNodes((nodes) => customApplyNodeChanges(changes, nodes));

    }, [customApplyNodeChanges],
    
  );
  

  const onConnect: OnConnect = useCallback(
    (connection) => {
      // 👇 make adding edges undoable
      takeSnapshot();
      setEdges((edges) => addEdge(connection, edges));
    },
    [ takeSnapshot],
  );

  const updateNodeText = useCallback(
    (nodeId: string, newText: string) => {
      setNodes((prevNodes) =>
        prevNodes.map((node) => {
          if (node.id === nodeId) {
            return { ...node, data: { ...node.data, content: newText } };
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
    [nodes, edges, takeSnapshot],
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
  }, []);

  const onEdgeUpdateEnd = useCallback((_: any, edge: Edge) => {
    if (!edgeUpdateSuccessful.current) {
      setEdges((eds) => eds.filter((e) => e.id !== edge.id));
    }

    edgeUpdateSuccessful.current = true;
  }, []);

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
      position: project({
        x,
        y,
      }),
      data: {
        content: "New Text Node",
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
  [setNodes, setEdges],
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
    [setNodes, setEdges],
  );
  const toggleDropdown = useCallback(() => {
    setDropdownVisible(!dropdownVisible);
  }, [dropdownVisible]);

  const onConnectEnd = useCallback(
    (event: any) => {
      const targetIsPane = event.target.classList.contains("react-flow__pane");



      if (targetIsPane) {

        const position = project({
          x: event.clientX,
          y: event.clientY,
        });
        addBlockNode(position.x-200, position.y );
      }
    },
    [reactFlowWrapper, project]
  );

  const onElementDoubleClick = useCallback(
    (event: any, element: Node | Edge | Connection) => {
      if (isNode(element)) {
        setUndraggableNodeIds((prevUndraggableNodeIds) => {
          const newUndraggableNodeIds = new Set(prevUndraggableNodeIds);
          if (newUndraggableNodeIds.has(element.id)) {
            newUndraggableNodeIds.delete(element.id);
          } else {
            newUndraggableNodeIds.add(element.id);
          }
          return newUndraggableNodeIds;
        });
      }
    },
    [reactFlowWrapper],
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



  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      id: Math.random().toString(36)
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
        data: { label: `${type} node`,
                
      },
      };

      setNodes((ns: any[]) => ns.concat(newNode));
    },
    [reactFlowInstance]
  );


  return (
    <div
      className="wrapper"
      ref={reactFlowWrapper}
      style={{ width: "100%", height: "100vh" }}
      
    >
      <ReactFlow
        nodes={nodes
 // Exclude hidden nodes
          .map((node) =>
            node.type === "simpleText" || node.type === "blockNode"
              ? { ...node, data: { ...node.data, updateNodeText } }
              : node
          )}
      
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodesDelete={onNodesDelete}
        onKeyDown={handleKeyDown}
        onNodeDragStart={onNodeDragStart}
        onSelectionDragStart={onSelectionDragStart}
        onConnectStart={onConnectStart}
        onConnectEnd={onConnectEnd}
        onEdgeUpdate={onEdgeUpdate}
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
        <Panel position="top-left">
        <div className="fixed top-2 left-2">
        <ToolBar undo={undo} redo={redo} />
      
        </div>
        
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
              
      </ReactFlow>



      
    </div>
  );
}

function ReactFlowWrapper(props: any) {
  console.log("WRAPPER", props)
  return (

    <ReactFlowProvider>

              <FlowInstancePage  {...props} flow = {...props} />
              


    </ReactFlowProvider>

  );
}

export default ReactFlowWrapper;

