import React, { useEffect, useState } from 'react';
import { useGetManagerEmployeesQuery, useDeleteEmployeeMutation } from '../features/restaurants/restaurantsSlice';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Trans, useTranslation } from 'react-i18next';
import { RootState } from '../store/store';
import { addAlert } from '../features/alerts/alertsSlice';
import { Role } from '../constants';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import InfoIcon from '@mui/icons-material/Info';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ClearIcon from '@mui/icons-material/Clear';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import BadgeIcon from '@mui/icons-material/Badge';
import SortIcon from '@mui/icons-material/Sort';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import SortDialog, { SortDirection } from '../components/SortDialog';

const ROLE_OPTIONS = [Role.MANAGER, Role.EMPLOYEE];

const getRoleChipColor = (role: string) => {
  switch (role?.toUpperCase()) {
    case 'ADMIN':
      return 'error';
    case 'CLIENT':
      return 'success';
    case 'EMPLOYEE':
    case 'STAFF':
      return 'info';
    case 'OWNER':
    case 'MANAGER':
      return 'warning';
    default:
      return 'default';
  }
};

const ManagerEmployeesPage: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const sort = `${sortField},${sortDirection}`;

  const SORT_FIELDS = [
    { value: 'id', label: t('common.id') },
    { value: 'email', label: t('common.email') },
    { value: 'firstName', label: t('common.name') },
    { value: 'role.name', label: t('common.role') },
  ];

  const [emailInput, setEmailInput] = useState('');
  const [email, setEmail] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [name, setName] = useState('');
  const [phoneNumberInput, setPhoneNumberInput] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [roles, setRoles] = useState<string[]>([]);
  const [isRolesDialogOpen, setIsRolesDialogOpen] = useState(false);
  const [draftRoles, setDraftRoles] = useState<string[]>([]);
  const [isSortDialogOpen, setIsSortDialogOpen] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setEmail(emailInput.trim());
      setName(nameInput.trim());
      setPhoneNumber(phoneNumberInput.trim());
      setPage(0);
    }, 400);
    return () => clearTimeout(timeout);
  }, [emailInput, nameInput, phoneNumberInput]);

  const currentUserId = useSelector((state: RootState) => state.auth.id);
  const { data, error, isLoading } = useGetManagerEmployeesQuery({
    page,
    size: rowsPerPage,
    sort,
    email: email || undefined,
    name: name || undefined,
    phoneNumber: phoneNumber || undefined,
    roles: roles.length > 0 ? roles : undefined,
  });
  const [deleteEmployee, { isLoading: isDeleting }] = useDeleteEmployeeMutation();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<{ id: number; name: string } | null>(null);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [activeEmployee, setActiveEmployee] = useState<any>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, employee: any) => {
    setAnchorEl(event.currentTarget);
    setActiveEmployee(employee);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setActiveEmployee(null);
  };

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
      return roles[0];
    }
    return t('managerEmployees.rolesCount', { count: roles.length });
  })();

  const hasActiveFilters = emailInput !== '' || nameInput !== '' || phoneNumberInput !== '' || roles.length > 0;

  const handleClearFilters = () => {
    setEmailInput('');
    setNameInput('');
    setPhoneNumberInput('');
    setRoles([]);
    setPage(0);
  };

  const handleDeleteClick = (employeeId: number, name: string) => {
    setEmployeeToDelete({ id: employeeId, name });
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!employeeToDelete) return;
    try {
      await deleteEmployee(employeeToDelete.id).unwrap();
      dispatch(addAlert({ message: t('managerEmployees.success'), type: 'success' }));
    } catch (err: any) {
      console.error('Failed to remove employee:', err);
      dispatch(addAlert({
        message: err?.data?.message || t('managerEmployees.failure'),
        type: 'error'
      }));
    } finally {
      setDeleteDialogOpen(false);
      setEmployeeToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setEmployeeToDelete(null);
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
            {t('managerEmployees.errorLoading')}
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
                <GroupIcon sx={{ fontSize: { xs: 24, sm: 28 } }} />
              </Box>
              <Box>
                <Typography variant="h5" component="h1" fontWeight="bold" sx={{ fontSize: { xs: '1.3rem', sm: '1.6rem' } }}>
                  {t('managerEmployees.title')}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.85rem' } }}>
                  {t('managerEmployees.subtitle')}
                </Typography>
              </Box>
            </Box>
            <Button
              component={Link}
              to="/manager/employees/new"
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
              {t('managerEmployees.addEmployee')}
            </Button>
          </Box>
        </Box>
        <Divider />
        <Box sx={{ p: { xs: 2, sm: 3 }, display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'flex-start' }}>
          <TextField
            label={t('managerEmployees.searchByEmail')}
            size="small"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            sx={{ minWidth: 180, flex: '1 1 180px' }}
          />
          <TextField
            label={t('managerEmployees.searchByName')}
            size="small"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            sx={{ minWidth: 180, flex: '1 1 180px' }}
          />
          <TextField
            label={t('managerEmployees.searchByPhoneNumber')}
            size="small"
            value={phoneNumberInput}
            onChange={(e) => setPhoneNumberInput(e.target.value)}
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
            {roles.length === 0 ? t('managerEmployees.rolesButton') : rolesFieldValue}
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
            <Tooltip title={t('managerEmployees.clearFilters')} arrow>
              <IconButton onClick={handleClearFilters} size="small" sx={{ alignSelf: 'center' }}>
                <ClearIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
        <Dialog open={isRolesDialogOpen} onClose={handleCloseRolesDialog} fullWidth maxWidth="xs">
          <DialogTitle sx={{ pr: 6, position: 'relative' }}>
            {t('managerEmployees.rolesDialogTitle')}
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
          title={t('managerEmployees.sortBy')}
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
                  <TableCell sx={{ fontWeight: 'bold', width: '10%' }}>{t('managerEmployees.id')}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', width: '15%' }}>{t('managerEmployees.email')}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', width: '20%' }}>{t('managerEmployees.name')}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', width: '20%' }}>{t('managerEmployees.phoneNumber')}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', width: '15%' }}>{t('managerEmployees.role')}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold', width: '20%' }}>{t('managerEmployees.actions')}</TableCell>
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
              {t('managerEmployees.noEmployees')}
            </Typography>
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="employees table">
                <TableHead sx={{ backgroundColor: 'action.hover' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', width: '10%' }}>{t('managerEmployees.id')}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', width: '15%' }}>{t('managerEmployees.email')}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', width: '20%' }}>{t('managerEmployees.name')}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', width: '20%' }}>{t('managerEmployees.phoneNumber')}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', width: '15%' }}>{t('managerEmployees.role')}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold', width: '20%' }}>{t('managerEmployees.actions')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.content.map((employee) => {
                    if (!employee) return null;
                    const isSelf = employee.id === currentUserId;
                    const canDelete = !isSelf && (employee.role?.toUpperCase() === 'EMPLOYEE' || employee.role?.toUpperCase() === 'STAFF');
                    return (
                      <TableRow key={employee.id} style={{ height: rowHeight }}>
                        <TableCell>{employee.id}</TableCell>
                        <TableCell>{employee.email || ''}</TableCell>
                        <TableCell>{`${employee.firstName || ''} ${employee.lastName || ''}`}</TableCell>
                        <TableCell>{employee.phoneNumber || '-'}</TableCell>
                        <TableCell>
                          {employee.role ? (
                            <Chip
                              label={employee.role}
                              size="small"
                              color={getRoleChipColor(employee.role)}
                              variant="outlined"
                            />
                          ) : '-'}
                        </TableCell>
                        <TableCell align="right">
                          {canDelete ? (
                            <IconButton
                              color="primary"
                              size="small"
                              onClick={(e) => handleMenuOpen(e, employee)}
                              aria-label="actions"
                            >
                              <MoreVertIcon />
                            </IconButton>
                          ) : (
                            <Tooltip title={t('managerEmployees.userDetailsTooltip')} arrow>
                              <IconButton
                                component={Link}
                                to={`/manager/employees/${employee.id}`}
                                state={{ user: employee }}
                                color="primary"
                                size="small"
                              >
                                <InfoIcon />
                              </IconButton>
                            </Tooltip>
                          )}
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
                          <Button
                            variant="text"
                            size="small"
                            startIcon={<InfoIcon />}
                            sx={{ visibility: 'hidden' }}
                            aria-hidden="true"
                          >
                            {t('managerEmployees.menuDetails')}
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
              count={data.totalElements}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </Paper>

      {/* Custom Material UI Confirmation Dialog for Deleting Employee */}
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
          {t('managerEmployees.deleteTitle')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            <Trans
              i18nKey="managerEmployees.deleteBody"
              values={{ name: employeeToDelete?.name }}
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
        {activeEmployee && [
          <MenuItem
            key="details"
            component={Link}
            to={`/manager/employees/${activeEmployee.id}`}
            state={{ user: activeEmployee }}
            onClick={handleMenuClose}
          >
            <ListItemIcon>
              <InfoIcon color="primary" fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={t('managerEmployees.menuDetails')} />
          </MenuItem>,
          activeEmployee.id !== currentUserId && (activeEmployee.role?.toUpperCase() === 'EMPLOYEE' || activeEmployee.role?.toUpperCase() === 'STAFF') && (
            <MenuItem
              key="delete"
              onClick={() => {
                handleMenuClose();
                handleDeleteClick(activeEmployee.id, `${activeEmployee.firstName || ''} ${activeEmployee.lastName || ''}`);
              }}
              sx={{ color: 'error.main' }}
            >
              <ListItemIcon>
                <DeleteIcon color="error" fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={t('managerEmployees.menuRemove')} />
            </MenuItem>
          )
        ]}
      </Menu>
    </Container>
  );
};

export default ManagerEmployeesPage;
