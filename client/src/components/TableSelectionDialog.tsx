import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Skeleton,
  Typography,
  Box,
  Chip,
  Button
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SmokingRoomsIcon from '@mui/icons-material/SmokingRooms';
import SmokeFreeIcon from '@mui/icons-material/SmokeFree';
import TableBarIcon from '@mui/icons-material/TableBar';
import { useGetManagerTablesQuery, RestaurantTableResponse } from '../features/restaurants/restaurantsSlice';

interface TableSelectionDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  minCapacity: number;
  isSmokingAllowed: boolean | null;
  onSelect: (table: RestaurantTableResponse) => void;
}

const ROWS_PER_PAGE = 5;

const TableSelectionDialog: React.FC<TableSelectionDialogProps> = ({
  open,
  onClose,
  title,
  minCapacity,
  isSmokingAllowed,
  onSelect
}) => {
  const { t } = useTranslation();
  const [page, setPage] = useState(0);

  const { data, isFetching } = useGetManagerTablesQuery(
    { page, size: ROWS_PER_PAGE, isSmokingAllowed: isSmokingAllowed ?? undefined, minCapacity },
    { skip: !open }
  );

  const handleSelect = (table: RestaurantTableResponse) => {
    onSelect(table);
    onClose();
  };

  const rowHeight = 53;
  const emptyRows = data ? Math.max(0, ROWS_PER_PAGE - data.content.length) : 0;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ pr: 6, position: 'relative' }}>
        {title}
        <IconButton
          onClick={onClose}
          size="small"
          sx={{ position: 'absolute', right: 12, top: 12, color: 'text.secondary' }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 0 }}>
        {isFetching ? (
          <Box sx={{ p: 2 }}>
            {[...Array(ROWS_PER_PAGE)].map((_, index) => (
              <Skeleton key={index} height={rowHeight} />
            ))}
          </Box>
        ) : !data || data.content.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {t('bookingDetail.noMatchingTables')}
            </Typography>
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table size="small">
                <TableHead sx={{ backgroundColor: 'action.hover' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>{t('common.name')}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>{t('managerTables.capacity')}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>{t('managerTables.smokingAllowedColumn')}</TableCell>
                    <TableCell align="right" />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.content.map((table) => (
                    <TableRow
                      key={table.id}
                      hover
                      onClick={() => handleSelect(table)}
                      style={{ height: rowHeight }}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <TableBarIcon color="primary" fontSize="small" />
                          {table.name}
                        </Box>
                      </TableCell>
                      <TableCell>{table.capacity}</TableCell>
                      <TableCell>
                        {table.isSmokingAllowed ? (
                          <Chip
                            icon={<SmokingRoomsIcon />}
                            label={t('managerTables.smokingAllowed')}
                            size="small"
                            color="success"
                            variant="outlined"
                          />
                        ) : (
                          <Chip
                            icon={<SmokeFreeIcon />}
                            label={t('managerTables.nonSmoking')}
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelect(table);
                          }}
                          sx={{ textTransform: 'none', fontWeight: 'bold' }}
                        >
                          {t('bookingDetail.selectTableAction')}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {emptyRows > 0 &&
                    [...Array(emptyRows)].map((_, index) => (
                      <TableRow key={`empty-${index}`} style={{ height: rowHeight }}>
                        <TableCell component="th" scope="row">&nbsp;</TableCell>
                        <TableCell>&nbsp;</TableCell>
                        <TableCell>&nbsp;</TableCell>
                        <TableCell align="right">&nbsp;</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[ROWS_PER_PAGE]}
              component="div"
              count={data.totalElements}
              rowsPerPage={ROWS_PER_PAGE}
              page={page}
              onPageChange={(event, newPage) => setPage(newPage)}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TableSelectionDialog;
