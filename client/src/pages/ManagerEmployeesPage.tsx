import React, { useState } from 'react';
import { useGetManagerEmployeesQuery, useDeleteEmployeeMutation } from '../features/restaurants/restaurantsSlice';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
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
  Tooltip
} from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import InfoIcon from '@mui/icons-material/Info';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const getRoleChipColor = (role: string) => {
  switch (role?.toUpperCase()) {
    case 'ADMIN':
      return 'error';
    case 'CLIENT':
    case 'CUSTOMER':
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
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const currentUserId = useSelector((state: RootState) => state.auth.id);
  const { data, error, isLoading } = useGetManagerEmployeesQuery({ page, size: rowsPerPage });
  const [deleteEmployee, { isLoading: isDeleting }] = useDeleteEmployeeMutation();

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDelete = async (employeeId: number, name: string) => {
    if (window.confirm(`Are you sure you want to remove employee ${name}?`)) {
      try {
        await deleteEmployee(employeeId).unwrap();
        dispatch(addAlert({ message: 'Employee removed successfully!', type: 'success' }));
      } catch (err: any) {
        console.error('Failed to remove employee:', err);
        dispatch(addAlert({
          message: err?.data?.message || 'Failed to remove employee. Please try again.',
          type: 'error'
        }));
      }
    }
  };

  const rowHeight = 53;
  const emptyRows = data ? Math.max(0, rowsPerPage - data.content.length) : 0;

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: { xs: 2, sm: 4 }, mb: { xs: 2, sm: 4 }, px: { xs: 1, sm: 2 } }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
          <Typography color="error" variant="h5" fontWeight="bold" gutterBottom>
            Error
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Failed to load restaurant employees. Please try again.
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
                  Employees
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.85rem' } }}>
                  Manage restaurant employees
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
              Add Employee
            </Button>
          </Box>
        </Box>
        <Divider />
        
        {isLoading ? (
          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead sx={{ backgroundColor: 'action.hover' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', width: '10%' }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', width: '15%' }}>Username</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', width: '20%' }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', width: '20%' }}>Phone Number</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', width: '15%' }}>Role</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold', width: '20%' }}>Actions</TableCell>
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
              No employees found for your restaurant.
            </Typography>
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="employees table">
                <TableHead sx={{ backgroundColor: 'action.hover' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', width: '10%' }}>ID</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', width: '15%' }}>Username</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', width: '20%' }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', width: '20%' }}>Phone Number</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', width: '15%' }}>Role</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold', width: '20%' }}>Actions</TableCell>
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
                          <Tooltip title="User Details" arrow>
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
                          {canDelete && (
                            <Tooltip title="Remove Employee" arrow>
                              <IconButton
                                color="error"
                                size="small"
                                onClick={() => handleDelete(employee.id, `${employee.firstName || ''} ${employee.lastName || ''}`)}
                                disabled={isDeleting}
                                sx={{ ml: 0.5 }}
                              >
                                <DeleteIcon />
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
                            Info
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
    </Container>
  );
};

export default ManagerEmployeesPage;