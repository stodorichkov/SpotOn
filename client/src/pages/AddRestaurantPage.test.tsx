import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddRestaurantPage from './AddRestaurantPage';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import alertsReducer from '../features/alerts/alertsSlice';
import '@testing-library/jest-dom';

const renderWithProviders = (ui: React.ReactElement) => {
  const store = configureStore({
    reducer: {
      alerts: alertsReducer,
    },
  });
  return render(
    <Provider store={store}>
      <Router>{ui}</Router>
    </Provider>
  );
};

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const mockCategories = [
  { id: 1, name: 'Italian' },
  { id: 2, name: 'Pizza' },
  { id: 3, name: 'Burgers' },
  { id: 4, name: 'Fast Food' }
];

const mockCreateRestaurant = jest.fn();

jest.mock('../features/restaurants/restaurantsSlice', () => ({
  ...jest.requireActual('../features/restaurants/restaurantsSlice'),
  useGetRestaurantFormQuery: () => ({
    data: mockCategories,
    isLoading: false,
    error: null,
  }),
  useCreateRestaurantMutation: () => [
    mockCreateRestaurant,
    { isLoading: false },
  ],
}));

describe('AddRestaurantPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCreateRestaurant.mockImplementation(() => ({
      unwrap: () => Promise.resolve({ id: 10, name: 'Fine Burgers', categories: [] }),
    }));
  });

  test('renders form fields correctly', () => {
    renderWithProviders(<AddRestaurantPage />);

    expect(screen.getByText('Add New Restaurant')).toBeInTheDocument();
    expect(screen.getByLabelText(/Restaurant Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument();
    expect(screen.getByText('Select Categories')).toBeInTheDocument();
    expect(screen.getByText('Italian')).toBeInTheDocument();
  });

  test('displays validation errors on empty form submission', async () => {
    renderWithProviders(<AddRestaurantPage />);

    const submitButton = screen.getByRole('button', { name: /Add restaurant/i });
    fireEvent.click(submitButton);

    // Three fields: Name, Address, Phone Number
    expect(await screen.findAllByText('Field is required.')).toHaveLength(3);
    // Categories validation error
    expect(await screen.findByText('Please select at least one category.')).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('displays validation error for invalid phone number', async () => {
    renderWithProviders(<AddRestaurantPage />);

    fireEvent.change(screen.getByLabelText(/Restaurant Name/i), { target: { value: 'My Cafe' } });
    fireEvent.change(screen.getByLabelText(/Address/i), { target: { value: 'Sofia, Center' } });
    fireEvent.change(screen.getByLabelText(/Phone Number/i), { target: { value: 'invalid-phone-format' } });

    const submitButton = screen.getByRole('button', { name: /Add restaurant/i });
    fireEvent.click(submitButton);

    expect(await screen.findByText('7-15 digits. May start with +.')).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('can toggle categories by clicking on Chips', () => {
    renderWithProviders(<AddRestaurantPage />);

    const italianChip = screen.getByText('Italian');
    
    // Clicking toggles selection
    fireEvent.click(italianChip);
    
    // Clicking again untoggles it
    fireEvent.click(italianChip);
  });

  test('submits form successfully and navigates back', async () => {
    renderWithProviders(<AddRestaurantPage />);

    fireEvent.change(screen.getByLabelText(/Restaurant Name/i), { target: { value: 'Fine Burgers' } });
    fireEvent.change(screen.getByLabelText(/Address/i), { target: { value: '12 Hamburg St' } });
    fireEvent.change(screen.getByLabelText(/Phone Number/i), { target: { value: '+359888888888' } });

    // Select some categories
    fireEvent.click(screen.getByText('Burgers'));
    fireEvent.click(screen.getByText('Fast Food'));

    const submitButton = screen.getByRole('button', { name: /Add restaurant/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockCreateRestaurant).toHaveBeenCalledWith({
        name: 'Fine Burgers',
        address: '12 Hamburg St',
        phoneNumber: '+359888888888',
        categories: [3, 4] // Ids of Burgers (3) and Fast Food (4)
      });
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/admin/restaurants');
    });
  });
});
