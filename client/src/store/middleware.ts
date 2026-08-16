import { Middleware, isRejectedWithValue, isFulfilled } from '@reduxjs/toolkit';
import { addAlert } from '../features/alerts/alertsSlice';

// Helper to check if a value is an object with a 'message' property of type string
const hasMessage = (value: unknown): value is { message: string } => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'message' in value &&
    typeof (value as any).message === 'string'
  );
};

// Helper to check if a value is an object with a 'data' property
const hasData = (value: unknown): value is { data: unknown } => {
    return typeof value === 'object' && value !== null && 'data' in value;
}

export const rtkQueryErrorLogger: Middleware = (store) => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    let errorMessage = 'An error occurred';

    if (hasData(action.payload)) {
        if (typeof action.payload.data === 'string') {
            errorMessage = action.payload.data;
        } else if (hasMessage(action.payload.data)) {
            errorMessage = action.payload.data.message;
        }
    }

    store.dispatch(addAlert({ message: errorMessage, type: 'error' }));

  } else if (isFulfilled(action)) {
    if (action.type.includes('mutation') && action.type.endsWith('/fulfilled')) {
      let successMessage: string | null = null;

      if (typeof action.payload === 'string') {
        successMessage = action.payload;
      } else if (hasMessage(action.payload)) {
        successMessage = action.payload.message;
      }

      if (successMessage) {
        store.dispatch(addAlert({ message: successMessage, type: 'success' }));
      }
    }
  }

  return next(action);
};