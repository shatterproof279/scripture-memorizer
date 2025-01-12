import { createContext, useReducer } from 'react';

export const MemorizerContext = createContext();

const initialState = {
  originalText: '',
  chunks: [],
  currentChunkIndex: 0,
  progress: {},
  currentRound: 1,
  mastered: new Set(),
  lastReviewDates: {},
  settings: {
    reviewInterval: 24, // hours
    requiredAccuracy: 95, // percentage
    maxAttempts: 3
  },
  reviewQueue: [],
  isReviewMode: false,
  reviewHistory: {},
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_TEXT':
      return {
        ...state,
        originalText: action.payload,
        chunks: action.payload.chunks,
        currentChunkIndex: 0,
        progress: {},
      };
    case 'NEXT_CHUNK':
      return {
        ...state,
        currentChunkIndex: state.currentChunkIndex + 1,
        currentRound: 1,
      };
    case 'NEXT_ROUND':
      return {
        ...state,
        currentRound: state.currentRound + 1,
      };
    case 'MARK_MASTERED':
      return {
        ...state,
        mastered: new Set([...state.mastered, action.payload]),
      };
    case 'UPDATE_PROGRESS':
      return {
        ...state,
        progress: {
          ...state.progress,
          [state.currentChunkIndex]: {
            ...state.progress[state.currentChunkIndex],
            attempts: (state.progress[state.currentChunkIndex]?.attempts || 0) + 1,
            lastAccuracy: action.payload.accuracy
          }
        }
      };
    case 'SET_REVIEW_DATE':
      return {
        ...state,
        lastReviewDates: {
          ...state.lastReviewDates,
          [action.payload.chunkIndex]: action.payload.date
        }
      };
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.payload
        }
      };
    case 'LOAD_STATE':
      return {
        ...state,
        ...action.payload
      };
    case 'SET_REVIEW_QUEUE':
      return {
        ...state,
        reviewQueue: action.payload,
        isReviewMode: true
      };
    case 'COMPLETE_REVIEW':
      return {
        ...state,
        reviewHistory: {
          ...state.reviewHistory,
          [action.payload.chunkIndex]: [
            ...(state.reviewHistory[action.payload.chunkIndex] || []),
            {
              date: new Date().toISOString(),
              accuracy: action.payload.accuracy
            }
          ]
        },
        reviewQueue: state.reviewQueue.filter(index => index !== action.payload.chunkIndex)
      };
    case 'EXIT_REVIEW_MODE':
      return {
        ...state,
        isReviewMode: false,
        reviewQueue: []
      };
    default:
      return state;
  }
}

export function MemorizerProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <MemorizerContext.Provider value={{ state, dispatch }}>
      {children}
    </MemorizerContext.Provider>
  );
} 