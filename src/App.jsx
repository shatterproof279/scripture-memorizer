import { useContext } from 'react';
import { MemorizerContext, MemorizerProvider } from './contexts/MemorizerContext';
import { useMemorizer } from './hooks/useMemorizer';
import TextInput from './components/TextInput';
import ChunkDisplay from './components/ChunkDisplay';
import ProgressBar from './components/ProgressBar';
import ReviewMode from './components/ReviewMode';

function AppContent() {
  const { state } = useContext(MemorizerContext);
  useMemorizer(); // Initialize persistence and review checking

  return (
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
  );
}

function App() {
  return (
    <MemorizerProvider>
      <AppContent />
    </MemorizerProvider>
  );
}

export default App; 