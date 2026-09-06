import { api } from '../../services/api';

export interface User {
  id: number;
  email: string;
  role: string;
}

export interface UserDetailsResponse {
    id: number;
    email: string;
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
    getUsers: builder.query<
      PaginatedUsersResponse,
      { page: number; size: number; sort?: string; email?: string; roles?: string[] }
    >({
      query: ({ page, size, sort = 'id,asc', email, roles }) => {
        const params = new URLSearchParams();
        params.set('page', String(page));
        params.set('size', String(size));
        params.set('sort', sort);
        if (email) {
          params.set('email', email);
        }
        (roles || []).forEach((role) => params.append('roles', role));

        return `auth/users?${params.toString()}`;
      },
    }),
    getUserDetails: builder.query<UserDetailsResponse, number>({
        query: (id) => `auth/users/${id}`,
    }),
  }),
});

export const { useGetUsersQuery, useGetUserDetailsQuery } = usersSlice;