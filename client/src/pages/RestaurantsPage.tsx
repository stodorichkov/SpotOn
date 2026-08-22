import React, { useState } from 'react';
import { useGetRestaurantsQuery } from '../features/restaurants/restaurantsSlice';
import { Link } from 'react-router-dom';
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
import PeopleIcon from '@mui/icons-material/People';
import AddIcon from '@mui/icons-material/Add';

const RestaurantsPage: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { data, error, isLoading } = useGetRestaurantsQuery({ page, size: rowsPerPage });

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const rowHeight = 53.5;
  const emptyRows = data ? Math.max(0, rowsPerPage - data.content.length) : 0;

  if (isLoading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" fontWeight="bold">
            Restaurants
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            disabled
            sx={{ textTransform: 'none', fontWeight: 'bold', borderRadius: 2 }}
          >
            Add Restaurant
          </Button>
        </Box>
        <Paper>
          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Categories</TableCell>
                  <TableCell align="right">Actions</TableCell>
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
          <TablePagination
            rowsPerPageOptions={[5, 10]}
            component="div"
            count={0}
            rowsPerPage={rowsPerPage}
            page={0}
            onPageChange={() => {}}
            onRowsPerPageChange={() => {}}
          />
        </Paper>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography color="error" variant="h6">
          Error loading restaurants.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          Restaurants
        </Typography>
        <Button
          component={Link}
          to="/admin/restaurants/new"
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          sx={{ textTransform: 'none', fontWeight: 'bold', borderRadius: 2 }}
        >
          Add Restaurant
        </Button>
      </Box>
      <Paper>
        {!data || data.content.length === 0 ? (
          <Box sx={{ p: 6, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              No restaurants found.
            </Typography>
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="restaurants table">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Categories</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.content.map((restaurant) => {
                    if (!restaurant) return null;
                    return (
                      <TableRow key={restaurant.id}>
                        <TableCell>{restaurant.id}</TableCell>
                        <TableCell>{restaurant.name}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                            {restaurant.categories && restaurant.categories.length > 0 ? (
                              restaurant.categories.map((category) => (
                                <Chip
                                  key={category.id}
                                  label={category.name}
                                  size="small"
                                  color="primary"
                                  variant="outlined"
                                />
                              ))
                            ) : (
                              <Typography variant="body2" color="text.secondary">No categories</Typography>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            component={Link}
                            to={`/admin/restaurants/${restaurant.id}/employees`}
                            state={{ restaurantName: restaurant.name }}
                            variant="text"
                            size="small"
                            startIcon={<PeopleIcon />}
                            sx={{ textTransform: 'none', fontWeight: 'bold' }}
                          >
                            Employees
                          </Button>
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
                        <TableCell align="right">
                          <Button
                            variant="text"
                            size="small"
                            startIcon={<PeopleIcon />}
                            sx={{ visibility: 'hidden' }}
                            aria-hidden="true"
                          >
                            Employees
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

export default RestaurantsPage;