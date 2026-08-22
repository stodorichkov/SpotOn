import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../store/store';

const HomePage = () => {
  const { token, role } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      if (role === 'ADMIN') {
        navigate('/admin/users', { replace: true });
      } else if (role === 'MANAGER') {
        navigate('/manager/restaurant', { replace: true });
      }
    }
  }, [token, role, navigate]);

  return (
    <div>
      <h1>Home Page</h1>
    </div>
  );
};

export default HomePage;
