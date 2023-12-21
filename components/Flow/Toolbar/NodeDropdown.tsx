import React, { useCallback, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import ChildNodeDropdown from './ChildNodeDropDown';
import { useReactFlow } from 'reactflow';
import { fetchNoteCards } from '@/lib/AI/notecards';
import NoteCardsComponent from '../NoteCard';

const Dropdown = ({ node, nodes, edges, onLayoutChange }) => {
  const [expandedNodes, setExpandedNodes] = useState({});
  const [checkedNodes, setCheckedNodes] = useState<string[]>([]);
  const [nodeText, setNodeText] = useState<any>();
  const [renderNoteCards, setRenderNoteCards] = useState(false);

  const toggleNodeExpansion = nodeId => {
    setExpandedNodes(prev => ({ ...prev, [nodeId]: !prev[nodeId] }));
  };

  const isChecked = nodeId => checkedNodes.includes(nodeId);

  const handleNodeCheck = nodeId => {
    setCheckedNodes(current =>
      current.includes(nodeId) ? current.filter(id => id !== nodeId) : [...current, nodeId]
    );
  };

  const { setCenter, getNodes } = useReactFlow();
  const handleNodeClick = useCallback((node) => {
    const zoom = 1;
    const x = node.position.x + node.width / 2;
    const y = node.position.y + 470;
    setCenter(x, y, { zoom, duration: 1000 });
  }, [setCenter]);

  const getNodeObjects = () => {
    const nodeObjects = checkedNodes.map(nodeId => {
      const node = getNodes().find(n => n.id === nodeId);
      return node;
    });
    return nodeObjects;
  };

  const noteCards = async () => {
    const nodes = getNodeObjects();
    let concatenatedText = '';

    nodes.forEach(node => {
      if (node && node.data && node.data.text) {
        concatenatedText += node.data.text;
      }
    });
    const gptNotes = await fetchNoteCards(concatenatedText)
    console.log(gptNotes)
    setNodeText(gptNotes)
    setRenderNoteCards(true);

    // Use the concatenatedText string as needed
  };

  useEffect(() => {
    if (nodeText && renderNoteCards) {
      setRenderNoteCards(false);
    }
  }, [nodeText, renderNoteCards]);

  return (
    <>
      
      {getNodeObjects().map(childNode => (<div>{childNode.id}</div>))}
      {/* <button onClick={() => noteCards()}>Call noteCards</button> */}
      <ChildNodeDropdown
        rootNode={node}
        nodes={nodes}
        edges={edges}
        expandedNodes={expandedNodes}
        toggleNodeExpansion={toggleNodeExpansion}
        isChecked={isChecked}
        handleNodeCheck={handleNodeCheck}
        handleNodeClick={handleNodeClick}
        onLayoutChange = {onLayoutChange} />
    </>
  );
};

export default Dropdown;
