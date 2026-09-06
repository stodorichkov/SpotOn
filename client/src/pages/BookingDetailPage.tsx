import React, { useState } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Trans, useTranslation } from 'react-i18next';
import { useCancelBookingMutation, useConfirmBookingMutation, useArrivedBookingMutation, useCompletedBookingMutation, RestaurantTableResponse } from '../features/restaurants/restaurantsSlice';
import { addAlert } from '../features/alerts/alertsSlice';
import { BookingStatus, Role } from '../constants';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { getIntlLocale } from '../utils/dateLocale';
import TableSelectionDialog from '../components/TableSelectionDialog';
import {
  Container,
  Paper,
  Typography,
  Box,
  Chip,
  Grid,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SmokingRoomsIcon from '@mui/icons-material/SmokingRooms';
import SmokeFreeIcon from '@mui/icons-material/SmokeFree';
import PeopleIcon from '@mui/icons-material/People';
import BadgeIcon from '@mui/icons-material/Badge';
import BusinessIcon from '@mui/icons-material/Business';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CancelIcon from '@mui/icons-material/Cancel';
import PersonIcon from '@mui/icons-material/Person';
import TableBarIcon from '@mui/icons-material/TableBar';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';

interface RestaurantContact {
  id: number;
  name: string;
  phoneNumber: string;
  address: string;
}

interface ClientContact {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

interface Booking {
  id: number;
  status: string;
  restaurant?: RestaurantContact;
  client?: ClientContact;
  guestCount: number;
  isSmoking: boolean | null;
  dateTime: string;
}

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

const BookingDetailPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { role } = useSelector((state: RootState) => state.auth);

  const booking = location.state?.booking as Booking | undefined;

  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelBooking, { isLoading: isCancelling }] = useCancelBookingMutation();

  const [arrivedDialogOpen, setArrivedDialogOpen] = useState(false);

  const [completedDialogOpen, setCompletedDialogOpen] = useState(false);

  const shouldStartInConfirmMode = location.state?.confirm === true;
  const [isConfirming, setIsConfirming] = useState(shouldStartInConfirmMode);

  const [selectedTable, setSelectedTable] = useState<RestaurantTableResponse | null>(null);
  const [isTableDialogOpen, setIsTableDialogOpen] = useState(false);
  const [confirmBooking, { isLoading: isConfirmingSubmit }] = useConfirmBookingMutation();
  const [arrivedBooking, { isLoading: isMarkingArrived }] = useArrivedBookingMutation();
  const [completedBooking, { isLoading: isCompleting }] = useCompletedBookingMutation();

  if (!booking) {
    return (
      <Container maxWidth="md" sx={{ mt: { xs: 4, sm: 8 }, mb: 4, px: { xs: 2, sm: 0 } }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
          <Typography color="error" variant="h5" fontWeight="bold" gutterBottom>
            {t('bookingDetail.notFoundTitle')}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {t('bookingDetail.notFoundBody')}
          </Typography>
          <Button
            component={Link}
            to="/bookings"
            variant="contained"
            color="primary"
            sx={{ textTransform: 'none', fontWeight: 'bold', borderRadius: 2 }}
          >
            {t('bookingDetail.backToBookings')}
          </Button>
        </Paper>
      </Container>
    );
  }

  const handleCancelConfirm = async () => {
    try {
      await cancelBooking(booking.id).unwrap();
      dispatch(addAlert({ message: t('bookingDetail.cancelSuccess'), type: 'success' }));
      navigate(backPath);
    } catch (err: any) {
      console.error('Failed to cancel reservation:', err);
      dispatch(addAlert({
        message: err?.data?.message || t('bookingDetail.cancelFailure'),
        type: 'error'
      }));
    } finally {
      setCancelDialogOpen(false);
    }
  };

  const handleCancelClose = () => {
    setCancelDialogOpen(false);
  };

  const handleArrivedClick = () => {
    setArrivedDialogOpen(true);
  };

  const handleArrivedConfirm = async () => {
    try {
      await arrivedBooking(booking.id).unwrap();
      dispatch(addAlert({ message: t('bookingDetail.arrivedSuccess', { id: booking.id }), type: 'success' }));
      navigate(backPath);
    } catch (err: any) {
      console.error('Failed to mark as arrived:', err);
      dispatch(addAlert({
        message: err?.data?.message || t('bookingDetail.arrivedFailure'),
        type: 'error'
      }));
    } finally {
      setArrivedDialogOpen(false);
    }
  };

  const handleArrivedClose = () => {
    setArrivedDialogOpen(false);
  };

  const handleCompletedClick = () => {
    setCompletedDialogOpen(true);
  };

  const handleCompletedConfirm = async () => {
    try {
      await completedBooking(booking.id).unwrap();
      dispatch(addAlert({ message: t('bookingDetail.completedSuccess', { id: booking.id }), type: 'success' }));
      navigate(backPath);
    } catch (err: any) {
      console.error('Failed to mark as completed:', err);
      dispatch(addAlert({
        message: err?.data?.message || t('bookingDetail.completedFailure'),
        type: 'error'
      }));
    } finally {
      setCompletedDialogOpen(false);
    }
  };

  const handleCompletedClose = () => {
    setCompletedDialogOpen(false);
  };

  const handleProcessConfirmSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTable) {
      dispatch(addAlert({ message: t('bookingDetail.selectTableError'), type: 'error' }));
      return;
    }

    try {
      await confirmBooking({
        bookingId: booking.id,
        body: { tableId: selectedTable.id }
      }).unwrap();

      dispatch(addAlert({
        message: t('bookingDetail.confirmSuccess', { tableName: selectedTable.name }),
        type: 'success'
      }));
      navigate(backPath);
    } catch (err: any) {
      console.error('Failed to confirm reservation:', err);
      dispatch(addAlert({
        message: err?.data?.message || t('bookingDetail.confirmFailure'),
        type: 'error'
      }));
    }
  };

  const handleCancelSection = () => {
    setIsConfirming(false);
    setSelectedTable(null);
    if (shouldStartInConfirmMode) {
      navigate('/employee/bookings');
    }
  };

  const bookingDate = new Date(booking.dateTime);
  const canCancel = booking.status === BookingStatus.PENDING || booking.status === BookingStatus.CONFIRMED;
  const isEmployee = role === Role.EMPLOYEE || role === Role.MANAGER;
  const showConfirmButton = isEmployee && booking.status === BookingStatus.PENDING && !isConfirming;

  const backPath = role === Role.EMPLOYEE || role === Role.MANAGER ? '/employee/bookings' : '/bookings';

  return (
    <Container maxWidth="md" sx={{ mt: { xs: 2, sm: 4 }, mb: { xs: 2, sm: 4 }, px: { xs: 1, sm: 2 } }}>
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 2 } }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'primary.main',
                color: 'primary.contrastText',
                borderRadius: '50%',
                width: { xs: 50, sm: 60 },
                height: { xs: 50, sm: 60 },
                flexShrink: 0
              }}
            >
              <CalendarMonthIcon sx={{ fontSize: { xs: 28, sm: 32 } }} />
            </Box>
            <Box>
              <Typography variant="h4" component="h1" fontWeight="bold" sx={{ fontSize: { xs: '1.5rem', sm: '2.125rem' } }}>
                {t('bookingDetail.title')}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                {t('bookingDetail.subtitle')}
              </Typography>
            </Box>
          </Box>

          <Chip
            label={booking.status || 'PENDING'}
            variant="outlined"
            sx={{
              ...getStatusStyles(booking.status),
              px: 2,
              py: 0.5,
              fontSize: '0.85rem',
              borderRadius: 2,
              borderWidth: 1,
              borderStyle: 'solid',
              alignSelf: { xs: 'flex-end', sm: 'auto' }
            }}
          />
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* Section 1: User Reservation Details */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" fontWeight="bold" color="text.secondary">
              {t('bookingDetail.reservationInformation')}
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {/* Booking ID */}
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <BadgeIcon color="primary" sx={{ mt: 0.5, fontSize: 28 }} />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
                    {t('bookingDetail.bookingId')}
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 0.5, fontSize: '1.1rem' }}>
                    {booking.id}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Date & Time */}
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <CalendarMonthIcon color="primary" sx={{ mt: 0.5, fontSize: 28 }} />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
                    {t('bookingDetail.dateAndTime')}
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 0.5, fontSize: '1.1rem' }}>
                    {bookingDate.toLocaleDateString(getIntlLocale(i18n.language), {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'numeric',
                      day: 'numeric'
                    })} {t('bookingDetail.dateTimeAt')} {bookingDate.toLocaleTimeString(getIntlLocale(i18n.language), {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false
                    })}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Guest Count */}
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <PeopleIcon color="primary" sx={{ mt: 0.5, fontSize: 28 }} />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
                    {t('bookingDetail.guestsCount')}
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 0.5, fontSize: '1.1rem' }}>
                    {t('bookingDetail.guest', { count: booking.guestCount })}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Smoking Policy */}
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                {booking.isSmoking === null ? (
                  <AllInclusiveIcon color="action" sx={{ mt: 0.5, fontSize: 28 }} />
                ) : booking.isSmoking ? (
                  <SmokingRoomsIcon color="success" sx={{ mt: 0.5, fontSize: 28 }} />
                ) : (
                  <SmokeFreeIcon color="action" sx={{ mt: 0.5, fontSize: 28 }} />
                )}
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
                    {t('bookingDetail.smokingPolicy')}
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 0.5, fontSize: '1.1rem' }}>
                    {booking.isSmoking === null
                      ? t('bookingDetail.smokingAny')
                      : booking.isSmoking
                        ? t('bookingDetail.smokingAllowed')
                        : t('bookingDetail.nonSmoking')}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Section 2: Venue or Client Details based on Role */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" fontWeight="bold" color="text.secondary">
              {role === Role.CLIENT ? t('bookingDetail.restaurantInformation') : t('bookingDetail.clientInformation')}
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {role === Role.CLIENT ? (
              <>
                {/* Restaurant Name */}
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <BusinessIcon color="primary" sx={{ mt: 0.5, fontSize: 28 }} />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
                        {t('bookingDetail.restaurantName')}
                      </Typography>
                      <Typography variant="body1" sx={{ mt: 0.5, fontSize: '1.1rem' }}>
                        {booking.restaurant?.name || t('bookingDetail.restaurantFallback')}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                {/* Restaurant Phone */}
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <PhoneIcon color="primary" sx={{ mt: 0.5, fontSize: 28 }} />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
                        {t('bookingDetail.phoneNumber')}
                      </Typography>
                      <Typography variant="body1" sx={{ mt: 0.5, fontSize: '1.1rem' }}>
                        {booking.restaurant?.phoneNumber || t('bookingDetail.noPhoneListed')}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                {/* Restaurant Address */}
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <LocationOnIcon color="primary" sx={{ mt: 0.5, fontSize: 28 }} />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
                        {t('bookingDetail.address')}
                      </Typography>
                      <Typography variant="body1" sx={{ mt: 0.5, fontSize: '1.1rem' }}>
                        {booking.restaurant?.address || t('bookingDetail.noAddressListed')}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </>
            ) : (
              <>
                {/* Client Name */}
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <PersonIcon color="primary" sx={{ mt: 0.5, fontSize: 28 }} />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
                        {t('bookingDetail.clientName')}
                      </Typography>
                      <Typography variant="body1" sx={{ mt: 0.5, fontSize: '1.1rem' }}>
                        {booking.client ? `${booking.client.firstName} ${booking.client.lastName}` : t('bookingDetail.clientFallback')}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                {/* Client Phone */}
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <PhoneIcon color="primary" sx={{ mt: 0.5, fontSize: 28 }} />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
                        {t('bookingDetail.phoneNumber')}
                      </Typography>
                      <Typography variant="body1" sx={{ mt: 0.5, fontSize: '1.1rem' }}>
                        {booking.client?.phoneNumber || t('bookingDetail.noPhoneListed')}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </>
            )}
          </Grid>
        </Box>

        {/* Section 3: Employee Confirmation Section (Interactive) */}
        {isConfirming && (
          <>
            <Divider sx={{ my: 4 }} />
            <Box component="form" onSubmit={handleProcessConfirmSubmit}>
              <Typography variant="h6" fontWeight="bold" color="text.secondary" sx={{ mb: 3 }}>
                {t('bookingDetail.assignTable')}
              </Typography>

              <Grid container spacing={3} direction="column">
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                    <Button
                      variant="outlined"
                      color={selectedTable ? 'primary' : 'inherit'}
                      startIcon={<TableBarIcon />}
                      onClick={() => setIsTableDialogOpen(true)}
                      sx={{ textTransform: 'none', fontWeight: 'bold', borderRadius: 2.5 }}
                    >
                      {selectedTable ? t('bookingDetail.changeTable') : t('bookingDetail.chooseTable')}
                    </Button>
                    {selectedTable && (
                      <Chip
                        icon={<TableBarIcon />}
                        label={t('bookingDetail.selectedTableLabel', {
                          name: selectedTable.name,
                          capacity: selectedTable.capacity
                        })}
                        color="primary"
                        variant="outlined"
                      />
                    )}
                  </Box>
                </Grid>
              </Grid>
              <TableSelectionDialog
                open={isTableDialogOpen}
                onClose={() => setIsTableDialogOpen(false)}
                title={t('bookingDetail.tableSelectionDialogTitle')}
                minCapacity={booking.guestCount}
                isSmokingAllowed={booking.isSmoking}
                onSelect={setSelectedTable}
              />

              {/* Action Buttons inside Section */}
              <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-start' }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="success"
                  disabled={isConfirmingSubmit}
                  startIcon={isConfirmingSubmit ? <CircularProgress size={20} color="inherit" /> : <CheckCircleIcon />}
                  sx={{ textTransform: 'none', fontWeight: 'bold', borderRadius: 2.5 }}
                >
                  {t('bookingDetail.confirmBooking')}
                </Button>
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={handleCancelSection}
                  disabled={isConfirmingSubmit}
                  startIcon={<CancelIcon />}
                  sx={{ textTransform: 'none', fontWeight: 'bold', borderRadius: 2.5 }}
                >
                  {t('bookingDetail.cancel')}
                </Button>
              </Box>
            </Box>
          </>
        )}

        {/* Action Button Section for Cancellation & Triggering Confirmation */}
        {!isConfirming && (canCancel || showConfirmButton || (isEmployee && booking.status === BookingStatus.CONFIRMED) || (isEmployee && booking.status === BookingStatus.ARRIVED)) && (
          <>
            <Divider sx={{ my: 4 }} />
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
              {showConfirmButton && (
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<CheckCircleIcon />}
                  onClick={() => setIsConfirming(true)}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 'bold',
                    borderRadius: 3,
                    px: { xs: 4, sm: 6 },
                    py: 1.5,
                    fontSize: '1.1rem',
                    boxShadow: '0px 4px 14px rgba(25, 118, 210, 0.3)',
                    '&:hover': {
                      boxShadow: '0px 6px 20px rgba(25, 118, 210, 0.4)'
                    }
                  }}
                >
                  {t('bookingDetail.processBooking')}
                </Button>
              )}
              {isEmployee && booking.status === BookingStatus.CONFIRMED && (
                <Button
                  variant="contained"
                  color="info"
                  size="large"
                  startIcon={isMarkingArrived ? <CircularProgress size={20} color="inherit" /> : <HowToRegIcon />}
                  onClick={handleArrivedClick}
                  disabled={isMarkingArrived || isCancelling}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 'bold',
                    borderRadius: 3,
                    px: { xs: 4, sm: 6 },
                    py: 1.5,
                    fontSize: '1.1rem',
                    boxShadow: '0px 4px 14px rgba(2, 136, 209, 0.3)',
                    '&:hover': {
                      boxShadow: '0px 6px 20px rgba(2, 136, 209, 0.4)'
                    }
                  }}
                >
                  {t('bookingDetail.markArrived')}
                </Button>
              )}
              {isEmployee && booking.status === BookingStatus.ARRIVED && (
                <Button
                  variant="contained"
                  color="success"
                  size="large"
                  startIcon={isCompleting ? <CircularProgress size={20} color="inherit" /> : <TaskAltIcon />}
                  onClick={handleCompletedClick}
                  disabled={isCompleting}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 'bold',
                    borderRadius: 3,
                    px: { xs: 4, sm: 6 },
                    py: 1.5,
                    fontSize: '1.1rem',
                    boxShadow: '0px 4px 14px rgba(46, 125, 50, 0.3)',
                    '&:hover': {
                      boxShadow: '0px 6px 20px rgba(46, 125, 50, 0.4)'
                    }
                  }}
                >
                  {t('bookingDetail.markCompleted')}
                </Button>
              )}
              {canCancel && (
                <Button
                  variant="contained"
                  color="error"
                  size="large"
                  startIcon={<CancelIcon />}
                  onClick={() => setCancelDialogOpen(true)}
                  disabled={isCancelling || isMarkingArrived || isCompleting}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 'bold',
                    borderRadius: 3,
                    px: { xs: 4, sm: 6 },
                    py: 1.5,
                    fontSize: '1.1rem',
                    boxShadow: '0px 4px 14px rgba(211, 47, 47, 0.3)',
                    '&:hover': {
                      boxShadow: '0px 6px 20px rgba(211, 47, 47, 0.4)'
                    }
                  }}
                >
                  {t('bookingDetail.cancelReservation')}
                </Button>
              )}
            </Box>
          </>
        )}
      </Paper>

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
          {t('bookingDetail.cancelDialogTitle')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="cancel-dialog-description">
            <Trans i18nKey="bookingDetail.cancelDialogBody" values={{ id: booking.id }} components={{ bold: <strong /> }} />
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
            {t('bookingDetail.cancelDialogConfirm')}
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
          {t('bookingDetail.arrivedDialogTitle')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="arrived-dialog-description">
            <Trans i18nKey="bookingDetail.arrivedDialogBody" values={{ id: booking.id }} components={{ bold: <strong /> }} />
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
            {t('bookingDetail.arrivedDialogConfirm')}
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
          {t('bookingDetail.completedDialogTitle')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="completed-dialog-description">
            <Trans i18nKey="bookingDetail.completedDialogBody" values={{ id: booking.id }} components={{ bold: <strong /> }} />
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
            {t('bookingDetail.completedDialogConfirm')}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default BookingDetailPage;
