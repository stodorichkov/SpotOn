import { api } from '../../services/api';

export interface CategoryResponse {
  id: number;
  nameEn: string;
  nameBg: string;
  isActive: boolean;
}

export interface CategoryRequest {
  nameEn: string;
  nameBg: string;
}

export interface CategoryActiveStatusRequest {
  isActive: boolean;
}

export interface PaginatedCategoriesResponse {
  content: CategoryResponse[];
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

export interface RestaurantContactResponse {
  id: number;
  name: string;
  phoneNumber: string;
  address: string;
}

export interface BookingClientRequest {
  restaurantId: number;
  guestCount: number;
  isSmoking: boolean | null;
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
  isSmoking: boolean | null;
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
  isSmoking: boolean | null;
  dateTime: string;
}

export interface BookingStatusHistoryResponse {
  id: number;
  status: string;
  changedAt: string;
  changedByUserId: number;
  changedByFirstName: string | null;
  changedByLastName: string | null;
  changedByRole: string | null;
}

export interface PaginatedEmployeeBookingsResponse {
  content: BookingEmployeeResponse[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export interface RestaurantImageResponse {
  id: number;
  url: string;
}

export interface RestaurantResponse {
  id: number;
  name: string;
  categories: CategoryResponse[];
  address: string;
  isOpen: boolean;
  isActive: boolean;
  images: RestaurantImageResponse[];
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
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: string;
  isActive: boolean;
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

export type DayOfWeek = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';

export interface WorkingHoursEntry {
  dayOfWeek: DayOfWeek;
  closed: boolean;
  openTime: string | null;
  closeTime: string | null;
}

export interface RestaurantDetailsResponse {
  id: number;
  name: string;
  categories: CategoryResponse[];
  address: string;
  phoneNumber: string;
  isOpen: boolean;
  workingHours: WorkingHoursEntry[];
  reservationDurationMinutes: number;
  isActive: boolean;
  images: RestaurantImageResponse[];
}

export interface RestaurantStatusRequest {
  isOpen: boolean;
}

export interface RestaurantActiveStatusRequest {
  isActive: boolean;
}

export interface RestaurantWorkingHoursRequest {
  workingHours: WorkingHoursEntry[];
}

export interface RestaurantReservationDurationRequest {
  reservationDurationMinutes: number;
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
      { page: number; size: number; sort?: string; id?: number; name?: string; address?: string; categoryIds?: number[]; isOpen?: boolean }
    >({
      query: ({ page, size, sort = 'id,asc', id, name, address, categoryIds, isOpen }) => {
        const params = new URLSearchParams();
        params.set('page', String(page));
        params.set('size', String(size));
        params.set('sort', sort);
        if (id !== undefined) {
          params.set('id', String(id));
        }
        if (name) {
          params.set('name', name);
        }
        if (address) {
          params.set('address', address);
        }
        if (isOpen !== undefined) {
          params.set('isOpen', String(isOpen));
        }
        (categoryIds || []).forEach((catId) => params.append('categoryIds', String(catId)));

        return `restaurant/restaurants?${params.toString()}`;
      },
      providesTags: ['Restaurants'],
    }),
    getRestaurantsForManage: builder.query<
      PaginatedRestaurantsResponse,
      { page: number; size: number; sort?: string; id?: number; name?: string; address?: string; categoryIds?: number[]; isOpen?: boolean; isActive?: boolean }
    >({
      query: ({ page, size, sort = 'id,asc', id, name, address, categoryIds, isOpen, isActive }) => {
        const params = new URLSearchParams();
        params.set('page', String(page));
        params.set('size', String(size));
        params.set('sort', sort);
        if (id !== undefined) {
          params.set('id', String(id));
        }
        if (name) {
          params.set('name', name);
        }
        if (address) {
          params.set('address', address);
        }
        if (isOpen !== undefined) {
          params.set('isOpen', String(isOpen));
        }
        if (isActive !== undefined) {
          params.set('isActive', String(isActive));
        }
        (categoryIds || []).forEach((catId) => params.append('categoryIds', String(catId)));

        return `restaurant/restaurants/manage?${params.toString()}`;
      },
      providesTags: ['Restaurants'],
    }),
    getRestaurantById: builder.query<RestaurantDetailsResponse, number>({
      query: (id) => `restaurant/restaurants/${id}`,
      providesTags: (result, error, id) => [{ type: 'Restaurants', id }],
    }),
    getEmployees: builder.query<
      PaginatedEmployeesResponse,
      { restaurantId: number; page: number; size: number; sort?: string; id?: number; email?: string; name?: string; phoneNumber?: string; roles?: string[] }
    >({
      query: ({ restaurantId, page, size, sort = 'id,asc', id, email, name, phoneNumber, roles }) => {
        const params = new URLSearchParams();
        params.set('restaurantId', String(restaurantId));
        params.set('page', String(page));
        params.set('size', String(size));
        params.set('sort', sort);
        if (id !== undefined) {
          params.set('id', String(id));
        }
        if (email) {
          params.set('email', email);
        }
        if (name) {
          params.set('name', name);
        }
        if (phoneNumber) {
          params.set('phoneNumber', phoneNumber);
        }
        (roles || []).forEach((role) => params.append('roles', role));

        return `restaurant/employees?${params.toString()}`;
      },
      providesTags: ['Employees'],
    }),
    getRestaurantForm: builder.query<CategoryResponse[], void>({
      query: () => 'restaurant/restaurants/form',
    }),
    getCategories: builder.query<CategoryResponse[], void>({
      query: () => 'restaurant/categories',
      providesTags: ['Categories'],
    }),
    getCategoriesPage: builder.query<PaginatedCategoriesResponse, { page: number; size: number; sort?: string; id?: number; name?: string; isActive?: boolean }>({
      query: ({ page, size, sort = 'id,asc', id, name, isActive }) => {
        const params = new URLSearchParams();
        params.set('page', String(page));
        params.set('size', String(size));
        params.set('sort', sort);
        if (id !== undefined) {
          params.set('id', String(id));
        }
        if (name) {
          params.set('name', name);
        }
        if (isActive !== undefined) {
          params.set('isActive', String(isActive));
        }

        return `restaurant/categories/manage?${params.toString()}`;
      },
      providesTags: ['Categories'],
    }),
    getCategoryById: builder.query<CategoryResponse, number>({
      query: (id) => `restaurant/categories/${id}`,
      providesTags: ['Categories'],
    }),
    createCategory: builder.mutation<CategoryResponse, CategoryRequest>({
      query: (body) => ({
        url: 'restaurant/categories',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Categories'],
    }),
    updateCategory: builder.mutation<CategoryResponse, { id: number; body: CategoryRequest }>({
      query: ({ id, body }) => ({
        url: `restaurant/categories/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Categories'],
    }),
    updateCategoryActiveStatus: builder.mutation<CategoryResponse, { id: number; body: CategoryActiveStatusRequest }>({
      query: ({ id, body }) => ({
        url: `restaurant/categories/${id}/active`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Categories'],
    }),
    createRestaurant: builder.mutation<RestaurantResponse, RestaurantRequest>({
      query: (body) => ({
        url: 'restaurant/restaurants',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Restaurants'],
    }),
    updateRestaurantActiveStatus: builder.mutation<RestaurantDetailsResponse, { id: number; body: RestaurantActiveStatusRequest }>({
      query: ({ id, body }) => ({
        url: `restaurant/restaurants/${id}/active`,
        method: 'PATCH',
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
    updateRestaurantStatus: builder.mutation<RestaurantDetailsResponse, RestaurantStatusRequest>({
      query: (body) => ({
        url: 'restaurant/profile/status',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Restaurants'],
    }),
    uploadRestaurantImage: builder.mutation<RestaurantDetailsResponse, FormData>({
      query: (formData) => ({
        url: 'restaurant/profile/images',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Restaurants'],
    }),
    deleteRestaurantImage: builder.mutation<RestaurantDetailsResponse, number>({
      query: (imageId) => ({
        url: `restaurant/profile/images/${imageId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Restaurants'],
    }),
    updateWorkingHours: builder.mutation<RestaurantDetailsResponse, RestaurantWorkingHoursRequest>({
      query: (body) => ({
        url: 'restaurant/profile/working-hours',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Restaurants'],
    }),
    updateReservationDuration: builder.mutation<RestaurantDetailsResponse, RestaurantReservationDurationRequest>({
      query: (body) => ({
        url: 'restaurant/profile/reservation-duration',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Restaurants'],
    }),
    getManagerEmployees: builder.query<
      PaginatedEmployeesResponse,
      { page: number; size: number; sort?: string; id?: number; email?: string; name?: string; phoneNumber?: string; roles?: string[] }
    >({
      query: ({ page, size, sort = 'id,asc', id, email, name, phoneNumber, roles }) => {
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
        if (name) {
          params.set('name', name);
        }
        if (phoneNumber) {
          params.set('phoneNumber', phoneNumber);
        }
        (roles || []).forEach((role) => params.append('roles', role));

        return `restaurant/employees?${params.toString()}`;
      },
      providesTags: ['Employees'],
    }),
    deleteEmployee: builder.mutation<void, number>({
      query: (id) => ({
        url: `restaurant/employees/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Employees'],
    }),
    getManagerTables: builder.query<
      PaginatedTablesResponse,
      { page: number; size: number; sort?: string; id?: number; name?: string; isSmokingAllowed?: boolean; minCapacity?: number; maxCapacity?: number }
    >({
      query: ({ page, size, sort = 'id,asc', id, name, isSmokingAllowed, minCapacity, maxCapacity }) => {
        const params = new URLSearchParams();
        params.set('page', String(page));
        params.set('size', String(size));
        params.set('sort', sort);
        if (id !== undefined) {
          params.set('id', String(id));
        }
        if (name) {
          params.set('name', name);
        }
        if (isSmokingAllowed !== undefined) {
          params.set('isSmokingAllowed', String(isSmokingAllowed));
        }
        if (minCapacity !== undefined) {
          params.set('minCapacity', String(minCapacity));
        }
        if (maxCapacity !== undefined) {
          params.set('maxCapacity', String(maxCapacity));
        }

        return `restaurant/tables?${params.toString()}`;
      },
      providesTags: ['Tables'],
    }),
    getTablesForManage: builder.query<
      PaginatedTablesResponse,
      { restaurantId: number; page: number; size: number; sort?: string; id?: number; name?: string; isSmokingAllowed?: boolean; minCapacity?: number; maxCapacity?: number }
    >({
      query: ({ restaurantId, page, size, sort = 'id,asc', id, name, isSmokingAllowed, minCapacity, maxCapacity }) => {
        const params = new URLSearchParams();
        params.set('restaurantId', String(restaurantId));
        params.set('page', String(page));
        params.set('size', String(size));
        params.set('sort', sort);
        if (id !== undefined) {
          params.set('id', String(id));
        }
        if (name) {
          params.set('name', name);
        }
        if (isSmokingAllowed !== undefined) {
          params.set('isSmokingAllowed', String(isSmokingAllowed));
        }
        if (minCapacity !== undefined) {
          params.set('minCapacity', String(minCapacity));
        }
        if (maxCapacity !== undefined) {
          params.set('maxCapacity', String(maxCapacity));
        }

        return `restaurant/tables?${params.toString()}`;
      },
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
    getClientBookings: builder.query<
      PaginatedBookingsResponse,
      { page: number; size: number; sort?: string; id?: number; statuses?: string[]; restaurantName?: string; from?: string; to?: string }
    >({
      query: ({ page, size, sort = 'id,desc', id, statuses, restaurantName, from, to }) => {
        const params = new URLSearchParams();
        params.set('page', String(page));
        params.set('size', String(size));
        params.set('sort', sort);
        if (id !== undefined) {
          params.set('id', String(id));
        }
        (statuses || []).forEach((status) => params.append('statuses', status));
        if (restaurantName) {
          params.set('restaurantName', restaurantName);
        }
        if (from) {
          params.set('from', from);
        }
        if (to) {
          params.set('to', to);
        }

        return `booking/bookings?${params.toString()}`;
      },
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
    getRestaurantBookings: builder.query<
      PaginatedEmployeeBookingsResponse,
      { page: number; size: number; sort?: string; id?: number; statuses?: string[]; clientName?: string; from?: string; to?: string }
    >({
      query: ({ page, size, sort = 'id,desc', id, statuses, clientName, from, to }) => {
        const params = new URLSearchParams();
        params.set('page', String(page));
        params.set('size', String(size));
        params.set('sort', sort);
        if (id !== undefined) {
          params.set('id', String(id));
        }
        (statuses || []).forEach((status) => params.append('statuses', status));
        if (clientName) {
          params.set('clientName', clientName);
        }
        if (from) {
          params.set('from', from);
        }
        if (to) {
          params.set('to', to);
        }

        return `booking/bookings/restaurant?${params.toString()}`;
      },
      providesTags: ['Bookings'],
    }),
    getBookingsForManage: builder.query<
      PaginatedEmployeeBookingsResponse,
      { restaurantId: number; page: number; size: number; sort?: string; id?: number; statuses?: string[]; clientName?: string; from?: string; to?: string }
    >({
      query: ({ restaurantId, page, size, sort = 'id,desc', id, statuses, clientName, from, to }) => {
        const params = new URLSearchParams();
        params.set('restaurantId', String(restaurantId));
        params.set('page', String(page));
        params.set('size', String(size));
        params.set('sort', sort);
        if (id !== undefined) {
          params.set('id', String(id));
        }
        (statuses || []).forEach((status) => params.append('statuses', status));
        if (clientName) {
          params.set('clientName', clientName);
        }
        if (from) {
          params.set('from', from);
        }
        if (to) {
          params.set('to', to);
        }

        return `booking/bookings/restaurant?${params.toString()}`;
      },
      providesTags: ['Bookings'],
    }),
    getBookingStatusHistory: builder.query<BookingStatusHistoryResponse[], number>({
      query: (bookingId) => `booking/bookings/${bookingId}/status-history`,
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

export const { useGetRestaurantsQuery, useGetRestaurantsForManageQuery, useGetRestaurantByIdQuery, useGetEmployeesQuery, useGetRestaurantFormQuery, useGetCategoriesQuery, useGetCategoriesPageQuery, useGetCategoryByIdQuery, useCreateCategoryMutation, useUpdateCategoryMutation, useUpdateCategoryActiveStatusMutation, useCreateRestaurantMutation, useUpdateRestaurantActiveStatusMutation, useGetRestaurantProfileQuery, useUpdateRestaurantProfileMutation, useUpdateRestaurantStatusMutation, useUploadRestaurantImageMutation, useDeleteRestaurantImageMutation, useUpdateWorkingHoursMutation, useUpdateReservationDurationMutation, useGetManagerEmployeesQuery, useDeleteEmployeeMutation, useGetManagerTablesQuery, useGetTablesForManageQuery, useCreateTableMutation, useUpdateTableMutation, useDeleteTableMutation, useGetClientBookingsQuery, useCreateBookingMutation, useCancelBookingMutation, useGetRestaurantBookingsQuery, useGetBookingsForManageQuery, useGetBookingStatusHistoryQuery, useConfirmBookingMutation, useArrivedBookingMutation, useCompletedBookingMutation } = restaurantsSlice;