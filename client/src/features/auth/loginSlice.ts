import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ClientLoginRequest } from "./authApi";

type LoginFormState = ClientLoginRequest;

const initialState: LoginFormState = {
  email: '',
  password: '',
};

const loginSlice = createSlice({
  name: 'loginForm',
  initialState,
  reducers: {
    updateLoginFormField: (state, action: PayloadAction<{ field: keyof LoginFormState; value: string }>) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
    clearLoginForm: () => initialState,
  },
});

export const { updateLoginFormField, clearLoginForm } = loginSlice.actions;

export default loginSlice.reducer;