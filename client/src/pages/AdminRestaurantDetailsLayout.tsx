import React, { useState } from 'react';
import { useParams, useLocation, Outlet, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useGetRestaurantByIdQuery, useUpdateRestaurantActiveStatusMutation } from '../features/restaurants/restaurantsSlice';
import { addAlert } from '../features/alerts/alertsSlice';
import {
  Container,
  Paper,
  Box,
  Typography,
  Tabs,
  Tab,
  Divider,
  Skeleton,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery
} from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import InfoIcon from '@mui/icons-material/Info';
import PeopleIcon from '@mui/icons-material/People';
import TableBarIcon from '@mui/icons-material/TableBar';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const AdminRestaurantDetailsLayout: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const restaurantId = Number(id);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [tabMenuAnchorEl, setTabMenuAnchorEl] = useState<null | HTMLElement>(null);

  const { data: restaurant, isLoading } = useGetRestaurantByIdQuery(
    restaurantId,
    { skip: isNaN(restaurantId) }
  );

  const [updateRestaurantActiveStatus, { isLoading: isTogglingActive }] = useUpdateRestaurantActiveStatusMutation();
  const [isToggleDialogOpen, setIsToggleDialogOpen] = useState(false);

  const handleToggleActiveConfirm = async () => {
    if (!restaurant) return;
    try {
      await updateRestaurantActiveStatus({
        id: restaurant.id,
        body: { isActive: !restaurant.isActive }
      }).unwrap();
      dispatch(addAlert({
        message: restaurant.isActive ? t('restaurants.deactivateSuccess') : t('restaurants.activateSuccess'),
        type: 'success'
      }));
    } catch (err: any) {
      console.error('Failed to update restaurant active status:', err);
      dispatch(addAlert({
        message: err?.data?.message || t('restaurants.toggleActiveFailure'),
        type: 'error'
      }));
    } finally {
      setIsToggleDialogOpen(false);
    }
  };

  const basePath = `/admin/restaurants/${id}`;
  const currentTab = location.pathname.startsWith(`${basePath}/employees`)
    ? `${basePath}/employees`
    : location.pathname.startsWith(`${basePath}/tables`)
      ? `${basePath}/tables`
      : location.pathname.startsWith(`${basePath}/bookings`)
        ? `${basePath}/bookings`
        : basePath;

  const tabItems = [
    { value: basePath, label: t('adminRestaurantDetails.tabDetails'), icon: <InfoIcon fontSize="small" /> },
    { value: `${basePath}/employees`, label: t('adminRestaurantDetails.tabEmployees'), icon: <PeopleIcon fontSize="small" /> },
    { value: `${basePath}/tables`, label: t('adminRestaurantDetails.tabTables'), icon: <TableBarIcon fontSize="small" /> },
    { value: `${basePath}/bookings`, label: t('adminRestaurantDetails.tabBookings'), icon: <CalendarMonthIcon fontSize="small" /> }
  ];
  const activeTabItem = tabItems.find((item) => item.value === currentTab) || tabItems[0];

  return (
    <>
      <Container maxWidth="md" sx={{ mt: { xs: 2, sm: 4 }, mb: { xs: 1, sm: 2 }, px: { xs: 1, sm: 2 } }}>
        <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Box sx={{ p: { xs: 2, sm: 3 } }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: 2
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: { xs: 1.5, sm: 2 } }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    borderRadius: '50%',
                    width: { xs: 45, sm: 50 },
                    height: { xs: 45, sm: 50 },
                    flexShrink: 0
                  }}
                >
                  <RestaurantIcon sx={{ fontSize: { xs: 24, sm: 28 } }} />
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  {isLoading ? (
                    <Skeleton width={180} height={32} />
                  ) : (
                    <Typography variant="h5" component="h1" fontWeight="bold" noWrap sx={{ fontSize: { xs: '1.3rem', sm: '1.6rem' } }}>
                      {restaurant?.name || `#${id}`}
                    </Typography>
                  )}
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.85rem' } }}>
                    {t('adminRestaurantDetails.subtitle')}
                  </Typography>
                </Box>
              </Box>

              {restaurant && (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1, alignSelf: { xs: 'flex-end', sm: 'auto' } }}>
                  <Chip
                    label={restaurant.isOpen ? t('restaurants.statusOpen') : t('restaurants.statusClosed')}
                    color={restaurant.isOpen ? 'success' : 'error'}
                    sx={{ fontWeight: 'bold', alignSelf: { xs: 'flex-end', sm: 'auto' } }}
                  />
                  <ToggleButtonGroup
                    value={restaurant.isActive ? 'active' : 'inactive'}
                    exclusive
                    size="small"
                    onChange={(e, newValue) => {
                      if (newValue !== null && newValue !== (restaurant.isActive ? 'active' : 'inactive')) {
                        setIsToggleDialogOpen(true);
                      }
                    }}
                  >
                    <ToggleButton value="active" color="success" sx={{ textTransform: 'none', fontWeight: 'bold', px: 2 }}>
                      {t('restaurants.activeStatusActive')}
                    </ToggleButton>
                    <ToggleButton value="inactive" color="error" sx={{ textTransform: 'none', fontWeight: 'bold', px: 2 }}>
                      {t('restaurants.activeStatusInactive')}
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Box>
              )}
            </Box>
          </Box>
          <Divider />
          {isMobile ? (
            <Box sx={{ p: 1.5 }}>
              <Button
                fullWidth
                onClick={(e) => setTabMenuAnchorEl(e.currentTarget)}
                startIcon={activeTabItem.icon}
                endIcon={<ArrowDropDownIcon />}
                sx={{
                  justifyContent: 'space-between',
                  textTransform: 'none',
                  fontWeight: 'bold',
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  color: 'text.primary',
                  px: 2
                }}
              >
                {activeTabItem.label}
              </Button>
              <Menu
                anchorEl={tabMenuAnchorEl}
                open={Boolean(tabMenuAnchorEl)}
                onClose={() => setTabMenuAnchorEl(null)}
                PaperProps={{ sx: { borderRadius: 2, minWidth: 200 } }}
              >
                {tabItems.map((item) => (
                  <MenuItem
                    key={item.value}
                    component={Link}
                    to={item.value}
                    selected={item.value === currentTab}
                    onClick={() => setTabMenuAnchorEl(null)}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 'bold' }} />
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          ) : (
            <Tabs value={currentTab} variant="scrollable" scrollButtons="auto">
              {tabItems.map((item) => (
                <Tab
                  key={item.value}
                  component={Link}
                  to={item.value}
                  value={item.value}
                  icon={item.icon}
                  iconPosition="start"
                  label={item.label}
                  sx={{ textTransform: 'none', fontWeight: 'bold' }}
                />
              ))}
            </Tabs>
          )}
        </Paper>
      </Container>
      <Outlet context={restaurant} />

      {/* Activate / Deactivate Confirmation Dialog */}
      {restaurant && (
        <Dialog
          open={isToggleDialogOpen}
          onClose={() => setIsToggleDialogOpen(false)}
          aria-labelledby="toggle-active-dialog-title"
          PaperProps={{ sx: { borderRadius: 3, px: 1, py: 0.5 } }}
        >
          <DialogTitle id="toggle-active-dialog-title" fontWeight="bold">
            {restaurant.isActive ? t('restaurants.deactivateTitle') : t('restaurants.activateTitle')}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              {restaurant.isActive
                ? t('restaurants.deactivateBody', { name: restaurant.name })
                : t('restaurants.activateBody', { name: restaurant.name })}
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button
              onClick={() => setIsToggleDialogOpen(false)}
              color="inherit"
              sx={{ textTransform: 'none', fontWeight: 'bold' }}
              disabled={isTogglingActive}
            >
              {t('common.cancel')}
            </Button>
            <Button
              onClick={handleToggleActiveConfirm}
              color={restaurant.isActive ? 'error' : 'success'}
              variant="contained"
              sx={{ textTransform: 'none', fontWeight: 'bold', borderRadius: 2 }}
              disabled={isTogglingActive}
              startIcon={isTogglingActive ? <CircularProgress size={16} color="inherit" /> : undefined}
              autoFocus
            >
              {restaurant.isActive ? t('restaurants.menuDeactivate') : t('restaurants.menuActivate')}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

export default AdminRestaurantDetailsLayout;
