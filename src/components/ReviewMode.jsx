import { useContext } from 'react';
import { MemorizerContext } from '../contexts/MemorizerContext';
import { validateUserInput } from '../utils/textProcessor';

export default function ReviewMode() {
  const { state, dispatch } = useContext(MemorizerContext);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState(null);

  const currentChunk = state.chunks[state.reviewQueue[currentReviewIndex]];

  const handleReviewSubmit = () => {
    const validation = validateUserInput(userInput, currentChunk);
    
    dispatch({
      type: 'COMPLETE_REVIEW',
      payload: {
        chunkIndex: state.reviewQueue[currentReviewIndex],
        accuracy: validation.accuracy
      }
    });

    setFeedback({
      type: validation.accuracy >= state.settings.requiredAccuracy ? 'success' : 'error',
      message: `Accuracy: ${validation.accuracy.toFixed(1)}%`
    });

    setTimeout(() => {
      if (currentReviewIndex < state.reviewQueue.length - 1) {
        setCurrentReviewIndex(prev => prev + 1);
        setUserInput('');
        setFeedback(null);
      } else {
        dispatch({ type: 'EXIT_REVIEW_MODE' });
      }
    }, 1500);
  };

  return (
    <div className="review-mode">
      <h2 className="text-xl font-bold mb-4">Review Mode</h2>
      <div className="progress-info mb-4">
        Reviewing chunk {currentReviewIndex + 1} of {state.reviewQueue.length}
      </div>

      <div className="chunk-display p-4 border rounded mb-4">
        {currentChunk}
      </div>

      <textarea
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="Type the text from memory..."
        className="w-full p-4 border rounded mb-4"
      />

      {feedback && (
        <div className={`feedback p-3 mb-4 rounded ${
          feedback.type === 'success' ? 'bg-green-100' : 'bg-red-100'
        }`}>
          {feedback.message}
        </div>
      )}

      <button
        onClick={handleReviewSubmit}
        className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
      >
        Submit Review
      </button>
    </div>
  );
} 