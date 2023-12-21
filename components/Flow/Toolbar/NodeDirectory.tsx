import React, { useCallback, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import ChildNodeDropdown from "./ChildNodeDropDown";
import Dropdown from "./NodeDropdown";
import { useReactFlow } from "reactflow";

const NodeDirectory = ({ nodes, edges, onLayoutChange }) => {
  const [expandedNodes, setExpandedNodes] = useState({});
  const [selectedNodes, setSelectedNodes] = useState([]);
  const [isNodeDirectoryVisible, setIsNodeDirectoryVisible] = useState(false);

  const { setCenter } = useReactFlow();


  const handleCheckboxChange = (nodeId, isChecked) => {
    setSelectedNodes(prev => {
      const newSet = [...prev];
      isChecked ? newSet.push(nodeId) : newSet.splice(newSet.indexOf(nodeId), 1);
      return newSet;
    });
  };

  const getNodeDepth = (nodeId, depth = 0) => {
    const parentEdge = edges.find(edge => edge.target === nodeId);
    return parentEdge ? getNodeDepth(parentEdge.source, depth + 1) : depth;
  };
  //TODO MOVE INDENTING UP


  const handleNodeDirectoryToggle = () => {
    setIsNodeDirectoryVisible(!isNodeDirectoryVisible);
  };
  const expandButtonClass = isNodeDirectoryVisible ? "rotate-90 transition-transform" : "rotate-0 transition-transform";

  return (
    <div className="">
      <button className={`inline-block ${expandButtonClass} pl-1 pb-1 mt-1`} onClick={handleNodeDirectoryToggle}>
        {selectedNodes}
        <FontAwesomeIcon icon={faCaretRight as IconProp} className="w-6 h-8" />
      </button>

      <div className={`transition-all duration-500 ease-in-out ${
          isNodeDirectoryVisible ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
              {isNodeDirectoryVisible && (
        nodes
          .filter(node => getNodeDepth(node.id) === 0 && !node.id.startsWith("learn-"))
          .map(node =>         
          <Dropdown
            node={node}
            nodes={nodes}
            edges={edges}
            onLayoutChange={onLayoutChange}
  
          />)
          )}
      </div>

    </div>
  );
};


export default NodeDirectory;


// const renderChildNodes = node => {
//   let allChildNodes = [];

//   const findAllChildNodes = currentNode => {
//     edges
//       .filter(edge => edge.source === currentNode.id)
//       .forEach(edge => {
//         const childNode = nodes.find(n => n.id === edge.target);
//         allChildNodes.push(childNode);
//         findAllChildNodes(childNode);
//       });
//   };

//   findAllChildNodes(node);
//   return allChildNodes.map(childNode => renderNode(childNode, getNodeDepth(childNode.id)));
// };
