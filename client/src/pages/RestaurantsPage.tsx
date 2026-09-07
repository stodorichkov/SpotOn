import React, { useEffect, useState } from 'react';
import { useGetRestaurantsForManageQuery, useGetCategoriesQuery, RestaurantResponse } from '../features/restaurants/restaurantsSlice';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Skeleton,
  Typography,
  Container,
  Chip,
  Box,
  Button,
  Divider,
  IconButton,
  Tooltip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import ClearIcon from '@mui/icons-material/Clear';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CategoryIcon from '@mui/icons-material/Category';
import SortIcon from '@mui/icons-material/Sort';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import InfoIcon from '@mui/icons-material/Info';
import { getCategoryStyle } from '../utils/categoryColor';
import SortDialog, { SortDirection } from '../components/SortDialog';

type StatusFilter = 'all' | 'open' | 'closed' | 'inactive';
const STATUS_FILTER_OPTIONS: StatusFilter[] = ['all', 'open', 'closed', 'inactive'];

const getRestaurantStatusChip = (restaurant: RestaurantResponse): { labelKey: string; color: 'success' | 'error' | 'default' } => {
  if (!restaurant.isActive) {
    return { labelKey: 'restaurants.activeStatusInactive', color: 'default' };
  }
  return restaurant.isOpen
    ? { labelKey: 'restaurants.statusOpen', color: 'success' }
    : { labelKey: 'restaurants.statusClosed', color: 'error' };
};

const RestaurantsPage: React.FC = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const sort = `${sortField},${sortDirection}`;

  const SORT_FIELDS = [
    { value: 'id', label: t('common.id') },
    { value: 'name', label: t('common.name') },
  ];

  const [idInput, setIdInput] = useState('');
  const [id, setId] = useState<number | undefined>(undefined);
  const [nameInput, setNameInput] = useState('');
  const [addressInput, setAddressInput] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [categoryIds, setCategoryIds] = useState<number[]>([]);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [draftCategoryIds, setDraftCategoryIds] = useState<number[]>([]);
  const [isSortDialogOpen, setIsSortDialogOpen] = useState(false);

  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [draftStatusFilter, setDraftStatusFilter] = useState<StatusFilter>('all');

  const { data: availableCategories = [] } = useGetCategoriesQuery();

  useEffect(() => {
    const timeout = setTimeout(() => {
      const trimmed = idInput.trim();
      setId(trimmed === '' ? undefined : Number(trimmed));
      setPage(0);
    }, 400);
    return () => clearTimeout(timeout);
  }, [idInput]);

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

  const { isOpen, isActive } = (() => {
    switch (statusFilter) {
      case 'open':
        return { isOpen: true, isActive: true };
      case 'closed':
        return { isOpen: false, isActive: true };
      case 'inactive':
        return { isOpen: undefined, isActive: false };
      default:
        return { isOpen: undefined, isActive: undefined };
    }
  })();

  const { data, error, isFetching } = useGetRestaurantsForManageQuery({
    page,
    size: rowsPerPage,
    sort,
    id,
    name: name || undefined,
    address: address || undefined,
    categoryIds: categoryIds.length > 0 ? categoryIds : undefined,
    isOpen,
    isActive,
  });

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenSortDialog = () => {
    setIsSortDialogOpen(true);
  };

  const handleCloseSortDialog = () => {
    setIsSortDialogOpen(false);
  };

  const handleSortFieldSelect = (value: string) => {
    setSortField(value);
    setPage(0);
  };

  const handleSortDirectionSelect = (value: SortDirection) => {
    setSortDirection(value);
    setPage(0);
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
    return t('restaurants.categoriesCount', { count: categoryIds.length });
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
    setPage(0);
    setIsStatusDialogOpen(false);
  };

  const handleClearStatusDialog = () => {
    setDraftStatusFilter('all');
  };

  const statusFilterLabel = (() => {
    switch (statusFilter) {
      case 'open':
        return t('restaurants.statusOpen');
      case 'closed':
        return t('restaurants.statusClosed');
      case 'inactive':
        return t('restaurants.activeStatusInactive');
      default:
        return t('restaurants.statusColumn');
    }
  })();

  const hasActiveFilters = idInput !== '' || nameInput !== '' || addressInput !== '' || categoryIds.length > 0 || statusFilter !== 'all';

  const handleClearFilters = () => {
    setIdInput('');
    setNameInput('');
    setAddressInput('');
    setCategoryIds([]);
    setStatusFilter('all');
    setPage(0);
  };

  const rowHeight = 53;
  const emptyRows = data ? Math.max(0, rowsPerPage - data.content.length) : 0;

  return (
    <Container maxWidth="md" sx={{ mt: { xs: 2, sm: 4 }, mb: { xs: 2, sm: 4 }, px: { xs: 1, sm: 2 } }}>
      <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', sm: 'center' },
              gap: 2
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
                  width: { xs: 45, sm: 50 },
                  height: { xs: 45, sm: 50 },
                  flexShrink: 0
                }}
              >
                <RestaurantIcon sx={{ fontSize: { xs: 24, sm: 28 } }} />
              </Box>
              <Box>
                <Typography variant="h5" component="h1" fontWeight="bold" sx={{ fontSize: { xs: '1.3rem', sm: '1.6rem' } }}>
                  {t('restaurants.title')}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.85rem' } }}>
                  {t('restaurants.subtitle')}
                </Typography>
              </Box>
            </Box>
            <Button
              component={Link}
              to="/admin/restaurants/new"
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              sx={{
                textTransform: 'none',
                fontWeight: 'bold',
                borderRadius: 2,
                width: { xs: '100%', sm: 'auto' }
              }}
            >
              {t('restaurants.addRestaurant')}
            </Button>
          </Box>
        </Box>
        <Divider />
        <Box sx={{ p: { xs: 2, sm: 3 }, display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'flex-start' }}>
          <TextField
            label={t('restaurants.searchById')}
            size="small"
            type="number"
            value={idInput}
            onChange={(e) => setIdInput(e.target.value)}
            sx={{ minWidth: 100, flex: '0 1 100px' }}
          />
          <TextField
            label={t('restaurants.searchByName')}
            size="small"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            sx={{ minWidth: 180, flex: '1 1 180px' }}
          />
          <TextField
            label={t('restaurants.searchByAddress')}
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
            {categoryIds.length === 0 ? t('restaurants.categoriesButton') : categoryFieldValue}
          </Button>
          <Button
            variant={statusFilter !== 'all' ? 'contained' : 'outlined'}
            color={statusFilter !== 'all' ? 'primary' : 'inherit'}
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
            <Tooltip title={t('restaurants.clearFilters')} arrow>
              <IconButton onClick={handleClearFilters} size="small" sx={{ alignSelf: 'center' }}>
                <ClearIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
        <Dialog open={isCategoryDialogOpen} onClose={handleCloseCategoryDialog} fullWidth maxWidth="xs">
          <DialogTitle sx={{ pr: 6, position: 'relative' }}>
            {t('restaurants.categoryDialogTitle')}
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
              <Typography variant="body2" color="text.secondary">{t('restaurants.noCategoriesAvailable')}</Typography>
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
        <SortDialog
          open={isSortDialogOpen}
          onClose={handleCloseSortDialog}
          title={t('restaurants.sortDialogTitle')}
          fields={SORT_FIELDS}
          field={sortField}
          direction={sortDirection}
          onFieldSelect={handleSortFieldSelect}
          onDirectionSelect={handleSortDirectionSelect}
        />
        <Dialog open={isStatusDialogOpen} onClose={handleCloseStatusDialog} fullWidth maxWidth="xs">
          <DialogTitle sx={{ pr: 6, position: 'relative' }}>
            {t('restaurants.statusDialogTitle')}
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
                const label = option === 'all'
                  ? t('restaurants.statusFilterAll')
                  : option === 'open'
                    ? t('restaurants.statusOpen')
                    : option === 'closed'
                      ? t('restaurants.statusClosed')
                      : t('restaurants.activeStatusInactive');
                const color = option === 'closed' ? 'error' : option === 'open' ? 'success' : option === 'inactive' ? 'default' : 'primary';
                return (
                  <Chip
                    key={option}
                    label={label}
                    onClick={() => setDraftStatusFilter(option)}
                    color={isSelected ? color : undefined}
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
              onClick={handleClearStatusDialog}
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
        <Divider />
        {error ? (
          <Box sx={{ p: 6, textAlign: 'center' }}>
            <Typography color="error" variant="body1">
              {t('restaurants.errorLoading')}
            </Typography>
          </Box>
        ) : isFetching ? (
          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell>{t('restaurants.id')}</TableCell>
                  <TableCell>{t('restaurants.name')}</TableCell>
                  <TableCell>{t('restaurants.address')}</TableCell>
                  <TableCell>{t('restaurants.categories')}</TableCell>
                  <TableCell>{t('restaurants.statusColumn')}</TableCell>
                  <TableCell align="right">{t('restaurants.actions')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[...Array(rowsPerPage)].map((_, index) => (
                  <TableRow key={`skeleton-${index}`} style={{ height: rowHeight }}>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : !data || data.content.length === 0 ? (
          <Box sx={{ p: 6, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              {t('restaurants.noRestaurantsFound')}
            </Typography>
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="restaurants table">
                <TableHead sx={{ backgroundColor: 'action.hover' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', width: '7%' }}>{t('restaurants.id')}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', width: '17%' }}>{t('restaurants.name')}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', width: '17%' }}>{t('restaurants.address')}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', width: '19%' }}>{t('restaurants.categories')}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', width: '20%' }}>{t('restaurants.statusColumn')}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold', width: '20%' }}>{t('restaurants.actions')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.content.map((restaurant) => {
                    if (!restaurant) return null;
                    const statusChip = getRestaurantStatusChip(restaurant);
                    return (
                      <TableRow key={restaurant.id} sx={{ opacity: restaurant.isActive ? 1 : 0.6 }}>
                        <TableCell>{restaurant.id}</TableCell>
                        <TableCell>{restaurant.name}</TableCell>
                        <TableCell>{restaurant.address}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                            {restaurant.categories && restaurant.categories.length > 0 ? (
                              restaurant.categories.map((category) => (
                                <Chip
                                  key={category.id}
                                  label={category.name}
                                  size="small"
                                  sx={{ ...getCategoryStyle(category.name), fontWeight: 'bold' }}
                                />
                              ))
                            ) : (
                              <Typography variant="body2" color="text.secondary">{t('restaurants.noCategories')}</Typography>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={t(statusChip.labelKey)}
                            color={statusChip.color}
                            size="small"
                            sx={{ fontWeight: 'bold' }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title={t('restaurants.detailsTooltip')} arrow>
                            <IconButton
                              component={Link}
                              to={`/admin/restaurants/${restaurant.id}`}
                              color="primary"
                              size="small"
                            >
                              <InfoIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 &&
                    [...Array(emptyRows)].map((_, index) => (
                      <TableRow key={`empty-${index}`} style={{ height: rowHeight }}>
                        <TableCell component="th" scope="row">&nbsp;</TableCell>
                        <TableCell>&nbsp;</TableCell>
                        <TableCell>&nbsp;</TableCell>
                        <TableCell>&nbsp;</TableCell>
                        <TableCell>&nbsp;</TableCell>
                        <TableCell align="right">
                          <IconButton size="small" sx={{ visibility: 'hidden' }} aria-hidden="true">
                            <InfoIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10]}
              component="div"
              count={data?.totalElements || 0}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </Paper>
    </Container>
  );
};

export default RestaurantsPage;
