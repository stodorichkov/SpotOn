import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { RootState } from '../store/store';
import { useGetRestaurantsQuery, useGetCategoriesQuery } from '../features/restaurants/restaurantsSlice';
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
  Divider,
  TextField,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CategoryIcon from '@mui/icons-material/Category';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ClearIcon from '@mui/icons-material/Clear';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const { token, role } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  const [page, setPage] = useState(0);
  const size = 9;

  const [nameInput, setNameInput] = useState('');
  const [addressInput, setAddressInput] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [categoryIds, setCategoryIds] = useState<number[]>([]);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [draftCategoryIds, setDraftCategoryIds] = useState<number[]>([]);

  const { data: availableCategories = [] } = useGetCategoriesQuery();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setName(nameInput.trim());
      setPage(0);
    }, 400);
    return () => clearTimeout(timeout);
  }, [nameInput]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAddress(addressInput.trim());
      setPage(0);
    }, 400);
    return () => clearTimeout(timeout);
  }, [addressInput]);

  const { data, isFetching, error } = useGetRestaurantsQuery({
    page,
    size,
    name: name || undefined,
    address: address || undefined,
    categoryIds: categoryIds.length > 0 ? categoryIds : undefined,
  });

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

  const handleOpenCategoryDialog = () => {
    setDraftCategoryIds(categoryIds);
    setIsCategoryDialogOpen(true);
  };

  const handleCloseCategoryDialog = () => {
    setIsCategoryDialogOpen(false);
  };

  const handleToggleDraftCategory = (categoryId: number) => {
    setDraftCategoryIds((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
    );
  };

  const handleApplyCategoryDialog = () => {
    setCategoryIds(draftCategoryIds);
    setPage(0);
    setIsCategoryDialogOpen(false);
  };

  const categoryFieldValue = (() => {
    if (categoryIds.length === 0) {
      return '';
    }
    if (categoryIds.length === 1) {
      return availableCategories.find((c) => c.id === categoryIds[0])?.name || '';
    }
    return t('home.categoriesCount', { count: categoryIds.length });
  })();

  const hasActiveFilters = nameInput !== '' || addressInput !== '' || categoryIds.length > 0;

  const handleClearFilters = () => {
    setNameInput('');
    setAddressInput('');
    setCategoryIds([]);
    setPage(0);
  };

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 6, mb: 6 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
          <Typography color="error" variant="h5" fontWeight="bold" gutterBottom>
            {t('home.errorTitle')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t('home.errorBody')}
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
          {t('home.heroTitle')}
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
          {t('home.heroSubtitle')}
        </Typography>
      </Box>

      {/* Filter Bar */}
      <Paper elevation={2} sx={{ borderRadius: 3, p: { xs: 2, sm: 2.5 }, mb: { xs: 3, sm: 4 } }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'flex-start' }}>
          <TextField
            label={t('home.searchByName')}
            size="small"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            sx={{ minWidth: 180, flex: '1 1 180px' }}
          />
          <TextField
            label={t('home.searchByAddress')}
            size="small"
            value={addressInput}
            onChange={(e) => setAddressInput(e.target.value)}
            sx={{ minWidth: 180, flex: '1 1 180px' }}
          />
          <Button
            variant={categoryIds.length > 0 ? 'contained' : 'outlined'}
            color={categoryIds.length > 0 ? 'primary' : 'inherit'}
            onClick={handleOpenCategoryDialog}
            startIcon={<CategoryIcon />}
            endIcon={<ArrowDropDownIcon />}
            sx={{
              textTransform: 'none',
              fontWeight: 'bold',
              borderRadius: 5,
              px: 2,
              borderColor: 'divider',
            }}
          >
            {categoryIds.length === 0 ? t('home.categoriesButton') : categoryFieldValue}
          </Button>
          {hasActiveFilters && (
            <Tooltip title={t('home.clearFilters')} arrow>
              <IconButton onClick={handleClearFilters} size="small" sx={{ alignSelf: 'center' }}>
                <ClearIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Paper>

      <Dialog open={isCategoryDialogOpen} onClose={handleCloseCategoryDialog} fullWidth maxWidth="xs">
        <DialogTitle>{t('home.categoryDialogTitle')}</DialogTitle>
        <DialogContent dividers>
          {availableCategories.length === 0 ? (
            <Typography variant="body2" color="text.secondary">{t('home.noCategoriesAvailable')}</Typography>
          ) : (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {availableCategories.map((category) => {
                const isSelected = draftCategoryIds.includes(category.id);
                return (
                  <Chip
                    key={category.id}
                    label={category.name}
                    onClick={() => handleToggleDraftCategory(category.id)}
                    variant="outlined"
                    sx={{
                      ...(isSelected ? getCategoryStyle(category.name) : { borderColor: 'divider', color: 'text.secondary' }),
                      fontWeight: isSelected ? 'bold' : 'normal',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        transform: 'scale(1.05)',
                      }
                    }}
                  />
                );
              })}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setDraftCategoryIds([])}
            variant="contained"
            color="error"
            startIcon={<ClearIcon />}
            sx={{ textTransform: 'none', fontWeight: 'bold', borderRadius: 2, mr: 'auto' }}
          >
            {t('common.clear')}
          </Button>
          <Button
            onClick={handleCloseCategoryDialog}
            variant="contained"
            startIcon={<CloseIcon />}
            sx={{
              textTransform: 'none',
              fontWeight: 'bold',
              borderRadius: 2,
              backgroundColor: 'grey.200',
              color: 'text.primary',
              '&:hover': { backgroundColor: 'grey.300' },
            }}
          >
            {t('common.cancel')}
          </Button>
          <Button
            onClick={handleApplyCategoryDialog}
            variant="contained"
            color="primary"
            startIcon={<CheckIcon />}
            sx={{ textTransform: 'none', fontWeight: 'bold', borderRadius: 2 }}
          >
            {t('common.apply')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Main Grid Section */}
      <Box sx={{ minHeight: '400px' }}>
        {isFetching ? (
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
              {hasActiveFilters ? t('home.noResultsFound') : t('home.noRestaurants')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {hasActiveFilters ? t('home.noResultsFoundBody') : t('home.noRestaurantsBody')}
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

                        {restaurant.address && (
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.75, mt: 0.5 }}>
                            <LocationOnIcon color="action" sx={{ fontSize: 18, mt: 0.25 }} />
                            <Typography variant="body2" color="text.secondary">
                              {restaurant.address}
                            </Typography>
                          </Box>
                        )}

                        <Divider sx={{ my: 1.5, opacity: 0.6 }} />

                        {/* Categories Box */}
                        <Box sx={{ mt: 1.5 }}>
                          <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1, fontWeight: 'bold' }}>
                            {t('home.categories')}
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
                                label={t('common.generalCategory')}
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
                            e.stopPropagation();
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
                          {t('home.bookTable')}
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
