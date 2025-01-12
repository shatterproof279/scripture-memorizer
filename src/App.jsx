import { useContext } from 'react';
import { MemorizerContext } from './contexts/MemorizerContext';
import { useMemorizer } from './hooks/useMemorizer';
import TextInput from './components/TextInput';
import ChunkDisplay from './components/ChunkDisplay';
import ProgressBar from './components/ProgressBar';
import ReviewMode from './components/ReviewMode';

function App() {
  const { state } = useContext(MemorizerContext);
  useMemorizer(); // Initialize persistence and review checking

  return (
    <MemorizerProvider>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-8">Text Memorizer</h1>
        
        {state.isReviewMode ? (
          <ReviewMode />
        ) : (
          <>
            <TextInput />
            <ChunkDisplay />
            <ProgressBar />
          </>
        )}
      </div>
    </MemorizerProvider>
  );
}

export default App; 