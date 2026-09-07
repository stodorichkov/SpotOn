import { api } from '../../services/api';
import { setCredentials } from './authSlice';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

export interface ClientRegistrationRequest {
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    password: string;
    confirm: string;
}

export interface ClientLoginRequest {
    email: string;
    password: string;
}

export interface ProfileResponse {
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    role: string;
}

export interface ChangeEmailRequest {
    newEmail: string;
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

export interface EmployeeData {
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
}

export interface EmployeeRegistrationRequest {
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
}

export interface RegisterManagerRequest {
    employeeData: EmployeeData;
    restaurantId: number;
}

export interface PasswordResetRequest {
    email: string;
}

const AUTH_API_PATH = '/auth';

export const authApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getProfile: builder.query<ProfileResponse, void>({
            query: () => `${AUTH_API_PATH}/profile`,
            providesTags: ['Profile'],
        }),
        changeEmail: builder.mutation<void, ChangeEmailRequest>({
            query: (body) => ({
                url: `${AUTH_API_PATH}/profile/email`,
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
        registerManager: builder.mutation<void, RegisterManagerRequest>({
            query: (body) => ({
                url: `${AUTH_API_PATH}/register/manager`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Employees'],
        }),
        registerEmployee: builder.mutation<void, EmployeeRegistrationRequest>({
            query: (body) => ({
                url: `${AUTH_API_PATH}/register/employee`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Employees'],
        }),
        login: builder.mutation<{ token: string; role: string }, ClientLoginRequest>({
            // A plain `query` + `onQueryStarted` can't communicate a later profile-fetch
            // failure back to the caller's `.unwrap()` (that promise only reflects the
            // initial POST /login response), which let callers see "success" even when
            // the follow-up profile fetch (and thus role resolution) failed. Using
            // `queryFn` ties both steps into the single result callers await.
            queryFn: async (body, { dispatch }, extraOptions, baseQuery) => {
                const loginResult = await baseQuery({
                    url: `${AUTH_API_PATH}/login`,
                    method: 'POST',
                    body,
                    responseHandler: async (response) => {
                        if (response.ok) {
                            return response.text();
                        }
                        try {
                            return await response.clone().json();
                        } catch {
                            return await response.text();
                        }
                    },
                });

                if (loginResult.error) {
                    return { error: loginResult.error as FetchBaseQueryError };
                }

                const token = loginResult.data as string;
                dispatch(setCredentials({ token, role: null }));

                const profileResult = await baseQuery(`${AUTH_API_PATH}/profile`);

                if (profileResult.error) {
                    dispatch(setCredentials({ token: null, role: null }));
                    return { error: profileResult.error as FetchBaseQueryError };
                }

                const role = (profileResult.data as ProfileResponse).role;
                dispatch(setCredentials({ token, role }));
                dispatch(authApi.util.upsertQueryData('getProfile', undefined, profileResult.data as ProfileResponse));

                return { data: { token, role } };
            },
        }),
        resetPassword: builder.mutation<void, PasswordResetRequest>({
            query: (body) => ({
                url: `${AUTH_API_PATH}/password-reset`,
                method: 'POST',
                body,
            }),
        }),
        logout: builder.mutation<void, void>({
            query: () => ({
                url: `${AUTH_API_PATH}/logout`,
                method: 'POST',
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                } catch (error) {
                    console.error("Logout failed:", error);
                } finally {
                    dispatch(setCredentials({ token: null, role: null }));
                    setTimeout(() => {
                        dispatch({ type: 'api/resetApiState' });
                    }, 0);
                }
            },
        }),
    }),
});

export const { useGetProfileQuery, useChangeEmailMutation, useChangePasswordMutation, useEditProfileMutation, useRegisterClientMutation, useRegisterManagerMutation, useRegisterEmployeeMutation, useLoginMutation, useLogoutMutation, useResetPasswordMutation } = authApi;