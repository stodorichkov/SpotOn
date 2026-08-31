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
  DialogActions,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText
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
import { Role } from '../constants';

const ROLE_OPTIONS = [Role.ADMIN, Role.MANAGER, Role.EMPLOYEE, Role.CLIENT];

const SORT_VALUES = ['id,asc', 'id,desc', 'username,asc', 'username,desc', 'role.name,asc', 'role.name,desc'] as const;

const SORT_LABEL_KEYS: Record<(typeof SORT_VALUES)[number], string> = {
  'id,asc': 'users.sortIdAsc',
  'id,desc': 'users.sortIdDesc',
  'username,asc': 'users.sortUsernameAsc',
  'username,desc': 'users.sortUsernameDesc',
  'role.name,asc': 'users.sortRoleAsc',
  'role.name,desc': 'users.sortRoleDesc',
};

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
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sort, setSort] = useState('id,asc');

  const [usernameInput, setUsernameInput] = useState('');
  const [username, setUsername] = useState('');
  const [roles, setRoles] = useState<string[]>([]);
  const [isRolesDialogOpen, setIsRolesDialogOpen] = useState(false);
  const [draftRoles, setDraftRoles] = useState<string[]>([]);
  const [isSortDialogOpen, setIsSortDialogOpen] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setUsername(usernameInput.trim());
      setPage(0);
    }, 400);
    return () => clearTimeout(timeout);
  }, [usernameInput]);

  const { data, error, isFetching } = useGetUsersQuery({
    page,
    size: rowsPerPage,
    sort,
    username: username || undefined,
    roles: roles.length > 0 ? roles : undefined,
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

  const handleSortSelect = (value: string) => {
    setSort(value);
    setPage(0);
    setIsSortDialogOpen(false);
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
      return roles[0];
    }
    return t('users.rolesCount', { count: roles.length });
  })();

  const hasActiveFilters = usernameInput !== '' || roles.length > 0;

  const handleClearFilters = () => {
    setUsernameInput('');
    setRoles([]);
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
            label={t('users.searchByUsername')}
            size="small"
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
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
            }}
          >
            {roles.length === 0 ? t('users.rolesButton') : rolesFieldValue}
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
            }}
          >
            {t(SORT_LABEL_KEYS[sort as (typeof SORT_VALUES)[number]])}
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
          <DialogTitle>{t('users.rolesDialogTitle')}</DialogTitle>
          <DialogContent dividers>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {ROLE_OPTIONS.map((role) => {
                const isSelected = draftRoles.includes(role);
                return (
                  <Chip
                    key={role}
                    label={role}
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
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button
              onClick={() => setDraftRoles([])}
              variant="contained"
              color="error"
              startIcon={<ClearIcon />}
              sx={{ textTransform: 'none', fontWeight: 'bold', borderRadius: 2, mr: 'auto' }}
            >
              {t('common.clear')}
            </Button>
            <Button
              onClick={handleCloseRolesDialog}
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
              onClick={handleApplyRolesDialog}
              variant="contained"
              color="primary"
              startIcon={<CheckIcon />}
              sx={{ textTransform: 'none', fontWeight: 'bold', borderRadius: 2 }}
            >
              {t('common.apply')}
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog open={isSortDialogOpen} onClose={handleCloseSortDialog} fullWidth maxWidth="xs">
          <DialogTitle>{t('users.sortBy')}</DialogTitle>
          <DialogContent dividers sx={{ p: 0 }}>
            <List disablePadding>
              {SORT_VALUES.map((value) => {
                const isSelected = value === sort;
                return (
                  <ListItemButton
                    key={value}
                    selected={isSelected}
                    onClick={() => handleSortSelect(value)}
                  >
                    <ListItemText
                      primary={t(SORT_LABEL_KEYS[value])}
                      primaryTypographyProps={{ fontWeight: isSelected ? 'bold' : 'normal' }}
                    />
                    {isSelected && (
                      <ListItemIcon sx={{ minWidth: 'auto', color: 'primary.main' }}>
                        <CheckIcon />
                      </ListItemIcon>
                    )}
                  </ListItemButton>
                );
              })}
            </List>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button
              onClick={handleCloseSortDialog}
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
              {t('common.close')}
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
                  <TableCell>{t('users.username')}</TableCell>
                  <TableCell>{t('users.role')}</TableCell>
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
                    <TableCell sx={{ fontWeight: 'bold', width: '10%' }}>{t('users.id')}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', width: '50%' }}>{t('users.username')}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', width: '25%' }}>{t('users.role')}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold', width: '15%' }}>{t('users.actions')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.content.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.id}</TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>
                        {user.role ? (
                          <Chip
                            label={user.role}
                            size="small"
                            color={getRoleChipColor(user.role)}
                            variant="outlined"
                          />
                        ) : '-'}
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
                        <TableCell align="right">
                          {/* Render an identical but invisible button to enforce row height */}
                          <Button
                            startIcon={<InfoIcon />}
                            sx={{ visibility: 'hidden', textTransform: 'none' }}
                            aria-hidden="true"
                          >
                            {t('users.info')}
                          </Button>
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
