import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { RootState } from '../store/store';
import { useGetRestaurantsQuery, useGetCategoriesQuery, RestaurantResponse } from '../features/restaurants/restaurantsSlice';
import { getCategoryStyle } from '../utils/categoryColor';
import { getCategoryDisplayName, getCategoryColorSeed } from '../utils/categoryLabels';
import { Role } from '../constants';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  Paper,
  Skeleton,
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
import SortIcon from '@mui/icons-material/Sort';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SortDialog, { SortDirection } from '../components/SortDialog';

type StatusFilter = 'open' | 'closed';
const STATUS_FILTER_OPTIONS: StatusFilter[] = ['open', 'closed'];

const RestaurantCardSkeleton: React.FC = () => (
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
);

const HomePage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { token, role } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  const [page, setPage] = useState(0);
  const [items, setItems] = useState<RestaurantResponse[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const size = 9;

  const [nameInput, setNameInput] = useState('');
  const [addressInput, setAddressInput] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [categoryIds, setCategoryIds] = useState<number[]>([]);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [draftCategoryIds, setDraftCategoryIds] = useState<number[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter | null>(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [draftStatusFilter, setDraftStatusFilter] = useState<StatusFilter | null>(null);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const sort = `${sortField},${sortDirection}`;
  const [isSortDialogOpen, setIsSortDialogOpen] = useState(false);

  const SORT_FIELDS = [
    { value: 'name', label: t('common.name') },
  ];

  const { data: availableCategories = [] } = useGetCategoriesQuery();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setName(nameInput.trim());
    }, 400);
    return () => clearTimeout(timeout);
  }, [nameInput]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAddress(addressInput.trim());
    }, 400);
    return () => clearTimeout(timeout);
  }, [addressInput]);

  useEffect(() => {
    setPage(0);
    setItems([]);
  }, [name, address, categoryIds, statusFilter, sort]);

  const isOpen = statusFilter === null ? undefined : statusFilter === 'open';

  const { data, isFetching, error } = useGetRestaurantsQuery({
    page,
    size,
    sort,
    name: name || undefined,
    address: address || undefined,
    categoryIds: categoryIds.length > 0 ? categoryIds : undefined,
    isOpen,
  });

  useEffect(() => {
    if (!data) return;
    setItems((prev) => (data.number === 0 ? data.content : [...prev, ...data.content]));
    setTotalPages(data.totalPages);
  }, [data]);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const hasMore = page + 1 < totalPages;

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetching && hasMore) {
          setPage((prev) => prev + 1);
        }
      },
      { rootMargin: '300px' }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [isFetching, hasMore]);

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
    setIsCategoryDialogOpen(false);
  };

  const handleOpenSortDialog = () => {
    setIsSortDialogOpen(true);
  };

  const handleCloseSortDialog = () => {
    setIsSortDialogOpen(false);
  };

  const handleSortFieldSelect = (value: string) => {
    setSortField(value);
  };

  const handleSortDirectionSelect = (value: SortDirection) => {
    setSortDirection(value);
  };

  const categoryFieldValue = (() => {
    if (categoryIds.length === 0) {
      return '';
    }
    if (categoryIds.length === 1) {
      const match = availableCategories.find((c) => c.id === categoryIds[0]);
      return match ? getCategoryDisplayName(match, i18n.language) : '';
    }
    return t('home.categoriesCount', { count: categoryIds.length });
  })();

  const handleOpenStatusDialog = () => {
    setDraftStatusFilter(statusFilter);
    setIsStatusDialogOpen(true);
  };

  const handleCloseStatusDialog = () => {
    setIsStatusDialogOpen(false);
  };

  const handleApplyStatusDialog = () => {
    setStatusFilter(draftStatusFilter);
    setIsStatusDialogOpen(false);
  };

  const statusFilterLabel = (() => {
    switch (statusFilter) {
      case 'open':
        return t('home.statusOpen');
      case 'closed':
        return t('home.statusClosed');
      default:
        return t('home.statusButton');
    }
  })();

  const hasActiveFilters = nameInput !== '' || addressInput !== '' || categoryIds.length > 0 || statusFilter !== null;

  const handleClearFilters = () => {
    setNameInput('');
    setAddressInput('');
    setName('');
    setAddress('');
    setCategoryIds([]);
    setStatusFilter(null);
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
              width: { xs: '100%', sm: 'auto' },
            }}
          >
            {categoryIds.length === 0 ? t('home.categoriesButton') : categoryFieldValue}
          </Button>
          <Button
            variant={statusFilter !== null ? 'contained' : 'outlined'}
            color={statusFilter !== null ? 'primary' : 'inherit'}
            onClick={handleOpenStatusDialog}
            startIcon={<FilterAltIcon />}
            endIcon={<ArrowDropDownIcon />}
            sx={{
              textTransform: 'none',
              fontWeight: 'bold',
              borderRadius: 5,
              px: 2,
              borderColor: 'divider',
              width: { xs: '100%', sm: 'auto' },
            }}
          >
            {statusFilterLabel}
          </Button>
          <Button
            variant="outlined"
            color="inherit"
            onClick={handleOpenSortDialog}
            startIcon={<SortIcon />}
            endIcon={<ArrowDropDownIcon />}
            sx={{
              textTransform: 'none',
              fontWeight: 'bold',
              borderRadius: 5,
              px: 2,
              borderColor: 'divider',
              width: { xs: '100%', sm: 'auto' },
            }}
          >
            {`${SORT_FIELDS.find((f) => f.value === sortField)?.label} · ${sortDirection === 'asc' ? t('common.ascending') : t('common.descending')}`}
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
        <DialogTitle sx={{ pr: 6, position: 'relative' }}>
          {t('home.categoryDialogTitle')}
          <IconButton
            onClick={handleCloseCategoryDialog}
            size="small"
            sx={{ position: 'absolute', right: 12, top: 12, color: 'text.secondary' }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
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
                    label={getCategoryDisplayName(category, i18n.language)}
                    onClick={() => handleToggleDraftCategory(category.id)}
                    variant="outlined"
                    sx={{
                      ...(isSelected ? getCategoryStyle(getCategoryColorSeed(category)) : { borderColor: 'divider', color: 'text.secondary' }),
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
        <DialogActions sx={{ px: 3, pb: 2, gap: 2 }}>
          <Button
            onClick={() => setDraftCategoryIds([])}
            variant="contained"
            color="error"
            startIcon={<ClearIcon />}
            sx={{ textTransform: 'none', fontWeight: 'bold', borderRadius: 2, flex: 1 }}
          >
            {t('common.clear')}
          </Button>
          <Button
            onClick={handleApplyCategoryDialog}
            variant="contained"
            color="primary"
            startIcon={<CheckIcon />}
            sx={{ textTransform: 'none', fontWeight: 'bold', borderRadius: 2, flex: 1 }}
          >
            {t('common.apply')}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isStatusDialogOpen} onClose={handleCloseStatusDialog} fullWidth maxWidth="xs">
        <DialogTitle sx={{ pr: 6, position: 'relative' }}>
          {t('home.statusDialogTitle')}
          <IconButton
            onClick={handleCloseStatusDialog}
            size="small"
            sx={{ position: 'absolute', right: 12, top: 12, color: 'text.secondary' }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {STATUS_FILTER_OPTIONS.map((option) => {
              const isSelected = draftStatusFilter === option;
              const label = option === 'open'
                ? t('home.statusOpen')
                : t('home.statusClosed');
              return (
                <Chip
                  key={option}
                  label={label}
                  onClick={() => setDraftStatusFilter(isSelected ? null : option)}
                  color={isSelected ? (option === 'closed' ? 'error' : 'success') : undefined}
                  variant={isSelected ? 'filled' : 'outlined'}
                  sx={{
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
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 2 }}>
          <Button
            onClick={() => setDraftStatusFilter(null)}
            variant="contained"
            color="error"
            startIcon={<ClearIcon />}
            sx={{ textTransform: 'none', fontWeight: 'bold', borderRadius: 2, flex: 1 }}
          >
            {t('common.clear')}
          </Button>
          <Button
            onClick={handleApplyStatusDialog}
            variant="contained"
            color="primary"
            startIcon={<CheckIcon />}
            sx={{ textTransform: 'none', fontWeight: 'bold', borderRadius: 2, flex: 1 }}
          >
            {t('common.apply')}
          </Button>
        </DialogActions>
      </Dialog>

      <SortDialog
        open={isSortDialogOpen}
        onClose={handleCloseSortDialog}
        title={t('home.sortDialogTitle')}
        fields={SORT_FIELDS}
        field={sortField}
        direction={sortDirection}
        onFieldSelect={handleSortFieldSelect}
        onDirectionSelect={handleSortDirectionSelect}
      />

      {/* Main Grid Section */}
      <Box sx={{ minHeight: '400px' }}>
        {isFetching && items.length === 0 ? (
          <Grid container spacing={3}>
            {[...Array(size)].map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={`skeleton-${index}`}>
                <RestaurantCardSkeleton />
              </Grid>
            ))}
          </Grid>
        ) : items.length === 0 ? (
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
              {items.map((restaurant) => {
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
                      {/* Card Cover */}
                      {restaurant.images?.[0] ? (
                        <CardMedia
                          component="img"
                          height={120}
                          image={restaurant.images[0].url}
                          alt={restaurant.name}
                          sx={{ objectFit: 'cover', borderTopLeftRadius: 'inherit', borderTopRightRadius: 'inherit' }}
                        />
                      ) : (
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
                      )}

                      {/* Card Content */}
                      <CardContent sx={{ flexGrow: 1, p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1 }}>
                          <Typography variant="h5" component="h2" fontWeight="bold" gutterBottom>
                            {restaurant.name}
                          </Typography>
                          <Chip
                            label={restaurant.isOpen ? t('home.statusOpen') : t('home.statusClosed')}
                            color={restaurant.isOpen ? 'success' : 'error'}
                            size="small"
                            sx={{ fontWeight: 'bold', flexShrink: 0 }}
                          />
                        </Box>

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
                                const style = getCategoryStyle(getCategoryColorSeed(category));
                                return (
                                  <Chip
                                    key={category.id}
                                    label={getCategoryDisplayName(category, i18n.language)}
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
              {isFetching && (
                <>
                  {[...Array(size)].map((_, index) => (
                    <Grid item xs={12} sm={6} md={4} key={`skeleton-more-${index}`}>
                      <RestaurantCardSkeleton />
                    </Grid>
                  ))}
                </>
              )}
            </Grid>

            {/* Infinite scroll trigger */}
            <Box ref={sentinelRef} sx={{ height: 1 }} />
          </>
        )}
      </Box>
    </Container>
  );
};

export default HomePage;
