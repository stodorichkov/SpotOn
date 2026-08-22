import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { RootState } from '../store/store';

export const PrivateRoute: React.FC = () => {
  const { token } = useSelector((state: RootState) => state.auth);
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export const GuestRoute: React.FC = () => {
    const { token, role } = useSelector((state: RootState) => state.auth);
    return !token ? <Outlet /> : <Navigate to={role === 'ADMIN' ? "/admin/users" : role === 'MANAGER' ? "/manager/restaurant" : "/profile"} replace />;
};

export const AdminRoute: React.FC = () => {
  const { token, role } = useSelector((state: RootState) => state.auth);
  return token && role === 'ADMIN' ? <Outlet /> : <Navigate to="/" replace />;
};

export const ManagerRoute: React.FC = () => {
  const { token, role } = useSelector((state: RootState) => state.auth);
  return token && role === 'MANAGER' ? <Outlet /> : <Navigate to="/" replace />;
};