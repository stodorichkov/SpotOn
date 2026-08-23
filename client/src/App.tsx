import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import UsersPage from './pages/UsersPage';
import UserDetailsPage from './pages/UserDetailsPage';
import RestaurantsPage from './pages/RestaurantsPage';
import RestaurantEmployeesPage from './pages/RestaurantEmployeesPage';
import AddRestaurantPage from './pages/AddRestaurantPage';
import AddManagerPage from './pages/AddManagerPage';
import ManagerRestaurantPage from './pages/ManagerRestaurantPage';
import ManagerEmployeesPage from './pages/ManagerEmployeesPage';
import AddEmployeePage from './pages/AddEmployeePage';
import ManagerTablesPage from './pages/ManagerTablesPage';
import AddTablePage from './pages/AddTablePage';
import TableDetailPage from './pages/TableDetailPage';
import RestaurantDetailPage from './pages/RestaurantDetailPage';
import ReservationPage from './pages/ReservationPage';
import ClientBookingsPage from './pages/ClientBookingsPage';
import BookingDetailPage from './pages/BookingDetailPage';
import AppTopBar from './components/AppBar';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import Alerts from './components/Alerts';
import { PrivateRoute, GuestRoute, AdminRoute, ManagerRoute, PublicClientRoute, ClientOnlyRoute } from './components/ProtectedRoute';
import './App.css';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2', // Blue
    },
    secondary: {
      main: '#b71c1c', // A shade of red for accents
    },
    background: {
      default: '#f5f5f5',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#212121',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppTopBar />
        <Alerts />
        <Box component="main" sx={{ p: 3 }}> {/* Add padding to the main content */}
          <Routes>
            {/* Public Client & Guest Routes (Forbidden for Admin & Manager) */}
            <Route element={<PublicClientRoute />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/restaurants/:id" element={<RestaurantDetailPage />} />
            </Route>

            <Route element={<GuestRoute />}>
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/login" element={<LoginPage />} />
            </Route>

            <Route element={<PrivateRoute />}>
              <Route path="/profile" element={<ProfilePage />} />
            </Route>

            {/* Client-Only Logged-in Routes (Forbidden for Admin, Manager & Guests) */}
            <Route element={<ClientOnlyRoute />}>
              <Route path="/restaurants/:id/reserve" element={<ReservationPage />} />
              <Route path="/bookings" element={<ClientBookingsPage />} />
              <Route path="/bookings/:id" element={<BookingDetailPage />} />
            </Route>
            <Route element={<AdminRoute />}>
              <Route path="/admin/users" element={<UsersPage />} />
              <Route path="/admin/users/:id" element={<UserDetailsPage />} />
              <Route path="/admin/restaurants" element={<RestaurantsPage />} />
              <Route path="/admin/restaurants/new" element={<AddRestaurantPage />} />
              <Route path="/admin/restaurants/:id/employees" element={<RestaurantEmployeesPage />} />
              <Route path="/admin/restaurants/:id/employees/new" element={<AddManagerPage />} />
            </Route>
            <Route element={<ManagerRoute />}>
              <Route path="/manager/restaurant" element={<ManagerRestaurantPage />} />
              <Route path="/manager/employees" element={<ManagerEmployeesPage />} />
              <Route path="/manager/employees/new" element={<AddEmployeePage />} />
              <Route path="/manager/employees/:id" element={<UserDetailsPage />} />
              <Route path="/manager/tables" element={<ManagerTablesPage />} />
              <Route path="/manager/tables/new" element={<AddTablePage />} />
              <Route path="/manager/tables/:id" element={<TableDetailPage />} />
            </Route>
            {/* Fallback route to redirect undefined paths to the home page */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;