export function splitIntoChunks(text) {
  // Split text into sentences
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
  const chunks = [];
  let currentChunk = '';

  for (const sentence of sentences) {
    if (currentChunk.length + sentence.length > 150) {
      chunks.push(currentChunk.trim());
      currentChunk = sentence;
    } else {
      currentChunk += ' ' + sentence;
    }
  }
  
  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

export function createHiddenVersion(text, hidePercentage) {
  const words = text.split(' ');
  const hiddenWords = words.map((word, index) => {
    if (Math.random() < hidePercentage) {
      return '_'.repeat(word.length);
    }
    return word;
  });
  
  return hiddenWords.join(' ');
}

export function validateUserInput(userInput, originalText) {
  const normalizedInput = userInput.trim().toLowerCase();
  const normalizedOriginal = originalText.trim().toLowerCase();
  
  // Calculate similarity percentage
  let correct = 0;
  const inputWords = normalizedInput.split(' ');
  const originalWords = normalizedOriginal.split(' ');
  
  inputWords.forEach((word, index) => {
    if (originalWords[index] === word) {
      correct++;
    }
  });
  
  return {
    accuracy: (correct / originalWords.length) * 100,
    isCorrect: normalizedInput === normalizedOriginal,
    mistakes: originalWords.length - correct
  };
}

export function getHiddenWordsPattern(round, totalWords) {
  switch (round) {
    case 1: // Show all words
      return Array(totalWords).fill(false);
    case 2: // Hide ~30% of words
      return Array(totalWords).fill(false).map(() => Math.random() < 0.3);
    case 3: // Hide ~60% of words
      return Array(totalWords).fill(false).map(() => Math.random() < 0.6);
    default:
      return Array(totalWords).fill(false);
  }
} 