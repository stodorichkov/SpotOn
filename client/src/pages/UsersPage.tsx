import React, { useEffect, useState } from 'react';
import { useGetUsersQuery } from '../features/users/usersSlice';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Typography,
  Container,
  Button,
  Skeleton,
  Chip,
  Box,
  Divider,
  IconButton,
  Tooltip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import InfoIcon from '@mui/icons-material/Info';
import PeopleIcon from '@mui/icons-material/People';
import ClearIcon from '@mui/icons-material/Clear';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import BadgeIcon from '@mui/icons-material/Badge';
import SortIcon from '@mui/icons-material/Sort';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { Role } from '../constants';
import SortDialog, { SortDirection } from '../components/SortDialog';
import { translateRole } from '../utils/enumLabels';

const ROLE_OPTIONS = [Role.ADMIN, Role.MANAGER, Role.EMPLOYEE, Role.CLIENT];

type ActiveFilter = 'active' | 'inactive';
const ACTIVE_FILTER_OPTIONS: ActiveFilter[] = ['active', 'inactive'];

const getRoleChipColor = (role: string) => {
  switch (role?.toUpperCase()) {
    case Role.ADMIN:
      return 'error';
    case Role.CLIENT:
      return 'success';
    case Role.EMPLOYEE:
    case 'STAFF':
      return 'info';
    case 'OWNER':
    case Role.MANAGER:
      return 'warning';
    default:
      return 'default';
  }
};

