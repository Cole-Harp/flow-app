import React from 'react';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndo, faRedo, faArrowsUpDownLeftRight } from '@fortawesome/free-solid-svg-icons';

export function FlowNavButtons({ undo, redo, handlePanningModeToggle, isPanningMode }) {
  return (
    <div className="flex justify-center items-center space-x-2">
      <button className="border border-white rounded p-2" onClick={undo}>
        <FontAwesomeIcon icon={faUndo as IconProp} className="w-4 h-4" />
      </button>
      <button className="border border-white rounded p-2" onClick={redo}>
        <FontAwesomeIcon icon={faRedo as IconProp} className="w-4 h-4" />
      </button>
      <button className={`border border-white rounded p-2 ${isPanningMode ? 'bg-secondary' : ''}`} onClick={handlePanningModeToggle}>
        <FontAwesomeIcon icon={faArrowsUpDownLeftRight as IconProp} className="w-4 h-4" />
      </button>
    </div>
  );
}
