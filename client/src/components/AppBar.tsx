import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Tabs, Tab, IconButton, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, useMediaQuery, useTheme } from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { useLogoutMutation } from '../features/auth/authApi';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { addAlert } from '../features/alerts/alertsSlice';

const AppTopBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { token, role } = useSelector((state: RootState) => state.auth);
  const [logoutApi] = useLogoutMutation();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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
  const currentTab = location.pathname.startsWith('/admin/users')
    ? '/admin/users'
    : location.pathname.startsWith('/admin/restaurants')
    ? '/admin/restaurants'
    : location.pathname.startsWith('/manager/restaurant')
    ? '/manager/restaurant'
    : location.pathname.startsWith('/manager/employees')
    ? '/manager/employees'
    : location.pathname;

  const menuItems = [];
  if (role === 'ADMIN') {
    menuItems.push(
      { label: 'Users', path: '/admin/users', icon: <GroupIcon /> },
      { label: 'Restaurants', path: '/admin/restaurants', icon: <RestaurantIcon /> }
    );
  } else if (role === 'MANAGER') {
    menuItems.push(
      { label: 'Restaurant', path: '/manager/restaurant', icon: <RestaurantIcon /> },
      { label: 'Employees', path: '/manager/employees', icon: <GroupIcon /> }
    );
  }

  if (token) {
    menuItems.push(
      { label: 'Profile', path: '/profile', icon: <PersonIcon /> }
    );
  } else {
    menuItems.push(
      { label: 'Login', path: '/login', icon: <PersonIcon /> },
      { label: 'Register', path: '/register', icon: <PersonIcon /> }
    );
  }

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to={role === 'ADMIN' ? '/admin/users' : role === 'MANAGER' ? '/manager/restaurant' : '/'}
          sx={{
            textDecoration: 'none',
            color: 'inherit',
            fontWeight: 'bold',
            flexGrow: isMobile ? 1 : 0
          }}
        >
          SpotOn
        </Typography>
        
        {!isMobile && (
          <>
            {role === 'ADMIN' && (
              <Tabs
                value={currentTab}
                textColor="inherit"
                indicatorColor="secondary"
                sx={{ ml: 2, '& .MuiTabs-indicator': { backgroundColor: 'white' } }}
              >
                <Tab
                  label="Users"
                  value="/admin/users"
                  icon={<GroupIcon />}
                  iconPosition="start"
                  component={Link}
                  to="/admin/users"
                />
                <Tab
                  label="Restaurants"
                  value="/admin/restaurants"
                  icon={<RestaurantIcon />}
                  iconPosition="start"
                  component={Link}
                  to="/admin/restaurants"
                />
              </Tabs>
            )}

            {role === 'MANAGER' && (
              <Tabs
                value={currentTab}
                textColor="inherit"
                indicatorColor="secondary"
                sx={{ ml: 2, '& .MuiTabs-indicator': { backgroundColor: 'white' } }}
              >
                <Tab
                  label="Restaurant"
                  value="/manager/restaurant"
                  icon={<RestaurantIcon />}
                  iconPosition="start"
                  component={Link}
                  to="/manager/restaurant"
                />
                <Tab
                  label="Employees"
                  value="/manager/employees"
                  icon={<GroupIcon />}
                  iconPosition="start"
                  component={Link}
                  to="/manager/employees"
                />
              </Tabs>
            )}

            <Box sx={{ flexGrow: 1 }} />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
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
                    startIcon={<LogoutIcon />}
                    sx={{
                      textTransform: 'none',
                      fontWeight: 'bold',
                      borderRadius: 2,
                      px: 2.5,
                      py: 0.8,
                      boxShadow: 'none',
                      '&:hover': {
                        boxShadow: 'none',
                        backgroundColor: 'secondary.dark',
                      }
                    }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="contained"
                    component={Link}
                    to="/login"
                    startIcon={<LoginIcon />}
                    sx={{
                      textTransform: 'none',
                      fontWeight: 'bold',
                      borderRadius: 2,
                      px: 2.5,
                      py: 0.8,
                      backgroundColor: 'primary.main',
                      color: '#ffffff',
                      boxShadow: 'none',
                      '&:hover': {
                        boxShadow: 'none',
                        backgroundColor: '#1565c0',
                      }
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    variant="contained"
                    component={Link}
                    to="/register"
                    startIcon={<PersonAddIcon />}
                    sx={{ 
                      textTransform: 'none', 
                      fontWeight: 'bold', 
                      borderRadius: 2,
                      px: 2.5,
                      py: 0.8,
                      backgroundColor: 'secondary.main',
                      color: '#ffffff',
                      boxShadow: 'none',
                      '&:hover': {
                        boxShadow: 'none',
                        backgroundColor: '#a31414',
                      }
                    }}
                  >
                    Register
                  </Button>
                </>
              )}
            </Box>
          </>
        )}

        {isMobile && (
          <>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={() => setDrawerOpen(true)}
            >
              <MenuIcon />
            </IconButton>

            <Drawer
              anchor="right"
              open={drawerOpen}
              onClose={() => setDrawerOpen(false)}
            >
              <Box
                sx={{ width: 250, pt: 2 }}
                role="presentation"
              >
                <List>
                  {menuItems.map((item) => (
                    <ListItem key={item.label} disablePadding>
                      <ListItemButton
                        component={Link}
                        to={item.path}
                        onClick={() => setDrawerOpen(false)}
                        selected={currentTab === item.path}
                      >
                        <ListItemIcon sx={{ color: currentTab === item.path ? 'primary.main' : 'inherit' }}>
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText 
                          primary={item.label} 
                          primaryTypographyProps={{ 
                            fontWeight: currentTab === item.path ? 'bold' : 'normal',
                            color: currentTab === item.path ? 'primary.main' : 'inherit'
                          }} 
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                  {token && (
                    <ListItem disablePadding>
                      <ListItemButton
                        onClick={() => {
                          handleLogout();
                          setDrawerOpen(false);
                        }}
                      >
                        <ListItemIcon>
                          <LogoutIcon />
                        </ListItemIcon>
                        <ListItemText primary="Logout" />
                      </ListItemButton>
                    </ListItem>
                  )}
                </List>
              </Box>
            </Drawer>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default AppTopBar;