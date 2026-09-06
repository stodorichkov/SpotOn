import React, { useEffect, useState } from 'react';
import { useGetManagerTablesQuery, useDeleteTableMutation } from '../features/restaurants/restaurantsSlice';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Trans, useTranslation } from 'react-i18next';
import { addAlert } from '../features/alerts/alertsSlice';
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
  Divider,
  Button,
  IconButton,
  Tooltip,
  TextField,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import TableBarIcon from '@mui/icons-material/TableBar';
import AddIcon from '@mui/icons-material/Add';
import InfoIcon from '@mui/icons-material/Info';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SmokingRoomsIcon from '@mui/icons-material/SmokingRooms';
import SmokeFreeIcon from '@mui/icons-material/SmokeFree';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ClearIcon from '@mui/icons-material/Clear';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import SortIcon from '@mui/icons-material/Sort';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SortDialog, { SortDirection } from '../components/SortDialog';
import NumberRangeDialog from '../components/NumberRangeDialog';

type SmokingFilter = 'all' | 'smoking' | 'nonSmoking';

const SMOKING_FILTER_OPTIONS: SmokingFilter[] = ['all', 'smoking', 'nonSmoking'];

const ManagerTablesPage: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [activeTable, setActiveTable] = useState<any>(null);

  const [deleteTable, { isLoading: isDeleting }] = useDeleteTableMutation();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tableToDelete, setTableToDelete] = useState<{ id: number; name: string } | null>(null);

  const [nameInput, setNameInput] = useState('');
  const [name, setName] = useState('');

  const [smokingFilter, setSmokingFilter] = useState<SmokingFilter>('all');
  const [isSmokingDialogOpen, setIsSmokingDialogOpen] = useState(false);
  const [draftSmokingFilter, setDraftSmokingFilter] = useState<SmokingFilter>('all');

  const [minCapacity, setMinCapacity] = useState<number | null>(null);
  const [maxCapacity, setMaxCapacity] = useState<number | null>(null);
  const [isCapacityDialogOpen, setIsCapacityDialogOpen] = useState(false);

  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const sort = `${sortField},${sortDirection}`;
  const [isSortDialogOpen, setIsSortDialogOpen] = useState(false);

  const SORT_FIELDS = [
    { value: 'id', label: t('common.id') },
    { value: 'name', label: t('common.name') },
    { value: 'capacity', label: t('managerTables.capacity') },
  ];

  useEffect(() => {
    const timeout = setTimeout(() => {
      setName(nameInput.trim());
      setPage(0);
    }, 400);
    return () => clearTimeout(timeout);
  }, [nameInput]);

  const isSmokingAllowed = smokingFilter === 'all' ? undefined : smokingFilter === 'smoking';

  const handleSortFieldSelect = (value: string) => {
    setSortField(value);
    setPage(0);
  };

  const handleSortDirectionSelect = (value: SortDirection) => {
    setSortDirection(value);
    setPage(0);
  };

  const handleOpenSmokingDialog = () => {
    setDraftSmokingFilter(smokingFilter);
    setIsSmokingDialogOpen(true);
  };

  const handleApplySmokingDialog = () => {
    setSmokingFilter(draftSmokingFilter);
    setPage(0);
    setIsSmokingDialogOpen(false);
  };

  const smokingFilterLabel = (() => {
    switch (smokingFilter) {
      case 'smoking':
        return t('managerTables.smokingAllowed');
      case 'nonSmoking':
        return t('managerTables.nonSmoking');
      default:
        return t('managerTables.smokingFilterAll');
    }
  })();

  const handleApplyCapacityRange = (from: number | null, to: number | null) => {
    setMinCapacity(from);
    setMaxCapacity(to);
    setPage(0);
  };

  const capacityFieldValue = (() => {
    if (minCapacity === null && maxCapacity === null) {
      return '';
    }
    if (minCapacity !== null && maxCapacity !== null) {
      return `${minCapacity} - ${maxCapacity}`;
    }
    return minCapacity !== null ? `${t('common.fromCapacity')}: ${minCapacity}` : `${t('common.toCapacity')}: ${maxCapacity}`;
  })();

  const hasActiveFilters = nameInput !== '' || smokingFilter !== 'all' || minCapacity !== null || maxCapacity !== null;

  const handleClearFilters = () => {
    setNameInput('');
    setSmokingFilter('all');
    setMinCapacity(null);
    setMaxCapacity(null);
    setPage(0);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, table: any) => {
    setAnchorEl(event.currentTarget);
    setActiveTable(table);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setActiveTable(null);
  };

  const handleDeleteClick = (tableId: number, name: string) => {
    setTableToDelete({ id: tableId, name });
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!tableToDelete) return;
    try {
      await deleteTable(tableToDelete.id).unwrap();
      dispatch(addAlert({ message: t('managerTables.success'), type: 'success' }));
    } catch (err: any) {
      console.error('Failed to remove table:', err);
      dispatch(addAlert({
        message: err?.data?.message || t('managerTables.failure'),
        type: 'error'
      }));
    } finally {
      setDeleteDialogOpen(false);
      setTableToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setTableToDelete(null);
  };

  const { data, error, isLoading } = useGetManagerTablesQuery({
    page,
    size: rowsPerPage,
    sort,
    name: name || undefined,
    isSmokingAllowed,
    minCapacity: minCapacity ?? undefined,
    maxCapacity: maxCapacity ?? undefined,
  });

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const rowHeight = 53;
  const emptyRows = data ? Math.max(0, rowsPerPage - data.content.length) : 0;

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: { xs: 2, sm: 4 }, mb: { xs: 2, sm: 4 }, px: { xs: 1, sm: 2 } }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
          <Typography color="error" variant="h5" fontWeight="bold" gutterBottom>
            {t('common.error')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t('managerTables.errorLoading')}
          </Typography>
        </Paper>
      </Container>
    );
  }

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
                <TableBarIcon sx={{ fontSize: { xs: 24, sm: 28 } }} />
              </Box>
              <Box>
                <Typography variant="h5" component="h1" fontWeight="bold" sx={{ fontSize: { xs: '1.3rem', sm: '1.6rem' } }}>
                  {t('managerTables.title')}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.85rem' } }}>
                  {t('managerTables.subtitle')}
                </Typography>
              </Box>
            </Box>
            <Button
              component={Link}
              to="/manager/tables/new"
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
              {t('managerTables.addTable')}
            </Button>
          </Box>
        </Box>
        <Divider />
        <Box sx={{ p: { xs: 2, sm: 3 }, display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'flex-start' }}>
          <TextField
            label={t('managerTables.searchByName')}
            size="small"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            sx={{ minWidth: 180, flex: '1 1 180px' }}
          />
          <Button
            variant={smokingFilter !== 'all' ? 'contained' : 'outlined'}
            color={smokingFilter !== 'all' ? 'primary' : 'inherit'}
            onClick={handleOpenSmokingDialog}
            startIcon={smokingFilter === 'nonSmoking' ? <SmokeFreeIcon /> : <SmokingRoomsIcon />}
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
            {smokingFilterLabel}
          </Button>
          <Button
            variant={minCapacity !== null || maxCapacity !== null ? 'contained' : 'outlined'}
            color={minCapacity !== null || maxCapacity !== null ? 'primary' : 'inherit'}
            onClick={() => setIsCapacityDialogOpen(true)}
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
            {capacityFieldValue === '' ? t('managerTables.capacityButton') : capacityFieldValue}
          </Button>
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => setIsSortDialogOpen(true)}
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
            <Tooltip title={t('managerTables.clearFilters')} arrow>
              <IconButton onClick={handleClearFilters} size="small" sx={{ alignSelf: 'center' }}>
                <ClearIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
        <Dialog open={isSmokingDialogOpen} onClose={() => setIsSmokingDialogOpen(false)} fullWidth maxWidth="xs">
          <DialogTitle sx={{ pr: 6, position: 'relative' }}>
            {t('managerTables.smokingDialogTitle')}
            <IconButton
              onClick={() => setIsSmokingDialogOpen(false)}
              size="small"
              sx={{ position: 'absolute', right: 12, top: 12, color: 'text.secondary' }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {SMOKING_FILTER_OPTIONS.map((option) => {
                const isSelected = draftSmokingFilter === option;
                const label = option === 'all'
                  ? t('managerTables.smokingFilterAll')
                  : option === 'smoking'
                    ? t('managerTables.smokingAllowed')
                    : t('managerTables.nonSmoking');
                return (
                  <Chip
                    key={option}
                    label={label}
                    onClick={() => setDraftSmokingFilter(option)}
                    color={isSelected ? 'primary' : undefined}
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
              onClick={() => setDraftSmokingFilter('all')}
              variant="contained"
              color="error"
              startIcon={<ClearIcon />}
              sx={{ textTransform: 'none', fontWeight: 'bold', borderRadius: 2, flex: 1 }}
            >
              {t('common.clear')}
            </Button>
            <Button
              onClick={handleApplySmokingDialog}
              variant="contained"
              color="primary"
              startIcon={<CheckIcon />}
              sx={{ textTransform: 'none', fontWeight: 'bold', borderRadius: 2, flex: 1 }}
            >
              {t('common.apply')}
            </Button>
          </DialogActions>
        </Dialog>
        <NumberRangeDialog
          open={isCapacityDialogOpen}
          onClose={() => setIsCapacityDialogOpen(false)}
          title={t('managerTables.capacityDialogTitle')}
          fromLabel={t('common.fromCapacity')}
          toLabel={t('common.toCapacity')}
          fromValue={minCapacity}
          toValue={maxCapacity}
          onApply={handleApplyCapacityRange}
          min={1}
        />
        <SortDialog
          open={isSortDialogOpen}
          onClose={() => setIsSortDialogOpen(false)}
          title={t('managerTables.sortBy')}
          fields={SORT_FIELDS}
          field={sortField}
          direction={sortDirection}
          onFieldSelect={handleSortFieldSelect}
          onDirectionSelect={handleSortDirectionSelect}
        />
        <Divider />

        {isLoading ? (
          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead sx={{ backgroundColor: 'action.hover' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', width: '10%' }}>{t('managerTables.id')}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', width: '30%' }}>{t('managerTables.name')}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', width: '20%' }}>{t('managerTables.capacity')}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', width: '25%' }}>{t('managerTables.smokingAllowedColumn')}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold', width: '15%' }}>{t('managerTables.actions')}</TableCell>
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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : !data || data.content.length === 0 ? (
          <Box sx={{ p: 6, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              {t('managerTables.noTables')}
            </Typography>
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="tables table">
                <TableHead sx={{ backgroundColor: 'action.hover' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', width: '10%' }}>{t('managerTables.id')}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', width: '30%' }}>{t('managerTables.name')}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', width: '20%' }}>{t('managerTables.capacity')}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', width: '25%' }}>{t('managerTables.smokingAllowedColumn')}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold', width: '15%' }}>{t('managerTables.actions')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.content.map((table) => {
                    if (!table) return null;
                    return (
                      <TableRow key={table.id} style={{ height: rowHeight }}>
                        <TableCell>{table.id}</TableCell>
                        <TableCell>{table.name || ''}</TableCell>
                        <TableCell>{table.capacity}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {table.isSmokingAllowed ? (
                              <SmokingRoomsIcon color="success" fontSize="small" />
                            ) : (
                              <SmokeFreeIcon color="action" fontSize="small" />
                            )}
                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                              {table.isSmokingAllowed ? t('managerTables.smokingAllowed') : t('managerTables.nonSmoking')}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            color="primary"
                            size="small"
                            onClick={(e) => handleMenuOpen(e, table)}
                            aria-label="actions"
                          >
                            <MoreVertIcon />
                          </IconButton>
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
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            sx={{ visibility: 'hidden' }}
                            aria-hidden="true"
                          >
                            <MoreVertIcon />
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

      {/* Responsive Collapsible Actions Menu (only for small/mobile screens) */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: 150,
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
          }
        }}
      >
        {activeTable && [
          <MenuItem
            key="details"
            component={Link}
            to={`/manager/tables/${activeTable.id}`}
            state={{ table: activeTable }}
            onClick={handleMenuClose}
          >
            <ListItemIcon>
              <InfoIcon color="primary" fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={t('managerTables.menuDetails')} />
          </MenuItem>,
          <MenuItem
            key="edit"
            component={Link}
            to={`/manager/tables/${activeTable.id}`}
            state={{ table: activeTable, edit: true }}
            onClick={handleMenuClose}
          >
            <ListItemIcon>
              <EditIcon color="primary" fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={t('managerTables.menuEdit')} />
          </MenuItem>,
          <MenuItem
            key="delete"
            onClick={() => {
              handleMenuClose();
              handleDeleteClick(activeTable.id, activeTable.name);
            }}
            sx={{ color: 'error.main' }}
          >
            <ListItemIcon>
              <DeleteIcon color="error" fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={t('managerTables.menuRemove')} />
          </MenuItem>
        ]}
      </Menu>

      {/* Custom Material UI Confirmation Dialog for Deleting Table */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
        PaperProps={{
          sx: {
            borderRadius: 3,
            px: 1,
            py: 0.5
          }
        }}
      >
        <DialogTitle id="delete-dialog-title" fontWeight="bold">
          {t('managerTables.deleteTitle')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            <Trans
              i18nKey="managerTables.deleteBody"
              values={{ name: tableToDelete?.name }}
              components={{ bold: <strong /> }}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleDeleteCancel}
            color="inherit"
            sx={{ textTransform: 'none', fontWeight: 'bold' }}
            disabled={isDeleting}
          >
            {t('common.cancel')}
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            sx={{ textTransform: 'none', fontWeight: 'bold', borderRadius: 2 }}
            disabled={isDeleting}
            autoFocus
          >
            {t('common.remove')}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ManagerTablesPage;
