import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddManagerPage from './AddManagerPage';
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
  useParams: () => ({ id: '5' }),
  useNavigate: () => mockNavigate,
}));

const mockRegisterManager = jest.fn();

jest.mock('../features/auth/authApi', () => ({
  ...jest.requireActual('../features/auth/authApi'),
  useRegisterManagerMutation: () => [
    mockRegisterManager,
    { isLoading: false },
  ],
}));

describe('AddManagerPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRegisterManager.mockImplementation(() => ({
      unwrap: () => Promise.resolve({ username: 'manager_john', password: 'GeneratedPassword1!' }),
    }));
    // Mock navigator.clipboard
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockImplementation(() => Promise.resolve()),
      },
    });
  });

  test('renders form fields correctly', () => {
    renderWithProviders(<AddManagerPage />);

    expect(screen.getByText('Add New Manager')).toBeInTheDocument();
    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add manager/i })).toBeInTheDocument();
  });

  test('displays validation errors on empty form submission', async () => {
    renderWithProviders(<AddManagerPage />);

    const submitButton = screen.getByRole('button', { name: /Add manager/i });
    fireEvent.click(submitButton);

    // Three fields: First Name, Last Name, Phone Number
    expect(await screen.findAllByText('Field is required.')).toHaveLength(3);
    expect(mockRegisterManager).not.toHaveBeenCalled();
  });

  test('displays validation errors for invalid fields', async () => {
    renderWithProviders(<AddManagerPage />);

    // Name must start with capital letter and have 3-30 letters
    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'jo' } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'smith' } });
    // Phone must match pattern
    fireEvent.change(screen.getByLabelText(/Phone Number/i), { target: { value: 'invalid-phone' } });

    const submitButton = screen.getByRole('button', { name: /Add manager/i });
    fireEvent.click(submitButton);

    expect(await screen.findAllByText('3-30 letters. Must start with a capital letter.')).toHaveLength(2);
    expect(await screen.findByText('7-15 digits. May start with +.')).toBeInTheDocument();
    expect(mockRegisterManager).not.toHaveBeenCalled();
  });

  test('submits form successfully and shows credentials', async () => {
    renderWithProviders(<AddManagerPage />);

    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Smith' } });
    fireEvent.change(screen.getByLabelText(/Phone Number/i), { target: { value: '+359888888888' } });

    const submitButton = screen.getByRole('button', { name: /Add manager/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockRegisterManager).toHaveBeenCalledWith({
        employeeData: {
          firstName: 'John',
          lastName: 'Smith',
          phoneNumber: '+359888888888',
        },
        restaurantId: 5,
      });
    });

    // Success screen should be visible with username and password
    expect(await screen.findByText('Manager Credentials')).toBeInTheDocument();
    expect(screen.getByLabelText('Username')).toHaveValue('manager_john');
    expect(screen.getByLabelText('Password')).toHaveValue('GeneratedPassword1!');
  });

  test('can copy credentials to clipboard', async () => {
    renderWithProviders(<AddManagerPage />);

    // Populate success data directly by submitting
    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Smith' } });
    fireEvent.change(screen.getByLabelText(/Phone Number/i), { target: { value: '+359888888888' } });

    const submitButton = screen.getByRole('button', { name: /Add manager/i });
    fireEvent.click(submitButton);

    // Wait for success screen
    await screen.findByText('Manager Credentials');

    // Find and click the Copy Credentials button
    const copyButton = screen.getByRole('button', { name: /Copy Credentials/i });
    expect(copyButton).toBeInTheDocument();
    fireEvent.click(copyButton);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      'username: manager_john\npassword: GeneratedPassword1!'
    );
  });
});