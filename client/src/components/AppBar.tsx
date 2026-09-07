import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Tabs, Tab, IconButton, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, useMediaQuery, useTheme, Dialog, DialogTitle, DialogContent, Divider } from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { RootState } from '../store/store';
import { useLogoutMutation } from '../features/auth/authApi';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import TableBarIcon from '@mui/icons-material/TableBar';
import CategoryIcon from '@mui/icons-material/Category';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CheckIcon from '@mui/icons-material/Check';
import { addAlert } from '../features/alerts/alertsSlice';
import { Role } from '../constants';
import bgFlag from 'flag-icons/flags/1x1/bg.svg';
import gbFlag from 'flag-icons/flags/1x1/gb.svg';

const LANGUAGES = [
  { code: 'bg', flag: bgFlag },
  { code: 'en', flag: gbFlag },
];

const FlagIcon: React.FC<{ src: string; size: number }> = ({ src, size }) => (
  <Box
    component="img"
    src={src}
    alt=""
    sx={{
      width: size,
      height: size,
      borderRadius: '50%',
      flexShrink: 0,
      display: 'block',
      objectFit: 'cover',
    }}
  />
);

interface LanguageSwitcherProps {
  variant?: 'icon' | 'listItem';
  onOpen?: () => void;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ variant = 'icon', onOpen }) => {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  const currentLanguage = LANGUAGES.find((lang) => lang.code === i18n.resolvedLanguage) || LANGUAGES[1];

  const handleOpen = () => {
    setOpen(true);
    onOpen?.();
  };

  const handleSelect = (code: string) => {
    i18n.changeLanguage(code);
    setOpen(false);
  };

  return (
    <>
      {variant === 'listItem' ? (
        <ListItemButton onClick={handleOpen}>
          <ListItemIcon sx={{ minWidth: 44 }}>
            <FlagIcon src={currentLanguage.flag} size={24} />
          </ListItemIcon>
          <ListItemText primary={t('appBar.selectLanguage')} />
        </ListItemButton>
      ) : (
        <IconButton
          onClick={() => setOpen(true)}
          color="inherit"
          aria-label={t('appBar.selectLanguage')}
        >
          <FlagIcon src={currentLanguage.flag} size={26} />
        </IconButton>
      )}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>{t('appBar.selectLanguage')}</DialogTitle>
        <DialogContent dividers sx={{ p: 0 }}>
          <List disablePadding>
            {LANGUAGES.map((lang) => {
              const isSelected = lang.code === i18n.resolvedLanguage;
              return (
                <ListItemButton
                  key={lang.code}
                  selected={isSelected}
                  onClick={() => handleSelect(lang.code)}
                >
                  <ListItemIcon sx={{ minWidth: 44 }}>
                    <FlagIcon src={lang.flag} size={28} />
                  </ListItemIcon>
                  <ListItemText
                    primary={t(`language.${lang.code}`)}
                    primaryTypographyProps={{ fontWeight: isSelected ? 'bold' : 'normal' }}
                  />
                  {isSelected && (
                    <ListItemIcon sx={{ minWidth: 'auto', color: 'primary.main' }}>
                      <CheckIcon />
                    </ListItemIcon>
                  )}
                </ListItemButton>
              );
            })}
          </List>
        </DialogContent>
      </Dialog>
    </>
  );
};

const AppTopBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { t } = useTranslation();
  const { token, role } = useSelector((state: RootState) => state.auth);
  const [logoutApi] = useLogoutMutation();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
    } catch (error) {
      console.error("Failed to logout:", error);
    } finally {
      dispatch(addAlert({ message: t('appBar.loggedOut'), type: 'success' }));
      navigate('/');
    }
  };

  const currentTab = location.pathname.startsWith('/admin/users')
    ? '/admin/users'
    : location.pathname.startsWith('/admin/restaurants')
    ? '/admin/restaurants'
    : location.pathname.startsWith('/admin/categories')
    ? '/admin/categories'
    : location.pathname.startsWith('/manager/restaurant')
    ? '/manager/restaurant'
    : location.pathname.startsWith('/manager/employees')
    ? '/manager/employees'
    : location.pathname.startsWith('/manager/tables')
    ? '/manager/tables'
    : location.pathname.startsWith('/bookings')
    ? '/bookings'
    : location.pathname.startsWith('/employee/bookings')
    ? '/employee/bookings'
    : location.pathname;

  const menuItems = [];
  if (role === Role.ADMIN) {
    menuItems.push(
      { label: t('appBar.users'), path: '/admin/users', icon: <GroupIcon /> },
      { label: t('appBar.restaurants'), path: '/admin/restaurants', icon: <RestaurantIcon /> },
      { label: t('appBar.categories'), path: '/admin/categories', icon: <CategoryIcon /> }
    );
  } else if (role === Role.MANAGER) {
    menuItems.push(
      { label: t('appBar.restaurant'), path: '/manager/restaurant', icon: <RestaurantIcon /> },
      { label: t('appBar.employees'), path: '/manager/employees', icon: <GroupIcon /> },
      { label: t('appBar.tables'), path: '/manager/tables', icon: <TableBarIcon /> }
    );
  }

  if (role === Role.CLIENT) {
    menuItems.push(
      { label: t('appBar.myBookings'), path: '/bookings', icon: <CalendarMonthIcon /> }
    );
  }

  if (role === Role.EMPLOYEE) {
    menuItems.push(
      { label: t('appBar.bookings'), path: '/employee/bookings', icon: <CalendarMonthIcon /> }
    );
  }

  if (token) {
    menuItems.push(
      { label: t('appBar.profile'), path: '/profile', icon: <PersonIcon /> }
    );
  } else {
    menuItems.push(
      { label: t('appBar.login'), path: '/login', icon: <PersonIcon /> },
      { label: t('appBar.register'), path: '/register', icon: <PersonIcon /> }
    );
  }

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to={role === Role.ADMIN ? '/admin/users' : role === Role.MANAGER ? '/manager/restaurant' : role === Role.EMPLOYEE ? '/employee/bookings' : '/'}
          sx={{
            textDecoration: 'none',
            color: 'inherit',
            fontWeight: 'bold',
            flexGrow: isMobile ? 1 : 0
          }}
        >
          {t('appBar.brand')}
        </Typography>

        {!isMobile && (
          <>
            {role === Role.ADMIN && (
              <Tabs
                value={currentTab}
                textColor="inherit"
                indicatorColor="secondary"
                sx={{ ml: 2, '& .MuiTabs-indicator': { backgroundColor: 'white' } }}
              >
                <Tab
                  label={t('appBar.users')}
                  value="/admin/users"
                  icon={<GroupIcon />}
                  iconPosition="start"
                  component={Link}
                  to="/admin/users"
                />
                <Tab
                  label={t('appBar.restaurants')}
                  value="/admin/restaurants"
                  icon={<RestaurantIcon />}
                  iconPosition="start"
                  component={Link}
                  to="/admin/restaurants"
                />
                <Tab
                  label={t('appBar.categories')}
                  value="/admin/categories"
                  icon={<CategoryIcon />}
                  iconPosition="start"
                  component={Link}
                  to="/admin/categories"
                />
              </Tabs>
            )}

            {role === Role.MANAGER && (
              <Tabs
                value={currentTab}
                textColor="inherit"
                indicatorColor="secondary"
                sx={{ ml: 2, '& .MuiTabs-indicator': { backgroundColor: 'white' } }}
              >
                <Tab
                  label={t('appBar.restaurant')}
                  value="/manager/restaurant"
                  icon={<RestaurantIcon />}
                  iconPosition="start"
                  component={Link}
                  to="/manager/restaurant"
                />
                <Tab
                  label={t('appBar.employees')}
                  value="/manager/employees"
                  icon={<GroupIcon />}
                  iconPosition="start"
                  component={Link}
                  to="/manager/employees"
                />
                <Tab
                  label={t('appBar.tables')}
                  value="/manager/tables"
                  icon={<TableBarIcon />}
                  iconPosition="start"
                  component={Link}
                  to="/manager/tables"
                />
              </Tabs>
            )}

            {role === Role.EMPLOYEE && (
              <Tabs
                value={currentTab}
                textColor="inherit"
                indicatorColor="secondary"
                sx={{ ml: 2, '& .MuiTabs-indicator': { backgroundColor: 'white' } }}
              >
                <Tab
                  label={t('appBar.bookings')}
                  value="/employee/bookings"
                  icon={<CalendarMonthIcon />}
                  iconPosition="start"
                  component={Link}
                  to="/employee/bookings"
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
                    {role === Role.CLIENT && (
                      <Tab
                        label={t('appBar.myBookings')}
                        value="/bookings"
                        icon={<CalendarMonthIcon />}
                        iconPosition="start"
                        component={Link}
                        to="/bookings"
                      />
                    )}
                    <Tab
                      label={t('appBar.profile')}
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
                    {t('appBar.logout')}
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
                    {t('appBar.login')}
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
                    {t('appBar.register')}
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
              ModalProps={{ keepMounted: true }}
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
                        <ListItemText primary={t('appBar.logout')} />
                      </ListItemButton>
                    </ListItem>
                  )}
                  <Divider sx={{ my: 1 }} />
                  <ListItem disablePadding>
                    <LanguageSwitcher variant="listItem" onOpen={() => setDrawerOpen(false)} />
                  </ListItem>
                </List>
              </Box>
            </Drawer>
          </>
        )}

        {!isMobile && (
          <Box sx={{ ml: 2 }}>
            <LanguageSwitcher />
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default AppTopBar;
