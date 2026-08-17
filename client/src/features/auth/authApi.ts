import { api } from '../../services/api';
import { setCredentials } from './authSlice';

export interface ClientRegistrationRequest {
    username: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    password: string;
    confirm: string;
}

export interface ClientLoginRequest {
    username: string;
    password: string;
}

export interface ProfileResponse {
    username: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    role: string;
}

export interface ChangeUsernameRequest {
    newUsername: string;
}

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
    confirm: string;
}

export interface EditProfileRequest {
    firstName: string;
    lastName: string;
    phoneNumber: string;
}

const AUTH_API_PATH = '/auth';

// Inject endpoints into the base api slice
export const authApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getProfile: builder.query<ProfileResponse, void>({
            query: () => `${AUTH_API_PATH}/profile`,
            providesTags: ['Profile'],
        }),
        changeUsername: builder.mutation<void, ChangeUsernameRequest>({
            query: (body) => ({
                url: `${AUTH_API_PATH}/profile/username`,
                method: 'PATCH',
                body,
            }),
        }),
        changePassword: builder.mutation<void, ChangePasswordRequest>({
            query: (body) => ({
                url: `${AUTH_API_PATH}/profile/password`,
                method: 'PATCH',
                body,
            }),
        }),
        editProfile: builder.mutation<void, EditProfileRequest>({
            query: (body) => ({
                url: `${AUTH_API_PATH}/profile`,
                method: 'PUT',
                body,
            }),
        }),
        registerClient: builder.mutation<void, ClientRegistrationRequest>({
            query: (body) => ({
                url: `${AUTH_API_PATH}/register/client`,
                method: 'POST',
                body,
            }),
        }),
        login: builder.mutation<string, ClientLoginRequest>({
            query: (body) => ({
                url: `${AUTH_API_PATH}/login`,
                method: 'POST',
                body,
                responseHandler: (response) => response.text(),
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    // Set the token first to authenticate the getProfile call
                    const { data: token } = await queryFulfilled;
                    dispatch(setCredentials({ token, role: null })); // Temporarily set token

                    // Fetch profile to get the role
                    const profileResult = await dispatch(authApi.endpoints.getProfile.initiate());
                    
                    if (profileResult.data) {
                        const role = profileResult.data.role;
                        // Set final credentials with role
                        dispatch(setCredentials({ token, role }));
                    } else {
                        // If profile fetch fails, logout the user
                        throw new Error("Profile fetch failed");
                    }

                } catch (error) {
                    console.error("Login process failed:", error);
                    // Clear credentials on any failure in the process
                    dispatch(setCredentials({ token: null, role: null }));
                }
            },
        }),
        logout: builder.mutation<void, void>({
            query: () => ({
                url: `${AUTH_API_PATH}/logout`,
                method: 'POST',
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(setCredentials({ token: null, role: null }));
                } catch (error) {
                    console.error("Logout failed:", error);
                }
            },
        }),
    }),
});

export const { useGetProfileQuery, useChangeUsernameMutation, useChangePasswordMutation, useEditProfileMutation, useRegisterClientMutation, useLoginMutation, useLogoutMutation } = authApi;