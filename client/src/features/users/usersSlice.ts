import { api } from '../../services/api';

export interface User {
  id: number;
  email: string;
  role: string;
  isActive: boolean;
}

export interface UserDetailsResponse {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    role: string;
    isActive: boolean;
}

export interface UserActiveStatusRequest {
    isActive: boolean;
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
      { page: number; size: number; sort?: string; id?: number; email?: string; roles?: string[]; isActive?: boolean }
    >({
      query: ({ page, size, sort = 'id,asc', id, email, roles, isActive }) => {
        const params = new URLSearchParams();
        params.set('page', String(page));
        params.set('size', String(size));
        params.set('sort', sort);
        if (id !== undefined) {
          params.set('id', String(id));
        }
        if (email) {
          params.set('email', email);
        }
        if (isActive !== undefined) {
          params.set('isActive', String(isActive));
        }
        (roles || []).forEach((role) => params.append('roles', role));

        return `auth/users?${params.toString()}`;
      },
      providesTags: ['Users'],
    }),
    getUserDetails: builder.query<UserDetailsResponse, number>({
        query: (id) => `auth/users/${id}`,
        providesTags: ['Users'],
    }),
    updateUserActiveStatus: builder.mutation<UserDetailsResponse, { id: number; body: UserActiveStatusRequest }>({
      query: ({ id, body }) => ({
        url: `auth/users/${id}/active`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Users', 'Employees'],
    }),
  }),
});

export const { useGetUsersQuery, useGetUserDetailsQuery, useUpdateUserActiveStatusMutation } = usersSlice;