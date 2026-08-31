import React, { useState } from 'react';
import { useGetRestaurantBookingsQuery, useCancelBookingMutation, useArrivedBookingMutation, useCompletedBookingMutation } from '../features/restaurants/restaurantsSlice';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Trans, useTranslation } from 'react-i18next';
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
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SmokingRoomsIcon from '@mui/icons-material/SmokingRooms';
import SmokeFreeIcon from '@mui/icons-material/SmokeFree';
import PersonIcon from '@mui/icons-material/Person';
import InfoIcon from '@mui/icons-material/Info';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { BookingStatus } from '../constants';

const getStatusStyles = (status: string) => {
  switch (status?.toUpperCase()) {
    case BookingStatus.PENDING:
      return {
        backgroundColor: '#fff7ed',
        color: '#ea580c',
        borderColor: '#ffedd5',
        fontWeight: 'bold',
      };
    case BookingStatus.CONFIRMED:
      return {
        backgroundColor: '#eff6ff',
        color: '#2563eb',
        borderColor: '#dbeafe',
        fontWeight: 'bold',
      };
    case BookingStatus.ARRIVED:
      return {
        backgroundColor: '#faf5ff',
        color: '#9333ea',
        borderColor: '#f3e8ff',
        fontWeight: 'bold',
      };
    case BookingStatus.COMPLETED:
      return {
        backgroundColor: '#f0fdf4',
        color: '#16a34a',
        borderColor: '#dcfce7',
        fontWeight: 'bold',
      };
    case BookingStatus.CANCELED:
      return {
        backgroundColor: '#fef2f2',
        color: '#dc2626',
        borderColor: '#fee2e2',
        fontWeight: 'bold',
      };
    default:
      return {
        backgroundColor: '#f3f4f6',
        color: '#4b5563',
        borderColor: '#e5e7eb',
        fontWeight: 'bold',
      };
  }
};

