import React, { useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { useGetEmployeesQuery } from '../features/restaurants/restaurantsSlice';
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
  Button,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import GroupIcon from '@mui/icons-material/Group';
import InfoIcon from '@mui/icons-material/Info';

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

const RestaurantEmployeesPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const restaurantId = Number(id);
  const restaurantName = location.state?.restaurantName || `Restaurant #${restaurantId}`;

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { data, error, isLoading } = useGetEmployeesQuery(
    { restaurantId, page, size: rowsPerPage },
    { skip: isNaN(restaurantId) }
  );

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const rowHeight = 53;
  const emptyRows = data ? Math.max(0, rowsPerPage - data.content.length) : 0;

  if (isNaN(restaurantId)) {
    return (
      <Container maxWidth="md" sx={{ mt: { xs: 2, sm: 4 }, mb: { xs: 2, sm: 4 }, px: { xs: 1, sm: 2 } }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
          <Typography color="error" variant="h6" fontWeight="bold" gutterBottom>
            Error
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Invalid Restaurant ID.
          </Typography>
          <Button component={Link} to="/admin/restaurants" startIcon={<ArrowBackIcon />} sx={{ mt: 2, textTransform: 'none', fontWeight: 'bold' }}>
            Back to Restaurants
          </Button>
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
                  Manage employees for {restaurantName}
                </Typography>
              </Box>
            </Box>
            <Button
              component={Link}
              to={`/admin/restaurants/${restaurantId}/employees/new`}
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
              Add Manager
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
                  <TableCell sx={{ fontWeight: 'bold', width: '25%' }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', width: '20%' }}>Phone Number</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', width: '15%' }}>Role</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold', width: '15%' }}>Actions</TableCell>
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
        ) : error ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="error" variant="h6">
              Error loading employees.
            </Typography>
          </Box>
        ) : !data || data.content.length === 0 ? (
          <Box sx={{ p: 6, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              No employees found for this restaurant.
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
                    <TableCell sx={{ fontWeight: 'bold', width: '25%' }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', width: '20%' }}>Phone Number</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', width: '15%' }}>Role</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold', width: '15%' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.content.map((employee) => {
                    if (!employee) return null;
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
                              to={`/admin/users/${employee.id}`}
                              state={{ user: employee }}
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

export default RestaurantEmployeesPage;