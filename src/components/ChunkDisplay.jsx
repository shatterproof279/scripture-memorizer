import { useContext, useState, useEffect } from 'react';
import { MemorizerContext } from '../contexts/MemorizerContext';
import { createHiddenVersion, validateUserInput } from '../utils/textProcessor';

export default function ChunkDisplay() {
  const { state, dispatch } = useContext(MemorizerContext);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  
  const currentChunk = state.chunks[state.currentChunkIndex];
  const currentProgress = state.progress[state.currentChunkIndex] || {};
  
  const validateAndProgress = () => {
    const validation = validateUserInput(userInput, currentChunk);
    
    dispatch({
      type: 'UPDATE_PROGRESS',
      payload: validation
    });
    
    if (validation.accuracy >= state.settings.requiredAccuracy) {
      setFeedback({
        type: 'success',
        message: 'Great job! Moving to next round.'
      });
      setTimeout(() => {
        handleNext();
        setFeedback(null);
      }, 1500);
    } else {
      setFeedback({
        type: 'error',
        message: `Accuracy: ${validation.accuracy.toFixed(1)}%. Try again.`
      });
    }
  };

  const handleNext = () => {
    setUserInput('');
    setShowAnswer(false);
    
    if (state.currentRound < 3) {
      dispatch({ type: 'NEXT_ROUND' });
    } else if (state.currentChunkIndex < state.chunks.length - 1) {
      dispatch({ type: 'NEXT_CHUNK' });
      dispatch({
        type: 'SET_REVIEW_DATE',
        payload: {
          chunkIndex: state.currentChunkIndex,
          date: new Date().toISOString()
        }
      });
    } else {
      dispatch({ type: 'MARK_MASTERED', payload: state.currentChunkIndex });
    }
  };

  return (
    <div className="chunk-display">
      <div className="progress-info mb-4">
        <span>Round {state.currentRound}/3</span>
        <span className="ml-4">
          Chunk {state.currentChunkIndex + 1}/{state.chunks.length}
        </span>
      </div>

      <div className="text-display p-4 border rounded mb-4">
        {getDisplayText()}
      </div>
      
      <textarea
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="Type the text here..."
        className="w-full p-4 border rounded mb-4"
      />
      
      {feedback && (
        <div className={`feedback p-3 mb-4 rounded ${
          feedback.type === 'success' ? 'bg-green-100' : 'bg-red-100'
        }`}>
          {feedback.message}
        </div>
      )}
      
      <div className="flex gap-4">
        <button
          onClick={validateAndProgress}
          className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
        >
          Check Answer
        </button>
        
        <button
          onClick={() => setShowAnswer(!showAnswer)}
          className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          {showAnswer ? 'Hide Answer' : 'Show Answer'}
        </button>
      </div>
      
      {showAnswer && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h3 className="font-bold mb-2">Original Text:</h3>
          {currentChunk}
        </div>
      )}
    </div>
  );
} 