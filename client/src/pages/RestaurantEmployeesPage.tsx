import React, { useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { useGetEmployeesQuery } from '../features/restaurants/restaurantsSlice';
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
  Button
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
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

  const rowHeight = 52;
  const emptyRows = data ? Math.max(0, rowsPerPage - data.content.length) : 0;

  if (isNaN(restaurantId)) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography color="error" variant="h6">
          Invalid Restaurant ID.
        </Typography>
        <Button component={Link} to="/admin/restaurants" startIcon={<ArrowBackIcon />} sx={{ mt: 2 }}>
          Back to Restaurants
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Employees for {restaurantName}
        </Typography>
        <Button
          component={Link}
          to={`/admin/restaurants/${restaurantId}/employees/new`}
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          sx={{ textTransform: 'none', fontWeight: 'bold', borderRadius: 2 }}
        >
          Add Manager
        </Button>
      </Box>

      <Paper>
        {isLoading ? (
          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Username</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Phone Number</TableCell>
                  <TableCell>Role</TableCell>
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
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Username</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Phone Number</TableCell>
                    <TableCell>Role</TableCell>
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
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
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