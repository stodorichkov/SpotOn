import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { useLogoutMutation } from '../features/auth/authApi';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import { addAlert } from '../features/alerts/alertsSlice';

const AppTopBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token, role } = useSelector((state: RootState) => state.auth);
  const [logoutApi] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
      dispatch(addAlert({ message: 'Logged out successfully!', type: 'success' }));
      navigate('/login'); // Redirect to login page after logout
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to={role === 'ADMIN' ? '/users' : '/'}
          sx={{
            textDecoration: 'none',
            color: 'inherit',
            fontWeight: 'bold',
          }}
        >
          SpotOn
        </Typography>
        {role === 'ADMIN' && (
          <Button
            color="inherit"
            component={Link}
            to="/users"
            startIcon={<GroupIcon />}
            sx={{ ml: 2, textTransform: 'none', fontWeight: 'bold' }}
          >
            Users
          </Button>
        )}
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
          {token ? (
            <>
              <Button
                variant="text"
                color="inherit"
                component={Link}
                to="/profile"
                startIcon={<PersonIcon />}
                sx={{
                  textTransform: 'none',
                  fontWeight: 'bold',
                }}
              >
                Profile
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleLogout}
                sx={{
                  textTransform: 'none',
                  fontWeight: 'bold',
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="contained"
                color="primary"
                component={Link}
                to="/login"
                sx={{
                  textTransform: 'none',
                  fontWeight: 'bold',
                }}
              >
                Login
              </Button>
              <Button
                variant="contained"
                color="secondary"
                component={Link}
                to="/register"
                sx={{ textTransform: 'none', fontWeight: 'bold' }}
              >
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AppTopBar;