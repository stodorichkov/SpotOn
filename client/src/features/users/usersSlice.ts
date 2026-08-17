import { api } from '../../services/api';

export interface User {
  id: number;
  username: string;
  role: string;
}

export interface UserDetailsResponse {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    role: string;
}

export interface PaginatedUsersResponse {
    content: User[];
    pageable: {
        pageNumber: number;
        pageSize: number;
        sort: {
            sorted: boolean;
            unsorted: boolean;
            empty: boolean;
        };
        offset: number;
        paged: boolean;
        unpaged: boolean;
    };
    last: boolean;
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    sort: {
        sorted: boolean;
        unsorted: boolean;
        empty: boolean;
    };
    first: boolean;
    numberOfElements: number;
    empty: boolean;
}


export const usersSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<PaginatedUsersResponse, { page: number; size: number }>({
      query: ({ page, size }) => `auth/users?page=${page}&size=${size}`,
    }),
    getUserDetails: builder.query<UserDetailsResponse, number>({
        query: (id) => `auth/users/${id}`,
    }),
  }),
});

export const { useGetUsersQuery, useGetUserDetailsQuery } = usersSlice;