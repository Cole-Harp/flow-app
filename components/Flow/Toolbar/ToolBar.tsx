import { Menu, PlusSquareIcon } from 'lucide-react';
import React, { useState } from 'react';
import { getConnectedEdges, getOutgoers, useReactFlow } from 'reactflow';
import add_row from "../../../public/add-row-svgrepo-com.svg";

interface DirectoryToolbarProps {
  nodes: any[];
  edges: any[];
}

const Toolbar: React.FC<DirectoryToolbarProps> = ({ nodes, edges }) => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [expandedNodes, setExpandedNodes] = useState<{ [key: string]: boolean }>({});
  const [nodeToInteract, setNodeToInteract] = useState();

  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', "blockNode", { id: generateUniqueId() });
    event.dataTransfer.effectAllowed = 'move';
  };

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  const { setCenter, setNodes, setEdges, getNodes } = useReactFlow();

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


    const togglePlaceholderNode = (nodeId) => {
      const nodess = getNodes();
      const nodeToReplace = nodess.find((node) => node.id === nodeId);
      const existingPlaceholderNode = nodess.find((node) => node.id === `placeholder-${nodeId}`);
    
      if (existingPlaceholderNode) {
        setNodes((currentNodes) =>
          currentNodes.map((node) => {
            if (node.id === `placeholder-${nodeId}`) {
              return {
                ...node,
                hidden: !node.hidden,
              
              };
            }
            return node;
          })
        );
      } else {
        const placeholderNode = {
          id: `placeholder-${nodeId}`,
          type: "blockNode",
          position: nodeToReplace.position,
          data: {},
          hidden: false,
        };
        setNodes((currentNodes) => [...currentNodes, placeholderNode]);
      }
    };
    
    const handleCheckboxChange = (event, node) => {
      togglePlaceholderNode(node.id);
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
        <div className="directory-toolbar p-1" key={node.id} style={{ marginLeft: `${indentation}px` }}>
          <input
            type="checkbox"
            id={node.id}
            onChange={(event) => handleCheckboxChange(event, node)}
          />
          {isRootNode && hasChildren ? (
            <button onClick={() => toggleNodeExpansion(node)}>▼</button>
          ) : null}
          <button
            style={{ marginLeft: `${indentation}px` }}
            onClick={() => handleNodeClick(node)}
          >
            {firstLine}
          </button>
          {isNodeExpanded(node.id) && renderChildNodes(node)}
        </div>
      );
    };

    return (
      <div className="p-1">
        {nodes
          .filter(node => getNodeDepth(node, nodes, edges) === 0)
          .map(node => renderNode(node, 0))}
      </div>
    );
  }

  const generateUniqueId = () => {
    return `node-${Math.random().toString(36)}`;
  };


  return (
    <div className="">
      <button onClick={toggleDropdown}><Menu /></button>
      {isDropdownVisible && (
        <div className='border border-1 border-black rounded' >
          <aside className=" bg-white border-border border-8 p-3">
            <div className="dndnode input align-middle border-border border-8 rounded" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }} onDragStart={(event) => onDragStart(event, 'blockNode')} draggable>
              <PlusSquareIcon size={50} className='p-1' />
            </div>
            <div className='flex flex-col transition-all duration-500 ease-out'>
              {nodeDir(nodes, edges, handleNodeClick)}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};

export default Toolbar;