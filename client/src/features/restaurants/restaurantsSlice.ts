import { api } from '../../services/api';

export interface CategoryResponse {
  id: number;
  name: string;
}

export interface RestaurantResponse {
  id: number;
  name: string;
  categories: CategoryResponse[];
}

export interface PaginatedRestaurantsResponse {
  content: RestaurantResponse[];
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

export interface EmployeeResponse {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: string;
}

export interface PaginatedEmployeesResponse {
  content: EmployeeResponse[];
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

export interface RestaurantRequest {
  name: string;
  address: string;
  phoneNumber: string;
  categories: number[];
}

export interface RestaurantDetailsResponse {
  id: number;
  name: string;
  categories: CategoryResponse[];
  address: string;
  phoneNumber: string;
}

export const restaurantsSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getRestaurants: builder.query<PaginatedRestaurantsResponse, { page: number; size: number }>({
      query: ({ page, size }) => `restaurant/restaurants?page=${page}&size=${size}&sort=id,asc`,
      providesTags: ['Restaurants'],
    }),
    getEmployees: builder.query<PaginatedEmployeesResponse, { restaurantId: number; page: number; size: number }>({
      query: ({ restaurantId, page, size }) => `restaurant/employees?restaurantId=${restaurantId}&page=${page}&size=${size}`,
      providesTags: ['Employees'],
    }),
    getRestaurantForm: builder.query<CategoryResponse[], void>({
      query: () => 'restaurant/restaurants/form',
    }),
    createRestaurant: builder.mutation<RestaurantResponse, RestaurantRequest>({
      query: (body) => ({
        url: 'restaurant/restaurants',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Restaurants'],
    }),
    getRestaurantProfile: builder.query<RestaurantDetailsResponse, void>({
      query: () => 'restaurant/profile',
      providesTags: ['Restaurants'],
    }),
    updateRestaurantProfile: builder.mutation<RestaurantDetailsResponse, RestaurantRequest>({
      query: (body) => ({
        url: 'restaurant/profile',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Restaurants'],
    }),
    getManagerEmployees: builder.query<PaginatedEmployeesResponse, { page: number; size: number }>({
      query: ({ page, size }) => `restaurant/employees?page=${page}&size=${size}&sort=id,asc`,
      providesTags: ['Employees'],
    }),
    deleteEmployee: builder.mutation<void, number>({
      query: (id) => ({
        url: `restaurant/employees/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Employees'],
    }),
  }),
});

export const { useGetRestaurantsQuery, useGetEmployeesQuery, useGetRestaurantFormQuery, useCreateRestaurantMutation, useGetRestaurantProfileQuery, useUpdateRestaurantProfileMutation, useGetManagerEmployeesQuery, useDeleteEmployeeMutation } = restaurantsSlice;