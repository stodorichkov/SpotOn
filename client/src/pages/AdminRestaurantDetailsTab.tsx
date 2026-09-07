import React from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGetRestaurantByIdQuery } from '../features/restaurants/restaurantsSlice';
import { getCategoryStyle } from '../utils/categoryColor';
import { DAYS_OF_WEEK, formatWorkingHoursTime } from '../utils/workingHours';
import {
  Container,
  Paper,
  Typography,
  Box,
  Chip,
  Grid,
  Skeleton
} from '@mui/material';
import BadgeIcon from '@mui/icons-material/Badge';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import CategoryIcon from '@mui/icons-material/Category';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TimerIcon from '@mui/icons-material/Timer';

const AdminRestaurantDetailsTab: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const restaurantId = Number(id);

  const { data: restaurant, isLoading, error } = useGetRestaurantByIdQuery(
    restaurantId,
    { skip: isNaN(restaurantId) }
  );

  if (isLoading) {
    return (
      <Container maxWidth="md" sx={{ mb: { xs: 2, sm: 4 }, px: { xs: 1, sm: 2 } }}>
        <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 3 }}>
          <Skeleton variant="rectangular" height={150} sx={{ borderRadius: 2, mb: 2 }} />
          <Skeleton variant="rectangular" height={150} sx={{ borderRadius: 2 }} />
        </Paper>
      </Container>
    );
  }

  if (error || !restaurant) {
    return (
      <Container maxWidth="md" sx={{ mb: { xs: 2, sm: 4 }, px: { xs: 1, sm: 2 } }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
          <Typography color="error" variant="h6" fontWeight="bold" gutterBottom>
            {t('common.error')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t('restaurants.errorLoading')}
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mb: { xs: 2, sm: 4 }, px: { xs: 1, sm: 2 } }}>
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 3 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              <BadgeIcon color="primary" sx={{ mt: 0.5, fontSize: 28 }} />
              <Box>
                <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
                  {t('restaurants.id')}
                </Typography>
                <Typography variant="body1" sx={{ mt: 0.5, fontSize: '1.1rem' }}>
                  #{restaurant.id}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              <LocationOnIcon color="primary" sx={{ mt: 0.5, fontSize: 28 }} />
              <Box>
                <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
                  {t('restaurants.address')}
                </Typography>
                <Typography variant="body1" sx={{ mt: 0.5, fontSize: '1.1rem' }}>
                  {restaurant.address || '-'}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              <PhoneIcon color="primary" sx={{ mt: 0.5, fontSize: 28 }} />
              <Box>
                <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
                  {t('restaurants.phoneNumber')}
                </Typography>
                <Typography variant="body1" sx={{ mt: 0.5, fontSize: '1.1rem' }}>
                  {restaurant.phoneNumber || '-'}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              <TimerIcon color="primary" sx={{ mt: 0.5, fontSize: 28 }} />
              <Box>
                <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
                  {t('managerRestaurant.reservationDurationLabel')}
                </Typography>
                <Typography variant="body1" sx={{ mt: 0.5, fontSize: '1.1rem' }}>
                  {restaurant.reservationDurationMinutes}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              <CategoryIcon color="primary" sx={{ mt: 0.5, fontSize: 28 }} />
              <Box sx={{ width: '100%' }}>
                <Typography variant="subtitle2" color="text.secondary" fontWeight="bold" sx={{ mb: 1.5 }}>
                  {t('restaurants.categories')}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {restaurant.categories && restaurant.categories.length > 0 ? (
                    restaurant.categories.map((category) => (
                      <Chip
                        key={category.id}
                        label={category.name}
                        sx={{ ...getCategoryStyle(category.name), fontWeight: 'bold' }}
                      />
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">{t('restaurants.noCategories')}</Typography>
                  )}
                </Box>
              </Box>
            </Box>
          </Grid>

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
                              ? t('restaurants.statusClosed')
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
      </Paper>
    </Container>
  );
};

export default AdminRestaurantDetailsTab;
