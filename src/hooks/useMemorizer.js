import { useEffect, useContext } from 'react';
import { MemorizerContext } from '../contexts/MemorizerContext';

const STORAGE_KEY = 'text_memorizer_state';

export function useMemorizer() {
  const { state, dispatch } = useContext(MemorizerContext);

  // Load state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        // Convert mastered back to Set
        parsed.mastered = new Set(parsed.mastered);
        dispatch({ type: 'LOAD_STATE', payload: parsed });
      } catch (error) {
        console.error('Failed to load saved state:', error);
      }
    }
  }, []);

  // Save state to localStorage
  useEffect(() => {
    const stateToSave = {
      ...state,
      mastered: Array.from(state.mastered) // Convert Set to Array for JSON
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
  }, [state]);

  // Check for due reviews
  useEffect(() => {
    const checkReviews = () => {
      const now = new Date();
      const dueChunks = Object.entries(state.lastReviewDates).filter(([chunkIndex, date]) => {
        const reviewDate = new Date(date);
        const hoursSinceReview = (now - reviewDate) / (1000 * 60 * 60);
        return hoursSinceReview >= state.settings.reviewInterval;
      });

      if (dueChunks.length > 0) {
        dispatch({
          type: 'SET_REVIEW_QUEUE',
          payload: dueChunks.map(([index]) => parseInt(index))
        });
      }
    };

    const interval = setInterval(checkReviews, 1000 * 60 * 5); // Check every 5 minutes
    checkReviews(); // Initial check

    return () => clearInterval(interval);
  }, [state.lastReviewDates, state.settings.reviewInterval]);

  return {
    getDueReviews: () => {
      const now = new Date();
      return Object.entries(state.lastReviewDates)
        .filter(([chunkIndex, date]) => {
          const reviewDate = new Date(date);
          const hoursSinceReview = (now - reviewDate) / (1000 * 60 * 60);
          return hoursSinceReview >= state.settings.reviewInterval;
        })
        .map(([index]) => parseInt(index));
    }
  };
} 