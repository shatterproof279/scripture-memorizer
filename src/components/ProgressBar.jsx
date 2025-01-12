import { useContext } from 'react';
import { MemorizerContext } from '../contexts/MemorizerContext';

export default function ProgressBar() {
  const { state } = useContext(MemorizerContext);
  
  const calculateProgress = () => {
    if (!state.chunks.length) return 0;
    const masteredCount = state.mastered.size;
    return (masteredCount / state.chunks.length) * 100;
  };

  const getChunkStatus = (index) => {
    if (state.mastered.has(index)) return 'mastered';
    if (state.progress[index]?.attempts > 0) return 'in-progress';
    return 'not-started';
  };

  return (
    <div className="progress-container mt-8">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium">Overall Progress</span>
        <span className="text-sm font-medium">{calculateProgress().toFixed(1)}%</span>
      </div>
      
      <div className="h-2 bg-gray-200 rounded-full">
        <div 
          className="h-full bg-green-500 rounded-full transition-all"
          style={{ width: `${calculateProgress()}%` }}
        />
      </div>

      <div className="chunk-indicators flex gap-1 mt-4">
        {state.chunks.map((_, index) => (
          <div
            key={index}
            className={`h-2 flex-1 rounded ${
              getChunkStatus(index) === 'mastered'
                ? 'bg-green-500'
                : getChunkStatus(index) === 'in-progress'
                ? 'bg-yellow-500'
                : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
    </div>
  );
} 