const EmployeeBookingsPage: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [activeBooking, setActiveBooking] = useState<any>(null);

  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<any>(null);

  const [arrivedDialogOpen, setArrivedDialogOpen] = useState(false);
  const [bookingToArrive, setBookingToArrive] = useState<any>(null);

  const [completedDialogOpen, setCompletedDialogOpen] = useState(false);
  const [bookingToComplete, setBookingToComplete] = useState<any>(null);

  const { data, error, isLoading } = useGetRestaurantBookingsQuery({ page, size: rowsPerPage });
  const [cancelBooking, { isLoading: isCancelling }] = useCancelBookingMutation();
  const [arrivedBooking, { isLoading: isMarkingArrived }] = useArrivedBookingMutation();
  const [completedBooking, { isLoading: isCompleting }] = useCompletedBookingMutation();

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, booking: any) => {
    setAnchorEl(event.currentTarget);
    setActiveBooking(booking);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setActiveBooking(null);
  };

  const handleCancelClick = (booking: any) => {
    setBookingToCancel(booking);
    setCancelDialogOpen(true);
  };

  const handleCancelConfirm = async () => {
    if (!bookingToCancel) return;
    try {
      await cancelBooking(bookingToCancel.id).unwrap();
      dispatch(addAlert({ message: t('employeeBookings.cancelSuccess'), type: 'success' }));
    } catch (err: any) {
      console.error('Failed to cancel reservation:', err);
      dispatch(addAlert({
        message: err?.data?.message || t('employeeBookings.cancelFailure'),
        type: 'error'
      }));
    } finally {
      setCancelDialogOpen(false);
      setBookingToCancel(null);
    }
  };

  const handleArrivedClick = (booking: any) => {
    setBookingToArrive(booking);
    setArrivedDialogOpen(true);
  };

  const handleArrivedConfirm = async () => {
    if (!bookingToArrive) return;
    try {
      await arrivedBooking(bookingToArrive.id).unwrap();
      dispatch(addAlert({ message: t('employeeBookings.arrivedSuccess', { id: bookingToArrive.id }), type: 'success' }));
    } catch (err: any) {
      console.error('Failed to mark as arrived:', err);
      dispatch(addAlert({
        message: err?.data?.message || t('employeeBookings.arrivedFailure'),
        type: 'error'
      }));
    } finally {
      setArrivedDialogOpen(false);
      setBookingToArrive(null);
    }
  };

  const handleArrivedClose = () => {
    setArrivedDialogOpen(false);
    setBookingToArrive(null);
  };

  const handleCompletedClick = (booking: any) => {
    setBookingToComplete(booking);
    setCompletedDialogOpen(true);
  };

  const handleCompletedConfirm = async () => {
    if (!bookingToComplete) return;
    try {
      await completedBooking(bookingToComplete.id).unwrap();
      dispatch(addAlert({ message: t('employeeBookings.completedSuccess', { id: bookingToComplete.id }), type: 'success' }));
    } catch (err: any) {
      console.error('Failed to mark as completed:', err);
      dispatch(addAlert({
        message: err?.data?.message || t('employeeBookings.completedFailure'),
        type: 'error'
      }));
    } finally {
      setCompletedDialogOpen(false);
      setBookingToComplete(null);
    }
  };

  const handleCompletedClose = () => {
    setCompletedDialogOpen(false);
    setBookingToComplete(null);
  };

  const handleCancelClose = () => {
    setCancelDialogOpen(false);
    setBookingToCancel(null);
  };

  const rowHeight = 65;
  const emptyRows = data ? Math.max(0, rowsPerPage - data.content.length) : 0;

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: { xs: 4, sm: 6 }, px: { xs: 2, sm: 0 } }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
          <Typography color="error" variant="h5" fontWeight="bold" gutterBottom>
            {t('common.error')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t('employeeBookings.errorLoading')}
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: { xs: 3, sm: 5 }, mb: 4, px: { xs: 1, sm: 2 } }}>
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 3 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 2,
            mb: 3
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'primary.main',
                color: 'primary.contrastText',
                borderRadius: '50%',
                width: 48,
                height: 48,
                flexShrink: 0
              }}
            >
              <CalendarMonthIcon />
            </Box>
            <Box>
              <Typography variant="h4" component="h1" fontWeight="bold" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                {t('employeeBookings.title')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('employeeBookings.subtitle')}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider />

        {isLoading ? (
          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead sx={{ backgroundColor: 'action.hover' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', width: '8%' }}>{t('employeeBookings.id')}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', width: '32%' }}>{t('employeeBookings.client')}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', width: '22%' }}>{t('employeeBookings.dateAndTime')}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', width: '10%' }}>{t('employeeBookings.guests')}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', width: '10%' }}>{t('employeeBookings.smoking')}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', width: '10%' }}>{t('employeeBookings.status')}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold', width: '8%' }}>{t('employeeBookings.actions')}</TableCell>
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
                    <TableCell><Skeleton /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : !data || data.content.length === 0 ? (
          <Box sx={{ p: 6, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              {t('employeeBookings.noBookings')}
            </Typography>
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="bookings table">
                <TableHead sx={{ backgroundColor: 'action.hover' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', width: '8%' }}>{t('employeeBookings.id')}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', width: '32%' }}>{t('employeeBookings.client')}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', width: '22%' }}>{t('employeeBookings.dateAndTime')}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', width: '10%' }}>{t('employeeBookings.guests')}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', width: '10%' }}>{t('employeeBookings.smoking')}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', width: '10%' }}>{t('employeeBookings.status')}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold', width: '8%' }}>{t('employeeBookings.actions')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.content.map((booking) => {
                    if (!booking) return null;
                    const bookingDate = new Date(booking.dateTime);

                    const hasMultipleActions = booking.status === BookingStatus.PENDING || booking.status === BookingStatus.CONFIRMED || booking.status === BookingStatus.ARRIVED;

                    return (
                      <TableRow key={booking.id} style={{ height: rowHeight }}>
                        <TableCell>{booking.id}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <PersonIcon color="primary" sx={{ fontSize: 24, opacity: 0.8 }} />
                            <Box>
                              <Typography variant="body2" fontWeight="bold">
                                {booking.client ? `${booking.client.firstName} ${booking.client.lastName}` : t('employeeBookings.clientFallback')}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" display="block">
                                {t('employeeBookings.phonePrefix', { phone: booking.client?.phoneNumber || t('employeeBookings.noPhone') })}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" fontWeight="medium">
                              {bookingDate.toLocaleDateString(undefined, {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" display="block">
                              {bookingDate.toLocaleTimeString(undefined, {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{t('employeeBookings.guest', { count: booking.guestCount })}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {booking.isSmoking ? (
                              <SmokingRoomsIcon color="success" fontSize="small" />
                            ) : (
                              <SmokeFreeIcon color="action" fontSize="small" />
                            )}
                            <Typography variant="caption" color="text.secondary">
                              {booking.isSmoking ? t('employeeBookings.smokingAllowed') : t('employeeBookings.nonSmoking')}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={booking.status || 'PENDING'}
                            size="small"
                            variant="outlined"
                            sx={{
                              ...getStatusStyles(booking.status),
                              fontSize: '0.75rem',
                              borderWidth: 1,
                              borderStyle: 'solid'
                            }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          {hasMultipleActions ? (
                            <IconButton
                              color="primary"
                              size="small"
                              onClick={(e) => handleMenuOpen(e, booking)}
                              aria-label="actions"
                            >
                              <MoreVertIcon />
                            </IconButton>
                          ) : (
                            <Tooltip title={t('employeeBookings.bookingDetailsTooltip')} arrow>
                              <IconButton
                                component={Link}
                                to={`/employee/bookings/${booking.id}`}
                                state={{ booking }}
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
                        <TableCell>&nbsp;</TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            sx={{ visibility: 'hidden' }}
                            aria-hidden="true"
                          >
                            <InfoIcon />
                          </IconButton>
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

      {/* Responsive Collapsible Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: 160,
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
          }
        }}
      >
        {activeBooking && [
          <MenuItem
            key="details"
            component={Link}
            to={`/employee/bookings/${activeBooking.id}`}
            state={{ booking: activeBooking }}
            onClick={handleMenuClose}
          >
            <ListItemIcon>
              <InfoIcon color="primary" fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={t('employeeBookings.menuDetails')} />
          </MenuItem>,
          activeBooking.status === BookingStatus.PENDING && (
            <MenuItem
              key="confirm"
              component={Link}
              to={`/employee/bookings/${activeBooking.id}`}
              state={{ booking: activeBooking, confirm: true }}
              onClick={handleMenuClose}
            >
              <ListItemIcon>
                <CheckCircleIcon color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={t('employeeBookings.menuConfirm')} />
            </MenuItem>
          ),
          activeBooking.status === BookingStatus.CONFIRMED && (
            <MenuItem
              key="arrived"
              onClick={() => {
                handleMenuClose();
                handleArrivedClick(activeBooking);
              }}
            >
              <ListItemIcon>
                <HowToRegIcon color="info" fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={t('employeeBookings.menuArrived')} />
            </MenuItem>
          ),
          activeBooking.status === BookingStatus.ARRIVED && (
            <MenuItem
              key="completed"
              onClick={() => {
                handleMenuClose();
                handleCompletedClick(activeBooking);
              }}
            >
              <ListItemIcon>
                <TaskAltIcon color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={t('employeeBookings.menuCompleted')} />
            </MenuItem>
          ),
          (activeBooking.status === BookingStatus.PENDING || activeBooking.status === BookingStatus.CONFIRMED) && (
            <MenuItem
              key="cancel"
              onClick={() => {
                handleMenuClose();
                handleCancelClick(activeBooking);
              }}
              sx={{ color: 'error.main' }}
            >
              <ListItemIcon>
                <CancelIcon color="error" fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={t('employeeBookings.menuCancel')} />
            </MenuItem>
          )
        ]}
      </Menu>

      {/* Custom Material UI Confirmation Dialog for Cancelling Reservation */}
      <Dialog
        open={cancelDialogOpen}
        onClose={handleCancelClose}
        aria-labelledby="cancel-dialog-title"
        aria-describedby="cancel-dialog-description"
        PaperProps={{
          sx: {
            borderRadius: 3,
            px: 1,
            py: 0.5
          }
        }}
      >
        <DialogTitle id="cancel-dialog-title" fontWeight="bold">
          {t('employeeBookings.cancelDialogTitle')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="cancel-dialog-description">
            <Trans i18nKey="employeeBookings.cancelDialogBody" values={{ id: bookingToCancel?.id }} components={{ bold: <strong /> }} />
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleCancelClose}
            color="inherit"
            sx={{ textTransform: 'none', fontWeight: 'bold' }}
            disabled={isCancelling}
          >
            {t('common.goBack')}
          </Button>
          <Button
            onClick={handleCancelConfirm}
            color="error"
            variant="contained"
            sx={{ textTransform: 'none', fontWeight: 'bold', borderRadius: 2 }}
            disabled={isCancelling}
            startIcon={isCancelling && <CircularProgress size={16} color="inherit" />}
            autoFocus
          >
            {t('employeeBookings.cancelDialogConfirm')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Custom Material UI Confirmation Dialog for Arrived Reservation */}
      <Dialog
        open={arrivedDialogOpen}
        onClose={handleArrivedClose}
        aria-labelledby="arrived-dialog-title"
        aria-describedby="arrived-dialog-description"
        PaperProps={{
          sx: {
            borderRadius: 3,
            px: 1,
            py: 0.5
          }
        }}
      >
        <DialogTitle id="arrived-dialog-title" fontWeight="bold">
          {t('employeeBookings.arrivedDialogTitle')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="arrived-dialog-description">
            <Trans i18nKey="employeeBookings.arrivedDialogBody" values={{ id: bookingToArrive?.id }} components={{ bold: <strong /> }} />
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleArrivedClose}
            color="inherit"
            sx={{ textTransform: 'none', fontWeight: 'bold' }}
            disabled={isMarkingArrived}
          >
            {t('common.goBack')}
          </Button>
          <Button
            onClick={handleArrivedConfirm}
            color="info"
            variant="contained"
            sx={{ textTransform: 'none', fontWeight: 'bold', borderRadius: 2 }}
            disabled={isMarkingArrived}
            startIcon={isMarkingArrived && <CircularProgress size={16} color="inherit" />}
            autoFocus
          >
            {t('employeeBookings.arrivedDialogConfirm')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Custom Material UI Confirmation Dialog for Completed Reservation */}
      <Dialog
        open={completedDialogOpen}
        onClose={handleCompletedClose}
        aria-labelledby="completed-dialog-title"
        aria-describedby="completed-dialog-description"
        PaperProps={{
          sx: {
            borderRadius: 3,
            px: 1,
            py: 0.5
          }
        }}
      >
        <DialogTitle id="completed-dialog-title" fontWeight="bold">
          {t('employeeBookings.completedDialogTitle')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="completed-dialog-description">
            <Trans i18nKey="employeeBookings.completedDialogBody" values={{ id: bookingToComplete?.id }} components={{ bold: <strong /> }} />
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleCompletedClose}
            color="inherit"
            sx={{ textTransform: 'none', fontWeight: 'bold' }}
            disabled={isCompleting}
          >
            {t('common.goBack')}
          </Button>
          <Button
            onClick={handleCompletedConfirm}
            color="success"
            variant="contained"
            sx={{ textTransform: 'none', fontWeight: 'bold', borderRadius: 2 }}
            disabled={isCompleting}
            startIcon={isCompleting && <CircularProgress size={16} color="inherit" />}
            autoFocus
          >
            {t('employeeBookings.completedDialogConfirm')}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EmployeeBookingsPage;
