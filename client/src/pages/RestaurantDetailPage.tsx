import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { Role } from '../constants';
import { useGetRestaurantByIdQuery } from '../features/restaurants/restaurantsSlice';
import { getCategoryStyle } from '../utils/categoryColor';
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

const RestaurantDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const restaurantId = Number(id);
  const navigate = useNavigate();
  const { token, role } = useSelector((state: RootState) => state.auth);

  // Fetch restaurant details dynamically from the API by ID
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

  // Handle error or invalid ID gracefully
  if (isNaN(restaurantId) || error) {
    return (
      <Container maxWidth="md" sx={{ mt: { xs: 4, sm: 8 }, mb: 4, px: { xs: 2, sm: 0 } }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
          <Typography color="error" variant="h5" fontWeight="bold" gutterBottom>
            Restaurant Details Unavailable
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            The restaurant details could not be loaded. It may not exist or there might be a network issue.
          </Typography>
          <Button
            component={Link}
            to="/"
            variant="contained"
            color="primary"
            sx={{ textTransform: 'none', fontWeight: 'bold', borderRadius: 2 }}
          >
            Go to Home Page
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: { xs: 2, sm: 4 }, mb: { xs: 2, sm: 4 }, px: { xs: 1, sm: 2 } }}>
      <Paper elevation={3} sx={{ p: { xs: 3, sm: 5 }, borderRadius: 4 }}>
        {isLoading ? (
          // Skeleton Loader while fetching details from the API
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
                    Detailed specifications & dining catalog
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Divider sx={{ mb: 4 }} />

            {/* Specifications Section */}
            <Box sx={{ mb: 5 }}>
              <Typography variant="h6" fontWeight="bold" color="text.secondary" sx={{ mb: 3 }}>
                About the Restaurant
              </Typography>

              <Grid container spacing={4}>
                {/* Restaurant ID */}
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <BadgeIcon color="primary" sx={{ mt: 0.5, fontSize: 28 }} />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
                        Restaurant ID
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
                        Official Name
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
                        Address
                      </Typography>
                      <Typography variant="body1" sx={{ mt: 0.5, fontSize: '1.1rem' }}>
                        {restaurant.address || 'Address not listed'}
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
                        Phone Number
                      </Typography>
                      <Typography variant="body1" sx={{ mt: 0.5, fontSize: '1.1rem' }}>
                        {restaurant.phoneNumber || 'Phone not listed'}
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
                        Categories
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {restaurant.categories && restaurant.categories.length > 0 ? (
                          Array.from(restaurant.categories).map((category) => {
                            const style = getCategoryStyle(category.name);
                            return (
                              <Chip
                                key={category.id}
                                label={category.name}
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
                            label="General"
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
                Book Table
              </Button>
            </Box>
          </>
        ) : null}
      </Paper>
    </Container>
  );
};

export default RestaurantDetailPage;
