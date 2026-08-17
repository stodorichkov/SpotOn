import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Tabs, Tab } from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { useLogoutMutation } from '../features/auth/authApi';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import { addAlert } from '../features/alerts/alertsSlice';

const AppTopBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
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

  // Determine the current tab value based on the path
  const currentTab = location.pathname.startsWith('/users') ? '/users' : location.pathname;

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
          <Tabs
            value={currentTab}
            textColor="inherit"
            indicatorColor="secondary"
            sx={{ ml: 2, '& .MuiTabs-indicator': { backgroundColor: 'white' } }}
          >
            <Tab
              label="Users"
              value="/users"
              icon={<GroupIcon />}
              iconPosition="start"
              component={Link}
              to="/users"
            />
          </Tabs>
        )}

        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {token ? (
            <>
              <Tabs
                value={currentTab}
                textColor="inherit"
                indicatorColor="secondary"
                sx={{ '& .MuiTabs-indicator': { backgroundColor: 'white' } }}
              >
                <Tab
                  label="Profile"
                  value="/profile"
                  icon={<PersonIcon />}
                  iconPosition="start"
                  component={Link}
                  to="/profile"
                />
              </Tabs>
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