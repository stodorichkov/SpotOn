import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Alert {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

interface AlertsState {
  alerts: Alert[];
}

const initialState: AlertsState = {
  alerts: [],
};

const alertsSlice = createSlice({
  name: 'alerts',
  initialState,
  reducers: {
    addAlert: (state, action: PayloadAction<Omit<Alert, 'id'>>) => {
      const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
      state.alerts.push({ ...action.payload, id });
    },
    removeAlert: (state, action: PayloadAction<string>) => {
      state.alerts = state.alerts.filter((alert) => alert.id !== action.payload);
    },
  },
});

export const { addAlert, removeAlert } = alertsSlice.actions;
export default alertsSlice.reducer;