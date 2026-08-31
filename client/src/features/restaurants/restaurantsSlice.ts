import { api } from '../../services/api';

export interface CategoryResponse {
  id: number;
  name: string;
}

export interface RestaurantContactResponse {
  id: number;
  name: string;
  phoneNumber: string;
  address: string;
}

export interface BookingClientRequest {
  restaurantId: number;
  guestCount: number;
  isSmoking: boolean;
  dateTime: string;
}

export interface BookingConfirmRequest {
  tableId: number;
}

export interface BookingClientResponse {
  id: number;
  status: string;
  restaurant: RestaurantContactResponse;
  guestCount: number;
  isSmoking: boolean;
  dateTime: string;
}

export interface PaginatedBookingsResponse {
  content: BookingClientResponse[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export interface ClientContactResponse {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export interface BookingEmployeeResponse {
  id: number;
  status: string;
  client: ClientContactResponse;
  guestCount: number;
  isSmoking: boolean;
  dateTime: string;
}

export interface PaginatedEmployeeBookingsResponse {
  content: BookingEmployeeResponse[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export interface RestaurantResponse {
  id: number;
  name: string;
  categories: CategoryResponse[];
  address: string;
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

export interface RestaurantTableResponse {
  id: number;
  name: string;
  capacity: number;
  isSmokingAllowed: boolean;
}

export interface RestaurantTableRequest {
  name: string;
  capacity: number;
  isSmokingAllowed: boolean;
}

export interface PaginatedTablesResponse {
  content: RestaurantTableResponse[];
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

export const restaurantsSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getRestaurants: builder.query<
      PaginatedRestaurantsResponse,
      { page: number; size: number; sort?: string; name?: string; address?: string; categoryIds?: number[] }
    >({
      query: ({ page, size, sort = 'id,asc', name, address, categoryIds }) => {
        const params = new URLSearchParams();
        params.set('page', String(page));
        params.set('size', String(size));
        params.set('sort', sort);
        if (name) {
          params.set('name', name);
        }
        if (address) {
          params.set('address', address);
        }
        (categoryIds || []).forEach((id) => params.append('categoryIds', String(id)));

        return `restaurant/restaurants?${params.toString()}`;
      },
      providesTags: ['Restaurants'],
    }),
    getRestaurantById: builder.query<RestaurantDetailsResponse, number>({
      query: (id) => `restaurant/restaurants/${id}`,
      providesTags: (result, error, id) => [{ type: 'Restaurants', id }],
    }),
    getEmployees: builder.query<PaginatedEmployeesResponse, { restaurantId: number; page: number; size: number }>({
      query: ({ restaurantId, page, size }) => `restaurant/employees?restaurantId=${restaurantId}&page=${page}&size=${size}`,
      providesTags: ['Employees'],
    }),
    getRestaurantForm: builder.query<CategoryResponse[], void>({
      query: () => 'restaurant/restaurants/form',
    }),
    getCategories: builder.query<CategoryResponse[], void>({
      query: () => 'restaurant/categories',
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
    getManagerTables: builder.query<PaginatedTablesResponse, { page: number; size: number }>({
      query: ({ page, size }) => `restaurant/tables?page=${page}&size=${size}&sort=id,asc`,
      providesTags: ['Tables'],
    }),
    createTable: builder.mutation<RestaurantTableResponse, RestaurantTableRequest>({
      query: (body) => ({
        url: 'restaurant/tables',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Tables'],
    }),
    updateTable: builder.mutation<RestaurantTableResponse, { id: number; body: RestaurantTableRequest }>({
      query: ({ id, body }) => ({
        url: `restaurant/tables/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Tables'],
    }),
    deleteTable: builder.mutation<void, number>({
      query: (id) => ({
        url: `restaurant/tables/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Tables'],
    }),
    getClientBookings: builder.query<PaginatedBookingsResponse, { page: number; size: number }>({
      query: ({ page, size }) => `booking/bookings?page=${page}&size=${size}&sort=id,desc`,
      providesTags: ['Bookings'],
    }),
    createBooking: builder.mutation<BookingClientResponse, BookingClientRequest>({
      query: (body) => ({
        url: 'booking/bookings',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Bookings'],
    }),
    cancelBooking: builder.mutation<BookingClientResponse, number>({
      query: (bookingId) => ({
        url: `booking/bookings/${bookingId}/canceled`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Bookings'],
    }),
    getRestaurantBookings: builder.query<PaginatedEmployeeBookingsResponse, { page: number; size: number }>({
      query: ({ page, size }) => `booking/bookings/restaurant?page=${page}&size=${size}&sort=id,desc`,
      providesTags: ['Bookings'],
    }),
    confirmBooking: builder.mutation<any, { bookingId: number; body: BookingConfirmRequest }>({
      query: ({ bookingId, body }) => ({
        url: `booking/bookings/${bookingId}/confirmed`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Bookings'],
    }),
    arrivedBooking: builder.mutation<any, number>({
      query: (bookingId) => ({
        url: `booking/bookings/${bookingId}/arrived`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Bookings'],
    }),
    completedBooking: builder.mutation<any, number>({
      query: (bookingId) => ({
        url: `booking/bookings/${bookingId}/completed`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Bookings'],
    }),
  }),
});

export const { useGetRestaurantsQuery, useGetRestaurantByIdQuery, useGetEmployeesQuery, useGetRestaurantFormQuery, useGetCategoriesQuery, useCreateRestaurantMutation, useGetRestaurantProfileQuery, useUpdateRestaurantProfileMutation, useGetManagerEmployeesQuery, useDeleteEmployeeMutation, useGetManagerTablesQuery, useCreateTableMutation, useUpdateTableMutation, useDeleteTableMutation, useGetClientBookingsQuery, useCreateBookingMutation, useCancelBookingMutation, useGetRestaurantBookingsQuery, useConfirmBookingMutation, useArrivedBookingMutation, useCompletedBookingMutation } = restaurantsSlice;