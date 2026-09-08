import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { RootState } from '../store/store';
import { Role } from '../constants';
import { useGetRestaurantByIdQuery } from '../features/restaurants/restaurantsSlice';
import { getCategoryStyle } from '../utils/categoryColor';
import { getCategoryDisplayName, getCategoryColorSeed } from '../utils/categoryLabels';
import {
  Container,
  Paper,
  Typography,
  Box,
  Chip,
  Grid,
  Divider,
  Button,
  Skeleton
} from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CategoryIcon from '@mui/icons-material/Category';
import BadgeIcon from '@mui/icons-material/Badge';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { DAYS_OF_WEEK, formatWorkingHoursTime } from '../utils/workingHours';

const RestaurantDetailPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const restaurantId = Number(id);
  const navigate = useNavigate();
  const { token, role } = useSelector((state: RootState) => state.auth);

  const { data: restaurant, isLoading, error } = useGetRestaurantByIdQuery(
    restaurantId,
    { skip: isNaN(restaurantId) }
  );

  const handleReserveClick = () => {
    if (!token) {
      navigate('/login');
      return;
    }
    if (role === Role.CLIENT) {
      navigate(`/restaurants/${restaurantId}/reserve`, { state: { from: `/restaurants/${restaurantId}` } });
    }
  };

  if (isNaN(restaurantId) || error) {
    return (
      <Container maxWidth="md" sx={{ mt: { xs: 4, sm: 8 }, mb: 4, px: { xs: 2, sm: 0 } }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
          <Typography color="error" variant="h5" fontWeight="bold" gutterBottom>
            {t('restaurantDetail.errorTitle')}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {t('restaurantDetail.errorBody')}
          </Typography>
          <Button
            component={Link}
            to="/"
            variant="contained"
            color="primary"
            sx={{ textTransform: 'none', fontWeight: 'bold', borderRadius: 2 }}
          >
            {t('restaurantDetail.backHome')}
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: { xs: 2, sm: 4 }, mb: { xs: 2, sm: 4 }, px: { xs: 1, sm: 2 } }}>
      <Paper elevation={3} sx={{ p: { xs: 3, sm: 5 }, borderRadius: 4 }}>
        {isLoading ? (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
              <Skeleton variant="circular" width={70} height={70} />
              <Box sx={{ flexGrow: 1 }}>
                <Skeleton width="50%" height={40} />
                <Skeleton width="30%" height={24} sx={{ mt: 1 }} />
              </Box>
            </Box>
            <Divider sx={{ mb: 4 }} />
            <Grid container spacing={4}>
              <Grid item xs={12} sm={6}>
                <Skeleton width="80%" height={32} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Skeleton width="70%" height={32} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Skeleton width="90%" height={32} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Skeleton width="60%" height={32} />
              </Grid>
            </Grid>
          </Box>
        ) : restaurant ? (
          <>
            {/* Header Block */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between',
                alignItems: { xs: 'flex-start', sm: 'center' },
                gap: 2,
                mb: 4
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 2 } }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    borderRadius: '50%',
                    width: { xs: 55, sm: 70 },
                    height: { xs: 55, sm: 70 },
                    flexShrink: 0
                  }}
                >
                  <RestaurantIcon sx={{ fontSize: { xs: 30, sm: 38 } }} />
                </Box>
                <Box>
                  <Typography variant="h3" component="h1" fontWeight="bold" sx={{ fontSize: { xs: '1.75rem', sm: '2.5rem' } }}>
                    {restaurant.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>
                    {t('restaurantDetail.subtitle')}
                  </Typography>
                </Box>
              </Box>

              <Chip
                label={restaurant.isOpen ? t('restaurantDetail.statusOpen') : t('restaurantDetail.statusClosed')}
                color={restaurant.isOpen ? 'success' : 'error'}
                sx={{ fontWeight: 'bold' }}
              />
            </Box>

            <Divider sx={{ mb: 4 }} />

            {restaurant.images?.[0] && (
              <Box
                component="img"
                src={restaurant.images[0].url}
                alt={restaurant.name}
                sx={{ width: '100%', maxHeight: 280, objectFit: 'cover', borderRadius: 2, mb: 4 }}
              />
            )}

            {/* Specifications Section */}
            <Box sx={{ mb: 5 }}>
              <Typography variant="h6" fontWeight="bold" color="text.secondary" sx={{ mb: 3 }}>
                {t('restaurantDetail.aboutTitle')}
              </Typography>

              <Grid container spacing={4}>
                {/* Restaurant ID */}
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <BadgeIcon color="primary" sx={{ mt: 0.5, fontSize: 28 }} />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
                        {t('restaurantDetail.restaurantId')}
                      </Typography>
                      <Typography variant="body1" sx={{ mt: 0.5, fontSize: '1.1rem' }}>
                        #{restaurant.id}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                {/* Restaurant Name */}
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <RestaurantIcon color="primary" sx={{ mt: 0.5, fontSize: 28 }} />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
                        {t('restaurantDetail.officialName')}
                      </Typography>
                      <Typography variant="body1" sx={{ mt: 0.5, fontSize: '1.1rem' }}>
                        {restaurant.name}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                {/* Restaurant Address */}
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <LocationOnIcon color="primary" sx={{ mt: 0.5, fontSize: 28 }} />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
                        {t('restaurantDetail.address')}
                      </Typography>
                      <Typography variant="body1" sx={{ mt: 0.5, fontSize: '1.1rem' }}>
                        {restaurant.address || t('restaurantDetail.addressNotListed')}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                {/* Restaurant Phone Number */}
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <PhoneIcon color="primary" sx={{ mt: 0.5, fontSize: 28 }} />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
                        {t('restaurantDetail.phoneNumber')}
                      </Typography>
                      <Typography variant="body1" sx={{ mt: 0.5, fontSize: '1.1rem' }}>
                        {restaurant.phoneNumber || t('restaurantDetail.phoneNotListed')}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                {/* Categories */}
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <CategoryIcon color="primary" sx={{ mt: 0.5, fontSize: 28 }} />
                    <Box sx={{ width: '100%' }}>
                      <Typography variant="subtitle2" color="text.secondary" fontWeight="bold" sx={{ mb: 1.5 }}>
                        {t('restaurantDetail.categories')}
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {restaurant.categories && restaurant.categories.length > 0 ? (
                          Array.from(restaurant.categories).map((category) => {
                            const style = getCategoryStyle(getCategoryColorSeed(category));
                            return (
                              <Chip
                                key={category.id}
                                label={getCategoryDisplayName(category, i18n.language)}
                                sx={{
                                  fontWeight: 'semibold',
                                  fontSize: '0.85rem',
                                  px: 1.5,
                                  py: 0.5,
                                  ...style
                                }}
                              />
                            );
                          })
                        ) : (
                          <Chip
                            label={t('common.generalCategory')}
                            sx={{
                              fontWeight: 'medium',
                              fontSize: '0.85rem',
                              backgroundColor: 'action.hover',
                              color: 'text.secondary'
                            }}
                          />
                        )}
                      </Box>
                    </Box>
                  </Box>
                </Grid>

                {/* Working Hours */}
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <AccessTimeIcon color="primary" sx={{ mt: 0.5, fontSize: 28 }} />
                    <Box sx={{ width: '100%' }}>
                      <Typography variant="subtitle2" color="text.secondary" fontWeight="bold" sx={{ mb: 1.5 }}>
                        {t('restaurantDetail.workingHoursTitle')}
                      </Typography>
                      <Grid container spacing={1}>
                        {DAYS_OF_WEEK.map((day) => {
                          const entry = restaurant.workingHours?.find((item) => item.dayOfWeek === day);
                          const isClosed = !entry || entry.closed;
                          return (
                            <Grid item xs={12} sm={6} key={day}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2" fontWeight="bold">
                                  {t(`restaurantDetail.days.${day.toLowerCase()}`)}
                                </Typography>
                                <Typography variant="body2" color={isClosed ? 'error.main' : 'text.secondary'}>
                                  {isClosed
                                    ? t('restaurantDetail.statusClosed')
                                    : `${formatWorkingHoursTime(entry!.openTime)} - ${formatWorkingHoursTime(entry!.closeTime)}`}
                                </Typography>
                              </Box>
                            </Grid>
                          );
                        })}
                      </Grid>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ mb: 4 }} />

            {/* Action Button Section */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<CalendarMonthIcon />}
                onClick={handleReserveClick}
                sx={{
                  textTransform: 'none',
                  fontWeight: 'bold',
                  borderRadius: 3,
                  px: { xs: 4, sm: 6 },
                  py: 1.5,
                  fontSize: '1.1rem',
                  boxShadow: '0px 4px 14px rgba(25, 118, 210, 0.3)',
                  '&:hover': {
                    boxShadow: '0px 6px 20px rgba(25, 118, 210, 0.4)'
                  }
                }}
              >
                {t('restaurantDetail.bookTable')}
              </Button>
            </Box>
          </>
        ) : null}
      </Paper>
    </Container>
  );
};

export default RestaurantDetailPage;
