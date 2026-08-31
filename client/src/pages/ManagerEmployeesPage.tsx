import React, { useState } from 'react';
import { useGetManagerEmployeesQuery, useDeleteEmployeeMutation } from '../features/restaurants/restaurantsSlice';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Trans, useTranslation } from 'react-i18next';
import { RootState } from '../store/store';
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
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const currentUserId = useSelector((state: RootState) => state.auth.id);
  const { data, error, isLoading } = useGetManagerEmployeesQuery({ page, size: rowsPerPage });
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

        {isLoading ? (
          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead sx={{ backgroundColor: 'action.hover' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', width: '10%' }}>{t('managerEmployees.id')}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', width: '15%' }}>{t('managerEmployees.username')}</TableCell>
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
                    <TableCell sx={{ fontWeight: 'bold', width: '15%' }}>{t('managerEmployees.username')}</TableCell>
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
                        <TableCell>{employee.username || ''}</TableCell>
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
