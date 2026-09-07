import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGetTablesForManageQuery } from '../features/restaurants/restaurantsSlice';
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
  Box,
  Divider,
  IconButton,
  Tooltip,
  TextField,
  Button
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import SortIcon from '@mui/icons-material/Sort';
import SmokingRoomsIcon from '@mui/icons-material/SmokingRooms';
import SmokeFreeIcon from '@mui/icons-material/SmokeFree';
import SortDialog, { SortDirection } from '../components/SortDialog';

const AdminRestaurantTablesPage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const restaurantId = Number(id);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const sort = `${sortField},${sortDirection}`;
  const [isSortDialogOpen, setIsSortDialogOpen] = useState(false);

  const SORT_FIELDS = [
    { value: 'id', label: t('common.id') },
    { value: 'name', label: t('common.name') },
    { value: 'capacity', label: t('managerTables.capacity') },
  ];

  const [idInput, setIdInput] = useState('');
  const [id2, setId2] = useState<number | undefined>(undefined);
  const [nameInput, setNameInput] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    const timeout = setTimeout(() => {
      const trimmed = idInput.trim();
      setId2(trimmed === '' ? undefined : Number(trimmed));
      setName(nameInput.trim());
      setPage(0);
    }, 400);
    return () => clearTimeout(timeout);
  }, [idInput, nameInput]);

  const { data, error, isLoading } = useGetTablesForManageQuery(
    {
      restaurantId,
      page,
      size: rowsPerPage,
      sort,
      id: id2,
      name: name || undefined,
    },
    { skip: isNaN(restaurantId) }
  );

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSortFieldSelect = (value: string) => {
    setSortField(value);
    setPage(0);
  };

  const handleSortDirectionSelect = (value: SortDirection) => {
    setSortDirection(value);
    setPage(0);
  };

  const hasActiveFilters = idInput !== '' || nameInput !== '';

  const handleClearFilters = () => {
    setIdInput('');
    setNameInput('');
    setPage(0);
  };

  const rowHeight = 53;
  const emptyRows = data ? Math.max(0, rowsPerPage - data.content.length) : 0;

  return (
    <Container maxWidth="md" sx={{ mb: { xs: 2, sm: 4 }, px: { xs: 1, sm: 2 } }}>
      <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <Box sx={{ p: { xs: 2, sm: 3 }, display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'flex-start' }}>
          <TextField
            label={t('managerTables.searchById')}
            size="small"
            type="number"
            value={idInput}
            onChange={(e) => setIdInput(e.target.value)}
            sx={{ minWidth: 100, flex: '0 1 100px' }}
          />
          <TextField
            label={t('managerTables.searchByName')}
            size="small"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            sx={{ minWidth: 180, flex: '1 1 180px' }}
          />
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => setIsSortDialogOpen(true)}
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
            <Tooltip title={t('managerTables.clearFilters')} arrow>
              <IconButton onClick={handleClearFilters} size="small" sx={{ alignSelf: 'center' }}>
                <ClearIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
        <SortDialog
          open={isSortDialogOpen}
          onClose={() => setIsSortDialogOpen(false)}
          title={t('managerTables.sortBy')}
          fields={SORT_FIELDS}
          field={sortField}
          direction={sortDirection}
          onFieldSelect={handleSortFieldSelect}
          onDirectionSelect={handleSortDirectionSelect}
        />
        <Divider />
        {error ? (
          <Box sx={{ p: 6, textAlign: 'center' }}>
            <Typography color="error" variant="body1">
              {t('managerTables.errorLoading')}
            </Typography>
          </Box>
        ) : isLoading ? (
          <TableContainer>
            <Table sx={{ minWidth: 500 }}>
              <TableHead sx={{ backgroundColor: 'action.hover' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', width: '15%' }}>{t('managerTables.id')}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', width: '40%' }}>{t('managerTables.name')}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', width: '20%' }}>{t('managerTables.capacity')}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', width: '25%' }}>{t('managerTables.smokingAllowedColumn')}</TableCell>
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
              {t('managerTables.noTables')}
            </Typography>
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table sx={{ minWidth: 500 }} aria-label="tables table">
                <TableHead sx={{ backgroundColor: 'action.hover' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', width: '15%' }}>{t('managerTables.id')}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', width: '40%' }}>{t('managerTables.name')}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', width: '20%' }}>{t('managerTables.capacity')}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', width: '25%' }}>{t('managerTables.smokingAllowedColumn')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.content.map((table) => {
                    if (!table) return null;
                    return (
                      <TableRow key={table.id} style={{ height: rowHeight }}>
                        <TableCell>{table.id}</TableCell>
                        <TableCell>{table.name || ''}</TableCell>
                        <TableCell>{table.capacity}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {table.isSmokingAllowed ? (
                              <SmokingRoomsIcon color="success" fontSize="small" />
                            ) : (
                              <SmokeFreeIcon color="action" fontSize="small" />
                            )}
                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                              {table.isSmokingAllowed ? t('managerTables.smokingAllowed') : t('managerTables.nonSmoking')}
                            </Typography>
                          </Box>
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

export default AdminRestaurantTablesPage;
