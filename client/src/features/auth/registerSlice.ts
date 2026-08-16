import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {ClientRegistrationRequest} from "./authApi";

type RegisterFormState = ClientRegistrationRequest;

const initialState: RegisterFormState = {
  username: '',
  firstName: '',
  lastName: '',
  phoneNumber: '',
  password: '',
  confirm: '',
};

const registerSlice = createSlice({
  name: 'registerForm',
  initialState,
  reducers: {
    updateRegisterFormField: (state, action: PayloadAction<{ field: keyof RegisterFormState; value: string }>) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
    clearRegisterForm: () => initialState,
  },
});

export const { updateRegisterFormField, clearRegisterForm } = registerSlice.actions;

export default registerSlice.reducer;
