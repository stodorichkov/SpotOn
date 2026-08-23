import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../store/store';
import { useGetRestaurantsQuery } from '../features/restaurants/restaurantsSlice';
import { getCategoryStyle } from '../utils/categoryColor';
import { Role } from '../constants';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  Paper,
  Skeleton,
  Pagination,
  Divider
} from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const HomePage: React.FC = () => {
  const { token, role } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  const [page, setPage] = useState(0);
  const size = 9; // Show 9 restaurant cards per page for a perfect 3x3 grid

  const { data, isLoading, error } = useGetRestaurantsQuery({ page, size });

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value - 1);
  };

  const handleReserveClick = (restaurantId: number, restaurantName: string) => {
    if (!token) {
      navigate('/login');
      return;
    }
    if (role === Role.CLIENT) {
      navigate(`/restaurants/${restaurantId}/reserve`, { state: { from: '/' } });
    }
  };

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 6, mb: 6 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
          <Typography color="error" variant="h5" fontWeight="bold" gutterBottom>
            Failed to Load Restaurants
          </Typography>
          <Typography variant="body1" color="text.secondary">
            We encountered an issue while fetching our restaurant list. Please refresh or try again later.
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: { xs: 3, sm: 5 }, mb: 6 }}>
      {/* Hero Banner Section */}
      <Box 
        sx={{ 
          textAlign: 'center', 
          mb: { xs: 4, sm: 6 }, 
          py: { xs: 4, sm: 6 }, 
          px: 2,
          borderRadius: 4,
          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
          color: '#ffffff',
          boxShadow: '0px 4px 20px rgba(25, 118, 210, 0.25)'
        }}
      >
        <Typography 
          variant="h3" 
          component="h1" 
          fontWeight="bold" 
          gutterBottom
          sx={{ fontSize: { xs: '2rem', sm: '3rem' } }}
        >
          Discover & Book Restaurants
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            opacity: 0.9, 
            maxWidth: '600px', 
            margin: '0 auto',
            fontSize: { xs: '0.95rem', sm: '1.25rem' } 
          }}
        >
          Explore top culinary venues around you and reserve your spot instantly.
        </Typography>
      </Box>

      {/* Main Grid Section */}
      <Box sx={{ minHeight: '400px' }}>
        {isLoading ? (
          <Grid container spacing={3}>
            {[...Array(6)].map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={`skeleton-${index}`}>
                <Card sx={{ height: '100%', borderRadius: 3, display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ height: 140, backgroundColor: 'action.hover', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Skeleton variant="circular" width={60} height={60} />
                  </Box>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Skeleton width="60%" height={32} sx={{ mb: 1 }} />
                    <Skeleton width="40%" height={20} sx={{ mb: 2 }} />
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Skeleton width={60} height={28} />
                      <Skeleton width={80} height={28} />
                    </Box>
                  </CardContent>
                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Skeleton width="100%" height={36} />
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : !data || data.content.length === 0 ? (
          <Paper elevation={2} sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No restaurants are currently listed.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Please check back later as we expand our dining catalog!
            </Typography>
          </Paper>
        ) : (
          <>
            <Grid container spacing={3.5}>
              {data.content.map((restaurant) => {
                if (!restaurant) return null;
                return (
                  <Grid item xs={12} sm={6} md={4} key={restaurant.id}>
                    <Card 
                      elevation={3}
                      onClick={() => navigate(`/restaurants/${restaurant.id}`, { state: { restaurant } })}
                      sx={{ 
                        height: '100%', 
                        borderRadius: 3.5, 
                        display: 'flex', 
                        flexDirection: 'column',
                        cursor: 'pointer',
                        transition: 'transform 0.25s, boxShadow 0.25s',
                        '&:hover': {
                          transform: 'translateY(-6px)',
                          boxShadow: '0px 12px 30px rgba(0, 0, 0, 0.12)'
                        }
                      }}
                    >
                      {/* Card Cover Placeholder */}
                      <Box 
                        sx={{ 
                          height: 120, 
                          background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.08) 0%, rgba(21, 101, 192, 0.15) 100%)',
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          borderTopLeftRadius: 'inherit',
                          borderTopRightRadius: 'inherit',
                          color: 'primary.main'
                        }}
                      >
                        <RestaurantIcon sx={{ fontSize: 44, opacity: 0.8 }} />
                      </Box>

                      {/* Card Content */}
                      <CardContent sx={{ flexGrow: 1, p: 3 }}>
                        <Typography variant="h5" component="h2" fontWeight="bold" gutterBottom>
                          {restaurant.name}
                        </Typography>
                        
                        <Divider sx={{ my: 1.5, opacity: 0.6 }} />
                        
                        {/* Categories Box */}
                        <Box sx={{ mt: 1.5 }}>
                          <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1, fontWeight: 'bold' }}>
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
                                    size="small"
                                    sx={{ 
                                      fontWeight: 'medium',
                                      fontSize: '0.75rem',
                                      ...style
                                    }}
                                  />
                                );
                              })
                            ) : (
                              <Chip
                                label="General"
                                size="small"
                                sx={{ 
                                  fontWeight: 'medium',
                                  fontSize: '0.75rem',
                                  backgroundColor: 'action.hover',
                                  color: 'text.secondary'
                                }}
                              />
                            )}
                          </Box>
                        </Box>
                      </CardContent>

                      {/* Card Actions Button */}
                      <CardActions sx={{ p: 3, pt: 0 }}>
                        <Button
                          fullWidth
                          variant="contained"
                          color="primary"
                          startIcon={<CalendarMonthIcon />}
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent card onClick navigation
                            handleReserveClick(restaurant.id, restaurant.name);
                          }}
                          sx={{ 
                            textTransform: 'none', 
                            fontWeight: 'bold', 
                            borderRadius: 2.5,
                            py: 1,
                            boxShadow: 'none',
                            '&:hover': {
                              boxShadow: 'none'
                            }
                          }}
                        >
                          Book Table
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>

            {/* Pagination Controls */}
            {data.totalPages > 1 && (
              <Box sx={{ mt: 6, display: 'flex', justifyContent: 'center' }}>
                <Pagination 
                  count={data.totalPages} 
                  page={page + 1} 
                  onChange={handlePageChange} 
                  color="primary" 
                  size="large"
                  sx={{
                    '& .MuiPaginationItem-root': {
                      borderRadius: 2
                    }
                  }}
                />
              </Box>
            )}
          </>
        )}
      </Box>
    </Container>
  );
};

export default HomePage;
