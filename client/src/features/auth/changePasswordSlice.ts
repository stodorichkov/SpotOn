import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChangePasswordRequest } from './authApi';

type ChangePasswordFormState = ChangePasswordRequest;

const initialState: ChangePasswordFormState = {
    currentPassword: '',
    newPassword: '',
    confirm: '',
};

const changePasswordSlice = createSlice({
    name: 'changePasswordForm',
    initialState,
    reducers: {
        updateChangePasswordFormField: (state, action: PayloadAction<{ field: keyof ChangePasswordFormState; value: string }>) => {
            state[action.payload.field] = action.payload.value;
        },
        clearChangePasswordForm: () => initialState,
    },
});

export const { updateChangePasswordFormField, clearChangePasswordForm } = changePasswordSlice.actions;
export default changePasswordSlice.reducer;