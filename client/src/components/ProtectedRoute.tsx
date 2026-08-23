import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { RootState } from '../store/store';
import { Role } from '../constants';

export const PrivateRoute: React.FC = () => {
  const { token } = useSelector((state: RootState) => state.auth);
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export const GuestRoute: React.FC = () => {
    const { token, role } = useSelector((state: RootState) => state.auth);
    return !token ? <Outlet /> : <Navigate to={role === Role.ADMIN ? "/admin/users" : role === Role.MANAGER ? "/manager/restaurant" : "/profile"} replace />;
};

export const AdminRoute: React.FC = () => {
  const { token, role } = useSelector((state: RootState) => state.auth);
  return token && role === Role.ADMIN ? <Outlet /> : <Navigate to="/" replace />;
};

export const ManagerRoute: React.FC = () => {
  const { token, role } = useSelector((state: RootState) => state.auth);
  return token && role === Role.MANAGER ? <Outlet /> : <Navigate to="/" replace />;
};

export const PublicClientRoute: React.FC = () => {
  const { token, role } = useSelector((state: RootState) => state.auth);
  if (token) {
    if (role === Role.ADMIN) {
      return <Navigate to="/admin/users" replace />;
    }
    if (role === Role.MANAGER) {
      return <Navigate to="/manager/restaurant" replace />;
    }
  }
  return <Outlet />;
};

export const ClientOnlyRoute: React.FC = () => {
  const { token, role } = useSelector((state: RootState) => state.auth);
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  if (role === Role.ADMIN) {
    return <Navigate to="/admin/users" replace />;
  }
  if (role === Role.MANAGER) {
    return <Navigate to="/manager/restaurant" replace />;
  }
  return <Outlet />;
};
