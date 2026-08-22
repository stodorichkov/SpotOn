import React, { useState } from 'react';
import { useGetUsersQuery } from '../features/users/usersSlice';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, CircularProgress, Typography, Container, Button, Skeleton, Chip, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import InfoIcon from '@mui/icons-material/Info';

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

const UsersPage: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { data, error, isLoading } = useGetUsersQuery({ page, size: rowsPerPage });

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const rowHeight = 53.5; // Keep for skeleton
  const emptyRows = data ? Math.max(0, rowsPerPage - data.content.length) : 0;

  if (isLoading) {
    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Users
            </Typography>
            <Paper>
                <TableContainer>
                    <Table sx={{ minWidth: 650 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Username</TableCell>
                                <TableCell>Role</TableCell>
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
    return <Typography color="error">Error loading users.</Typography>;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Users
      </Typography>
      <Paper>
        {!data || data.content.length === 0 ? (
          <Box sx={{ p: 6, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              No users found.
            </Typography>
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Username</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell align="right">Actions</TableCell>
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
                        <Button
                          component={Link}
                          to={`/admin/users/${user.id}`}
                          startIcon={<InfoIcon />}
                          sx={{ textTransform: 'none' }}
                        >
                          Info
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {emptyRows > 0 &&
                    [...Array(emptyRows)].map((_, index) => (
                      <TableRow key={`empty-${index}`}>
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