const UsersPage: React.FC = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const sort = `${sortField},${sortDirection}`;

  const SORT_FIELDS = [
    { value: 'id', label: t('common.id') },
    { value: 'email', label: t('common.email') },
    { value: 'role.name', label: t('common.role') },
  ];

  const [idInput, setIdInput] = useState('');
  const [id, setId] = useState<number | undefined>(undefined);
  const [emailInput, setEmailInput] = useState('');
  const [email, setEmail] = useState('');
  const [roles, setRoles] = useState<string[]>([]);
  const [isRolesDialogOpen, setIsRolesDialogOpen] = useState(false);
  const [draftRoles, setDraftRoles] = useState<string[]>([]);
  const [isSortDialogOpen, setIsSortDialogOpen] = useState(false);

  const [activeFilter, setActiveFilter] = useState<ActiveFilter | null>(null);
  const [isActiveDialogOpen, setIsActiveDialogOpen] = useState(false);
  const [draftActiveFilter, setDraftActiveFilter] = useState<ActiveFilter | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const trimmed = idInput.trim();
      setId(trimmed === '' ? undefined : Number(trimmed));
      setEmail(emailInput.trim());
      setPage(0);
    }, 400);
    return () => clearTimeout(timeout);
  }, [idInput, emailInput]);

  const isActive = activeFilter === null ? undefined : activeFilter === 'active';

  const { data, error, isFetching } = useGetUsersQuery({
    page,
    size: rowsPerPage,
    sort,
    id,
    email: email || undefined,
    roles: roles.length > 0 ? roles : undefined,
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

  const handleOpenRolesDialog = () => {
    setDraftRoles(roles);
    setIsRolesDialogOpen(true);
  };

  const handleCloseRolesDialog = () => {
    setIsRolesDialogOpen(false);
  };

  const handleToggleDraftRole = (role: string) => {
    setDraftRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const handleApplyRolesDialog = () => {
    setRoles(draftRoles);
    setPage(0);
    setIsRolesDialogOpen(false);
  };

  const rolesFieldValue = (() => {
    if (roles.length === 0) {
      return '';
    }
    if (roles.length === 1) {
      return translateRole(t, roles[0]);
    }
    return t('users.rolesCount', { count: roles.length });
  })();

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
        return t('users.activeStatusActive');
      case 'inactive':
        return t('users.activeStatusInactive');
      default:
        return t('users.activeStatusColumn');
    }
  })();

  const hasActiveFilters = idInput !== '' || emailInput !== '' || roles.length > 0 || activeFilter !== null;

  const handleClearFilters = () => {
    setIdInput('');
    setEmailInput('');
    setRoles([]);
    setActiveFilter(null);
    setPage(0);
  };

  const rowHeight = 53;
  const emptyRows = data ? Math.max(0, rowsPerPage - data.content.length) : 0;

  return (
    <Container maxWidth="md" sx={{ mt: { xs: 2, sm: 4 }, mb: { xs: 2, sm: 4 }, px: { xs: 1, sm: 2 } }}>
      <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
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
              <PeopleIcon sx={{ fontSize: { xs: 24, sm: 28 } }} />
            </Box>
            <Box>
              <Typography variant="h5" component="h1" fontWeight="bold" sx={{ fontSize: { xs: '1.3rem', sm: '1.6rem' } }}>
                {t('users.title')}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.85rem' } }}>
                {t('users.subtitle')}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Divider />
        <Box sx={{ p: { xs: 2, sm: 3 }, display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'flex-start' }}>
          <TextField
            label={t('users.searchById')}
            size="small"
            type="number"
            value={idInput}
            onChange={(e) => setIdInput(e.target.value)}
            sx={{ minWidth: 100, flex: '0 1 100px' }}
          />
          <TextField
            label={t('users.searchByEmail')}
            size="small"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            sx={{ minWidth: 180, flex: '1 1 180px' }}
          />
          <Button
            variant={roles.length > 0 ? 'contained' : 'outlined'}
            color={roles.length > 0 ? 'primary' : 'inherit'}
            onClick={handleOpenRolesDialog}
            startIcon={<BadgeIcon />}
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
            {roles.length === 0 ? t('users.rolesButton') : rolesFieldValue}
          </Button>
          <Button
            variant={activeFilter !== null ? 'contained' : 'outlined'}
            color={activeFilter !== null ? 'primary' : 'inherit'}
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
            <Tooltip title={t('users.clearFilters')} arrow>
              <IconButton onClick={handleClearFilters} size="small" sx={{ alignSelf: 'center' }}>
                <ClearIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
        <Dialog open={isRolesDialogOpen} onClose={handleCloseRolesDialog} fullWidth maxWidth="xs">
          <DialogTitle sx={{ pr: 6, position: 'relative' }}>
            {t('users.rolesDialogTitle')}
            <IconButton
              onClick={handleCloseRolesDialog}
              size="small"
              sx={{ position: 'absolute', right: 12, top: 12, color: 'text.secondary' }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {ROLE_OPTIONS.map((role) => {
                const isSelected = draftRoles.includes(role);
                return (
                  <Chip
                    key={role}
                    label={translateRole(t, role)}
                    onClick={() => handleToggleDraftRole(role)}
                    color={isSelected ? getRoleChipColor(role) : undefined}
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
              onClick={() => setDraftRoles([])}
              variant="contained"
              color="error"
              startIcon={<ClearIcon />}
              sx={{ textTransform: 'none', fontWeight: 'bold', borderRadius: 2, flex: 1 }}
            >
              {t('common.clear')}
            </Button>
            <Button
              onClick={handleApplyRolesDialog}
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
          title={t('users.sortBy')}
          fields={SORT_FIELDS}
          field={sortField}
          direction={sortDirection}
          onFieldSelect={handleSortFieldSelect}
          onDirectionSelect={handleSortDirectionSelect}
        />
        <Dialog open={isActiveDialogOpen} onClose={handleCloseActiveDialog} fullWidth maxWidth="xs">
          <DialogTitle sx={{ pr: 6, position: 'relative' }}>
            {t('users.activeStatusDialogTitle')}
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
                const label = option === 'active'
                  ? t('users.activeStatusActive')
                  : t('users.activeStatusInactive');
                return (
                  <Chip
                    key={option}
                    label={label}
                    onClick={() => setDraftActiveFilter(isSelected ? null : option)}
                    color={isSelected ? (option === 'inactive' ? 'error' : 'success') : undefined}
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
              onClick={() => setDraftActiveFilter(null)}
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
              {t('users.errorLoading')}
            </Typography>
          </Box>
        ) : isFetching ? (
          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell>{t('users.id')}</TableCell>
                  <TableCell>{t('users.email')}</TableCell>
                  <TableCell>{t('users.role')}</TableCell>
                  <TableCell>{t('users.activeStatusColumn')}</TableCell>
                  <TableCell align="right">{t('users.actions')}</TableCell>
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
              {t('users.noUsers')}
            </Typography>
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead sx={{ backgroundColor: 'action.hover' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', width: '8%' }}>{t('users.id')}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', width: '37%' }}>{t('users.email')}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', width: '20%' }}>{t('users.role')}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', width: '20%' }}>{t('users.activeStatusColumn')}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold', width: '15%' }}>{t('users.actions')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.content.map((user) => (
                    <TableRow key={user.id} sx={{ opacity: user.isActive ? 1 : 0.6 }}>
                      <TableCell>{user.id}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        {user.role ? (
                          <Chip
                            label={translateRole(t, user.role)}
                            size="small"
                            color={getRoleChipColor(user.role)}
                            variant="outlined"
                          />
                        ) : '-'}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.isActive ? t('users.activeStatusActive') : t('users.activeStatusInactive')}
                          color={user.isActive ? 'success' : 'default'}
                          size="small"
                          sx={{ fontWeight: 'bold' }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title={t('users.userDetailsTooltip')} arrow>
                          <IconButton
                            component={Link}
                            to={`/admin/users/${user.id}`}
                            state={{ user }}
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
                        {/* Use non-breaking space to ensure cell has height */}
                        <TableCell component="th" scope="row">&nbsp;</TableCell>
                        <TableCell>&nbsp;</TableCell>
                        <TableCell>&nbsp;</TableCell>
                        <TableCell>&nbsp;</TableCell>
                        <TableCell align="right">
                          {/* Render an identical but invisible button to enforce row height */}
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

export default UsersPage;
