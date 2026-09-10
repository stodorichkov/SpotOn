import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface AuthState {
    token: string | null;
    role: string | null;
    id: number | null;
}

const initialState: AuthState = {
    token: null,
    role: null,
    id: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<{ token: string | null, role: string | null }>) => {
            state.token = action.payload.token;
            state.role = action.payload.role;
            
            if (action.payload.token) {
                try {
                    const base64Url = action.payload.token.split('.')[1];
                    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                    const jsonPayload = decodeURIComponent(
                        window
                            .atob(base64)
                            .split('')
                            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                            .join('')
                    );
                    const decoded = JSON.parse(jsonPayload);
                    state.id = decoded && decoded.sub ? Number(decoded.sub) : null;
                } catch (error) {
                    console.error('Failed to decode JWT token:', error);
                    state.id = null;
                }
            } else {
                state.id = null;
            }
        },
        logout: (state) => {
            state.token = null;
            state.role = null;
            state.id = null;
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;