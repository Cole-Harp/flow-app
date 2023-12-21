import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight, faCog, faSitemap } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

const ChildNodeDropdown = ({ rootNode, nodes, edges, expandedNodes, toggleNodeExpansion, isChecked, handleNodeCheck, handleNodeClick, onLayoutChange }) => {

  const [showButtons, setShowButtons] = useState(false);
  // Function to get child nodes of a given node
  const getChildNodes = (nodeId) => {
    return edges
      .filter(edge => edge.source === nodeId)
      .map(edge => nodes.find(n => n.id === edge.target));
  };

  const getDescendants = (nodeId, collectedNodes = [], collectedEdges = []) => {
    const childNodes = edges
      .filter(edge => edge.source === nodeId)
      .map(edge => {
        collectedEdges.push(edge);
        return nodes.find(n => n.id === edge.target);
      });

    collectedNodes.push(...childNodes);

    childNodes.forEach(childNode => {
      getDescendants(childNode.id, collectedNodes, collectedEdges);
    });

    return { nodes: collectedNodes, edges: collectedEdges };
  };

  // Function to render a single node
  const renderSingleNode = (node, depth) => {
    const indentation = depth * 20; // Adjust indentation value as needed
    const hasChildren = edges.some(edge => edge.source === node.id);
    const isExpanded = expandedNodes[node.id];
    const firstLine = node.data && node.data.content && node.data.content.content && node.data.content.content.length > 0 && node.data.content.content[0].content && node.data.content.content[0].content.length > 0
      ? node.data.content.content[0].content[0].text
      : 'No First Line';

    const childNodesClass = isExpanded 
      ? "max-h-96 opacity-100 transition-all duration-500 ease-in-out" 
      : "max-h-0 opacity-0 transition-all duration-500 ease-in-out";

    return (
        <div key={node.id} style={{ marginLeft: `${indentation}px` }} className="directory-toolbar p-1 truncate">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            className="form-checkbox h-5 w-5 text-blue-500"
            checked={isChecked(node.id)}
            onChange={() => handleNodeCheck(node.id)}
          />
                </label>
        <button className="ml-2" onClick={() => handleNodeClick(node)}>          
        <span className="ml-2">{firstLine}</span> </button>
        {hasChildren && (
          <button
            className={`inline-block ${isExpanded ? 'rotate-90' : 'rotate-0'} transition-transform pl-4 pb-1 mt-1`}
            onClick={() => toggleNodeExpansion(node.id)}
          >
            <FontAwesomeIcon icon={faCaretRight as IconProp} />
          </button>
        )}
        <div className={childNodesClass}>
          {getChildNodes(node.id).map(childNode => (
            <div key={childNode.id}>
              {renderSingleNode(childNode, depth + 1)}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const LayoutButton = ({ icon, onClick, rotation }) => (
    <button onClick={onClick} className='px-2'>
      <FontAwesomeIcon icon={icon as IconProp} className={rotation} />
    </button>
  );

  const Buttons = () => (
    <div className="right-2 bg-secondary py-1 my-1">
      {/* Vertical layout button */}
      <LayoutButton
        icon={faSitemap}
        onClick={() => {
          const { nodes: filteredNodes, edges: filteredEdges } = getDescendants(rootNode.id);
          onLayoutChange('TB', filteredNodes, filteredEdges, rootNode);
        } } rotation={undefined}          />

      {/* Horizontal layout button */}
      <LayoutButton
        icon={faSitemap}
        rotation="rotate-90"
        onClick={() => {
          const { nodes: filteredNodes, edges: filteredEdges } = getDescendants(rootNode.id);
          onLayoutChange('LR', filteredNodes, filteredEdges, rootNode);
        }}
      />
    </div>
  );

  return (
    <div>
      <button className='pl-1' onClick={() => setShowButtons(!showButtons)}>
        <FontAwesomeIcon icon={faCog as IconProp} />
      </button>
      {showButtons && <Buttons />}


      {renderSingleNode(rootNode, 0)}
    </div>
  );
};

export default ChildNodeDropdown;
