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

export const rtkQueryErrorLogger: Middleware = (store) => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    let errorMessage = 'An error occurred';

    const payload = action.payload as any;

    if (payload) {
      if (
        payload.status === 'FETCH_ERROR' ||
        payload.status === 'TIMEOUT_ERROR' ||
        payload.status === 502 ||
        payload.status === 503 ||
        payload.status === 504
      ) {
        errorMessage = 'No response from the server. Please check your connection and try again.';
      } else if (typeof payload.status === 'number') {
        // HTTP Error
        let msg: string | null = null;
        if (payload.data) {
          if (typeof payload.data === 'string' && payload.data.trim() !== '') {
            msg = payload.data;
          } else if (typeof payload.data === 'object' && payload.data !== null) {
            if ('message' in payload.data && typeof payload.data.message === 'string' && payload.data.message.trim() !== '') {
              msg = payload.data.message;
            } else if ('error' in payload.data && typeof payload.data.error === 'string' && payload.data.error.trim() !== '') {
              msg = payload.data.error;
            } else if ('detail' in payload.data && typeof payload.data.detail === 'string' && payload.data.detail.trim() !== '') {
              msg = payload.data.detail;
            }
          }
        }

        if (msg) {
          errorMessage = msg;
        } else {
          // Fallback based on HTTP status when data is empty or does not contain a message
          if (payload.status === 500) {
            errorMessage = 'Internal Server Error';
          } else if (payload.status === 400) {
            errorMessage = 'Bad Request';
          } else if (payload.status === 403) {
            errorMessage = 'Access Denied / Forbidden';
          } else if (payload.status === 404) {
            errorMessage = 'Resource Not Found';
          } else {
            errorMessage = `An error occurred (Status ${payload.status})`;
          }
        }
      } else if (payload.message && typeof payload.message === 'string' && payload.message.trim() !== '') {
        // SerializedError or standard JS Error
        errorMessage = payload.message;
      }
    }

    if (errorMessage && errorMessage.trim() !== '') {
      store.dispatch(addAlert({ message: errorMessage, type: 'error' }));
    }

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