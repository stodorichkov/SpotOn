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
  Button,
  Divider
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import AddIcon from '@mui/icons-material/Add';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { getCategoryStyle } from '../utils/categoryColor';

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

  const rowHeight = 53;
  const emptyRows = data ? Math.max(0, rowsPerPage - data.content.length) : 0;

  if (isLoading) {
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
                  <RestaurantIcon sx={{ fontSize: { xs: 24, sm: 28 } }} />
                </Box>
                <Box>
                  <Typography variant="h5" component="h1" fontWeight="bold" sx={{ fontSize: { xs: '1.3rem', sm: '1.6rem' } }}>
                    Restaurants
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.85rem' } }}>
                    Manage list of active restaurants
                  </Typography>
                </Box>
              </Box>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                disabled
                sx={{ 
                  textTransform: 'none', 
                  fontWeight: 'bold', 
                  borderRadius: 2,
                  width: { xs: '100%', sm: 'auto' }
                }}
              >
                Add Restaurant
              </Button>
            </Box>
          </Box>
          <Divider />
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
      <Container maxWidth="md" sx={{ mt: { xs: 2, sm: 4 }, mb: { xs: 2, sm: 4 }, px: { xs: 1, sm: 2 } }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
          <Typography color="error" variant="h5" fontWeight="bold" gutterBottom>
            Error
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Error loading restaurants.
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
                <RestaurantIcon sx={{ fontSize: { xs: 24, sm: 28 } }} />
              </Box>
              <Box>
                <Typography variant="h5" component="h1" fontWeight="bold" sx={{ fontSize: { xs: '1.3rem', sm: '1.6rem' } }}>
                  Restaurants
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.85rem' } }}>
                  Manage list of active restaurants
                </Typography>
              </Box>
            </Box>
            <Button
              component={Link}
              to="/admin/restaurants/new"
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
              Add Restaurant
            </Button>
          </Box>
        </Box>
        <Divider />
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
                <TableHead sx={{ backgroundColor: 'action.hover' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', width: '10%' }}>ID</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', width: '40%' }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', width: '35%' }}>Categories</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold', width: '15%' }}>Actions</TableCell>
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
                                  sx={{ ...getCategoryStyle(category.name), fontWeight: 'bold' }}
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
                            color="primary"
                            startIcon={<PeopleIcon />}
                            sx={{ textTransform: 'none', fontWeight: 'bold', borderRadius: 1.5, px: 1.5 }}
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