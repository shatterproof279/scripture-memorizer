import { useContext } from 'react';
import { MemorizerContext } from '../contexts/MemorizerContext';
import { splitIntoChunks } from '../utils/textProcessor';

export default function TextInput() {
  const { dispatch } = useContext(MemorizerContext);

  const handleTextSubmit = (e) => {
    e.preventDefault();
    const text = e.target.text.value;
    const chunks = splitIntoChunks(text);
    
    dispatch({
      type: 'SET_TEXT',
      payload: {
        text,
        chunks,
      },
    });
  };

  return (
    <form onSubmit={handleTextSubmit} className="text-input-form">
      <textarea
        name="text"
        placeholder="Paste your text here..."
        rows="10"
        className="w-full p-4 border rounded"
      />
      <button
        type="submit"
        className="px-4 py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-600"
      >
        Start Memorizing
      </button>
    </form>
  );
} 