import React, { useState } from 'react';
const NoteCard = ({ front, back }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="bg-white shadow-lg rounded-lg p-4 m-4 cursor-pointer max-w-md w-full"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className="text-center font-semibold text-lg">
        {isFlipped ? <>{front}
        {back}</> 
        : front}
      </div>
    </div>
  );
};

const NoteCardComponent = ({ isVisible, onClose }) => {
  if (!isVisible) return null;

  const data = {
    "noteCards": [
      {
        "front": "Cell Body (Soma)",
        "back": "Contains the nucleus and cytoplasm. Function: Maintains the health of the neuron."
      },
      {
        "front": "Dendrites",
        "back": "Short, branched extensions spreading out from the cell body. Function: Receive signals from other neurons and transmit them towards the cell body."
      },
      {
        "front": "Axon",
        "back": "Long, slender projection from the cell body. Function: Carries nerve impulses away from the cell body to other neurons, muscles, or glands."
      },
      {
        "front": "Myelin Sheath",
        "back": "Fatty covering around the axon that speeds up the transmission of signals."
      },
      {
        "front": "Axon Terminals",
        "back": "Small branches at the end of the axon. Function: Release neurotransmitters to send the signal to the next neuron."
      },
      {
        "front": "Resting Potential",
        "back": "State of a neuron when not firing a neural impulse."
      },
      {
        "front": "Action Potential",
        "back": "A neural impulse; a brief electrical charge that travels down the axon."
      }
    ]
  }

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const noteCards = data && data.noteCards ? data.noteCards : [];

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : noteCards.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex < noteCards.length - 1 ? prevIndex + 1 : 0));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center px-4 py-6">
      <div className="bg-white p-6 rounded-xl shadow-2xl max-w-4xl w-full relative overflow-auto">
        <button onClick={onClose} className="absolute top-3 right-3 text-lg text-gray-600 hover:text-gray-800 transition-colors duration-200">
          x
        </button>
        <h2 className="text-2xl font-semibold mb-4">Note Card</h2>
        {showAll ? (
          <div className="flex flex-wrap justify-center">
            {noteCards.map((card, index) => (
              <NoteCard key={index} front={card.front} back={card.back} className={`transform ${index % 10 < 5 ? 'rotate-3' : '-rotate-3'}`} />
            ))}
          </div>
        ) : (
          <div className="flex justify-center">
            {noteCards.length > 0 && <NoteCard front={noteCards[currentIndex].front} back={noteCards[currentIndex].back} />}
          </div>
        )}
        <div className="flex justify-center mt-6 space-x-2">
          <button onClick={() => setShowAll(!showAll)} className="p-2 rounded bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-200">
            {showAll ? "Single" : "All"}
          </button>
          {!showAll && (
            <>
              <button onClick={handlePrev} className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-200">
                {/* SVG for left arrow */}
              </button>
              <button onClick={handleNext} className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-200">
                {/* SVG for right arrow */}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoteCardComponent;