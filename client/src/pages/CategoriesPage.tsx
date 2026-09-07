import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import {
  useGetCategoriesPageQuery,
  useCreateCategoryMutation
} from '../features/restaurants/restaurantsSlice';
import { addAlert } from '../features/alerts/alertsSlice';
import { getCategoryStyle } from '../utils/categoryColor';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Container,
  Chip,
  Box,
  Divider,
  Button,
  IconButton,
  Tooltip,
  TextField,
  Skeleton,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress
} from '@mui/material';
import CategoryIcon from '@mui/icons-material/Category';
import AddIcon from '@mui/icons-material/Add';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import ClearIcon from '@mui/icons-material/Clear';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import SortIcon from '@mui/icons-material/Sort';
import CheckIcon from '@mui/icons-material/Check';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SortDialog, { SortDirection } from '../components/SortDialog';

type ActiveFilter = 'all' | 'active' | 'inactive';
const ACTIVE_FILTER_OPTIONS: ActiveFilter[] = ['all', 'active', 'inactive'];

const CategoriesPage: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const sort = `${sortField},${sortDirection}`;
  const [isSortDialogOpen, setIsSortDialogOpen] = useState(false);

  const SORT_FIELDS = [
    { value: 'id', label: t('common.id') },
    { value: 'name', label: t('common.name') },
  ];

  const [idFilterInput, setIdFilterInput] = useState('');
  const [idFilter, setIdFilter] = useState<number | undefined>(undefined);
  const [nameFilterInput, setNameFilterInput] = useState('');
  const [nameFilter, setNameFilter] = useState('');

  const [activeFilter, setActiveFilter] = useState<ActiveFilter>('all');
  const [isActiveDialogOpen, setIsActiveDialogOpen] = useState(false);
  const [draftActiveFilter, setDraftActiveFilter] = useState<ActiveFilter>('all');

  useEffect(() => {
    const timeout = setTimeout(() => {
      const trimmed = idFilterInput.trim();
      setIdFilter(trimmed === '' ? undefined : Number(trimmed));
      setNameFilter(nameFilterInput.trim());
      setPage(0);
    }, 400);
    return () => clearTimeout(timeout);
  }, [idFilterInput, nameFilterInput]);

  const isActive = activeFilter === 'all' ? undefined : activeFilter === 'active';

  const { data, error, isFetching } = useGetCategoriesPageQuery({
    page,
    size: rowsPerPage,
    sort,
    id: idFilter,
    name: nameFilter || undefined,
    isActive
  });
  const [createCategory, { isLoading: isSaving }] = useCreateCategoryMutation();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [nameError, setNameError] = useState('');

  const hasActiveFilters = idFilterInput !== '' || nameFilterInput !== '' || activeFilter !== 'all';

  const handleClearFilters = () => {
    setIdFilterInput('');
    setNameFilterInput('');
    setActiveFilter('all');
    setPage(0);
  };

  const handleOpenActiveDialog = () => {
    setDraftActiveFilter(activeFilter);
    setIsActiveDialogOpen(true);
  };

  const handleCloseActiveDialog = () => {
    setIsActiveDialogOpen(false);
  };

  const handleApplyActiveDialog = () => {
    setActiveFilter(draftActiveFilter);
    setPage(0);
    setIsActiveDialogOpen(false);
  };

  const activeFilterLabel = (() => {
    switch (activeFilter) {
      case 'active':
        return t('categories.activeStatusActive');
      case 'inactive':
        return t('categories.activeStatusInactive');
      default:
        return t('categories.activeStatusColumn');
    }
  })();

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

  const handleOpenAddForm = () => {
    setNameInput('');
    setNameError('');
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nameInput.trim()) {
      setNameError(t('validation.blankField'));
      return;
    }

    try {
      await createCategory({ name: nameInput.trim() }).unwrap();
      dispatch(addAlert({ message: t('categories.createSuccess'), type: 'success' }));
      setIsFormOpen(false);
    } catch (err: any) {
      console.error('Failed to save category:', err);
      dispatch(addAlert({
        message: err?.data?.message || t('categories.saveFailure'),
        type: 'error'
      }));
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
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
                <CategoryIcon sx={{ fontSize: { xs: 24, sm: 28 } }} />
              </Box>
              <Box>
                <Typography variant="h5" component="h1" fontWeight="bold" sx={{ fontSize: { xs: '1.3rem', sm: '1.6rem' } }}>
                  {t('categories.title')}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.85rem' } }}>
                  {t('categories.subtitle')}
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleOpenAddForm}
              sx={{
                textTransform: 'none',
                fontWeight: 'bold',
                borderRadius: 2,
                width: { xs: '100%', sm: 'auto' }
              }}
            >
              {t('categories.addCategory')}
            </Button>
          </Box>
        </Box>
        <Divider />
        <Box sx={{ p: { xs: 2, sm: 3 }, display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'flex-start' }}>
          <TextField
            label={t('categories.searchById')}
            size="small"
            type="number"
            value={idFilterInput}
            onChange={(e) => setIdFilterInput(e.target.value)}
            sx={{ minWidth: 100, flex: '0 1 100px' }}
          />
          <TextField
            label={t('categories.searchByName')}
            size="small"
            value={nameFilterInput}
            onChange={(e) => setNameFilterInput(e.target.value)}
            sx={{ minWidth: 180, flex: '1 1 180px' }}
          />
          <Button
            variant={activeFilter !== 'all' ? 'contained' : 'outlined'}
            color={activeFilter !== 'all' ? 'primary' : 'inherit'}
            onClick={handleOpenActiveDialog}
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
            {activeFilterLabel}
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
            <Tooltip title={t('categories.clearFilters')} arrow>
              <IconButton onClick={handleClearFilters} size="small" sx={{ alignSelf: 'center' }}>
                <ClearIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
        <SortDialog
          open={isSortDialogOpen}
          onClose={handleCloseSortDialog}
          title={t('categories.sortBy')}
          fields={SORT_FIELDS}
          field={sortField}
          direction={sortDirection}
          onFieldSelect={handleSortFieldSelect}
          onDirectionSelect={handleSortDirectionSelect}
        />
        <Dialog open={isActiveDialogOpen} onClose={handleCloseActiveDialog} fullWidth maxWidth="xs">
          <DialogTitle sx={{ pr: 6, position: 'relative' }}>
            {t('categories.activeStatusDialogTitle')}
            <IconButton
              onClick={handleCloseActiveDialog}
              size="small"
              sx={{ position: 'absolute', right: 12, top: 12, color: 'text.secondary' }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {ACTIVE_FILTER_OPTIONS.map((option) => {
                const isSelected = draftActiveFilter === option;
                const label = option === 'all'
                  ? t('categories.activeStatusFilterAll')
                  : option === 'active'
                    ? t('categories.activeStatusActive')
                    : t('categories.activeStatusInactive');
                return (
                  <Chip
                    key={option}
                    label={label}
                    onClick={() => setDraftActiveFilter(option)}
                    color={isSelected ? (option === 'inactive' ? 'error' : option === 'active' ? 'success' : 'primary') : undefined}
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
              onClick={() => setDraftActiveFilter('all')}
              variant="contained"
              color="error"
              startIcon={<ClearIcon />}
              sx={{ textTransform: 'none', fontWeight: 'bold', borderRadius: 2, flex: 1 }}
            >
              {t('common.clear')}
            </Button>
            <Button
              onClick={handleApplyActiveDialog}
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
              {t('categories.errorLoading')}
            </Typography>
          </Box>
        ) : isFetching ? (
          <TableContainer>
            <Table sx={{ minWidth: 500 }}>
              <TableHead sx={{ backgroundColor: 'action.hover' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', width: '12%' }}>{t('categories.id')}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', width: '38%' }}>{t('categories.name')}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', width: '25%' }}>{t('categories.activeStatusColumn')}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold', width: '25%' }}>{t('categories.actions')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[...Array(rowsPerPage)].map((_, index) => (
                  <TableRow key={`skeleton-${index}`} style={{ height: rowHeight }}>
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
              {t('categories.noCategories')}
            </Typography>
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table sx={{ minWidth: 500 }} aria-label="categories table">
                <TableHead sx={{ backgroundColor: 'action.hover' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', width: '12%' }}>{t('categories.id')}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', width: '38%' }}>{t('categories.name')}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', width: '25%' }}>{t('categories.activeStatusColumn')}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold', width: '25%' }}>{t('categories.actions')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.content.map((category) => (
                    <TableRow key={category.id} style={{ height: rowHeight, opacity: category.isActive ? 1 : 0.6 }}>
                      <TableCell>{category.id}</TableCell>
                      <TableCell>
                        <Chip
                          label={category.name}
                          size="small"
                          sx={{ ...getCategoryStyle(category.name), fontWeight: 'bold' }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={category.isActive ? t('categories.activeStatusActive') : t('categories.activeStatusInactive')}
                          color={category.isActive ? 'success' : 'default'}
                          size="small"
                          sx={{ fontWeight: 'bold' }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title={t('categories.detailsTooltip')} arrow>
                          <IconButton
                            component={Link}
                            to={`/admin/categories/${category.id}`}
                            color="primary"
                            size="small"
                          >
                            <InfoIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                  {emptyRows > 0 &&
                    [...Array(emptyRows)].map((_, index) => (
                      <TableRow key={`empty-${index}`} style={{ height: rowHeight }}>
                        <TableCell component="th" scope="row">&nbsp;</TableCell>
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
              count={data.totalElements}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </Paper>

      {/* Add Category Dialog */}
      <Dialog open={isFormOpen} onClose={handleCloseForm} fullWidth maxWidth="xs">
        <DialogTitle sx={{ pr: 6, position: 'relative' }}>
          {t('categories.addDialogTitle')}
          <IconButton
            onClick={handleCloseForm}
            size="small"
            sx={{ position: 'absolute', right: 12, top: 12, color: 'text.secondary' }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <Box component="form" onSubmit={handleSubmitForm} noValidate>
          <DialogContent dividers>
            <TextField
              autoFocus
              required
              fullWidth
              label={t('categories.nameLabel')}
              value={nameInput}
              onChange={(e) => {
                setNameInput(e.target.value);
                if (nameError) setNameError('');
              }}
              error={!!nameError}
              helperText={nameError}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2.5,
                }
              }}
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2, gap: 2 }}>
            <Button
              onClick={handleCloseForm}
              variant="outlined"
              color="inherit"
              disabled={isSaving}
              sx={{ textTransform: 'none', fontWeight: 'bold', borderRadius: 2, flex: 1 }}
            >
              {t('categories.cancel')}
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSaving}
              startIcon={isSaving ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
              sx={{ textTransform: 'none', fontWeight: 'bold', borderRadius: 2, flex: 1 }}
            >
              {t('categories.save')}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Container>
  );
};

export default CategoriesPage;
