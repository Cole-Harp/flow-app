import { Menu, MenuIcon, PlusSquareIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { getConnectedEdges, getOutgoers, useReactFlow } from 'reactflow';
import { faUndo, faRedo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


interface DirectoryToolbarProps {
  undo: () => void;
  redo: () => void;
}

const Toolbar: React.FC<DirectoryToolbarProps> = (props) => {
  const { undo, redo } = props;
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [expandedNodes, setExpandedNodes] = useState<{ [key: string]: boolean }>({});
  const [nodeToInteract, setNodeToInteract] = useState();
  const { setCenter, setNodes, setEdges, getNodes, getEdges } = useReactFlow();
  const nodes = getNodes();
  const edges = getEdges();

  const onDragStart = (event, nodeType, minWidth) => {
    event.dataTransfer.setData('application/reactflow', nodeType, { data: `node-${Math.random().toString(36)}`, minWidth: minWidth });
    event.dataTransfer.effectAllowed = 'move';
  };

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  const getAllChildNodes = (node) => {
    const childNodes = getOutgoers(node, nodes, edges);
    let allChildNodes = [...childNodes];

    childNodes.forEach((childNode) => {
      const grandChildNodes = getAllChildNodes(node);
      allChildNodes = [...allChildNodes, ...grandChildNodes];
    });

    return allChildNodes;
  };

  const onExpandOrCollapse = () => {

    // Toggle the expanded state of the clicked node

    // Get the child nodes and connected edges of the clicked node
    const childNodes = getAllChildNodes(nodeToInteract);
    const connectedEdges = getConnectedEdges(childNodes, edges);

    // Update the isHidden attribute for child nodes and connected edges based on expandedNodes state
    if (nodes) {
      setNodes((nds) =>
        nds.map((n) => {
          if (childNodes.some((childNode) => childNode.id === n.id)) {
            const parentNode = nodes.find(parentNode => edges.some(edge => edge.target === n.id && edge.source === parentNode.id));
            const isParentExpanded = parentNode && expandedNodes[parentNode.id];
            return { ...n, hidden: !isParentExpanded };
          }
          return n;
        })
      );

      setEdges((eds) =>
        eds.map((e) => {
          if (connectedEdges.includes(e)) {
            const parentNode = nodes.find(parentNode => parentNode.id === e.source);
            const isParentExpanded = parentNode && expandedNodes[parentNode.id];
            return { ...e, hidden: !isParentExpanded };
          }
          return e;
        })
      );
    }
  };

  const handleNodeClick = (node: any) => {
    console.log("POS", -node.position.x, -node.position.y)
    const zoom = 1;
    const x = node.position.x + node.width / 2;
    const y = node.position.y + 470;
    setCenter(x, y, { zoom, duration: 1000 });
  };

  const getNodeDepth = (node, nodes, edges) => {
    const parentEdges = edges ? edges.filter(edge => edge.target === node.id) : [];
    if (parentEdges.length === 0) {
      return 0;
    }
    const parentNode = nodes.find(n => n.id === parentEdges[0].source);
    return getNodeDepth(parentNode, nodes, edges) + 1;
  };

  function nodeDir(nodes, edges, handleNodeClick) {
    const toggleNodeExpansion = (node) => {
      setExpandedNodes((prevExpandedNodes) => ({
        ...prevExpandedNodes,
        [node.id]: !prevExpandedNodes[node.id],
      }));
      setNodeToInteract(node)
      // onExpandOrCollapse();
    };

    const renderChildNodes = (parentNode) => {
      const childEdges = edges.filter(edge => edge.source === parentNode.id);
      if (childEdges.length === 0) {
        return null;
      }

      return (
        <div>
          {childEdges.map(edge => {
            const childNode = nodes.find(node => node.id === edge.target);
            const depth = getNodeDepth(childNode, nodes, edges);
            return (
              <div key={childNode.id}>
                {renderNode(childNode, depth)}
                {renderChildNodes(childNode)}
              </div>
            );
          })}
        </div>
      );
    };

    const isNodeExpanded = (nodeId) => {
      return expandedNodes[nodeId] === true;
    };


    const toggleLearnNode = (nodeId) => {
      const nodeToReplace = nodes.find((node) => node.id === nodeId);
      const learnNodeId = `learn-${nodeId}`;
      const learnNode = nodes.find((node) => node.id === learnNodeId);

      if (!learnNode) {
        // Create a new learn node with the same position as nodeToReplace
        const newLearnNode = {
          id: `learn-${nodeId}`,
          type: "blockNode",
          position: nodeToReplace.position,
          data: { ...nodeToReplace.data }
        }



        setNodes((nds) => [...nds, newLearnNode]);
      } else {
        // Toggle the hidden attribute of the learn node
        setNodes((nds) =>
          nds.map((n) => {
            if (n.id === learnNodeId) {
              return { ...n, hidden: !n.hidden };
            }
            return n;
          })
        );
      }
    };


    const handleCheckboxChange = (event, node) => {
      toggleLearnNode(node.id);
    };

    const renderNode = (node, depth) => {
      const indentation = depth * 20; // Change 20 to the desired indentation value
      const isRootNode = depth === 0;
      const hasChildren = edges.some(edge => edge.source === node.id);
      const content = node.data ? node.data.content ?? "" : "";

      let firstLine = 'No First Line';

      if (content && content.content && content.content.length > 0 && content.content[0].content && content.content[0].content.length > 0) {
        firstLine = content.content[0].content[0].text;
      }

      return (
        <div className="directory-toolbar p-1 truncate" key={node.id} style={{ marginLeft: `${indentation}px` }}>
          {isRootNode && hasChildren ? (
            <button onClick={() => toggleNodeExpansion(node)}>▼</button>
          ) : null}
          <button
            style={{ marginLeft: `${indentation}px` }}
            onClick={() => handleNodeClick(node)}
          >
            {firstLine}
          </button>
          <input
            type="checkbox"
            className=" ml-1"
            id={node.id}
            onChange={(event) => handleCheckboxChange(event, node)}
          />
          {isNodeExpanded(node.id) && renderChildNodes(node)}
        </div>
      );
    };

    return (
      <div className="p-1">
        {nodes
          .filter(node => getNodeDepth(node, nodes, edges) === 0 && !node.id.startsWith("learn-"))
          .map(node => renderNode(node, 0))}
      </div>
    );
  }



  return (
    <div className="max-w-lg">
      <button className="p-2" onClick={toggleDropdown}>
        <MenuIcon className="w-6 h-6" />
      </button>
      {isDropdownVisible && (
        <div className="absolute z-10">
          <div className="bg-white border border-black rounded-lg shadow-lg ">
            <div className="content-center align-middle">
              <button className="border border-white rounded p-2" disabled={false} onClick={undo}>
                <FontAwesomeIcon icon={faUndo} className="w-4 h-4" />
              </button>
              <button className="border border-white rounded p-2" disabled={false} onClick={redo}>
                <FontAwesomeIcon icon={faRedo} className="w-4 h-4" />
              </button>
            </div>
            <div className="flex p-3">
              <div onDragStart={(event) => onDragStart(event, 'blockNode', 400)} draggable className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-500 text-white">
                <PlusSquareIcon className="w-8 h-8" />
              </div>
              
            </div>
            <div className="p-3">
              <div className="flex flex-col">
                {nodeDir(nodes, edges, handleNodeClick)}
              </div>
            </div>
            <div className="p-3">
              {/* <ChatPage params={{ chatId: '1' }} /> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
      }

export default Toolbar;