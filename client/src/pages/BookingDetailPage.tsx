import React, { useState } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useCancelBookingMutation, useGetManagerTablesQuery, useConfirmBookingMutation, useArrivedBookingMutation, useCompletedBookingMutation } from '../features/restaurants/restaurantsSlice';
import { addAlert } from '../features/alerts/alertsSlice';
import { BookingStatus, Role } from '../constants';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
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
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText
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
  restaurant?: RestaurantContact; // Present for clients
  client?: ClientContact; // Present for employees
  guestCount: number;
  isSmoking: boolean;
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
  useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { role } = useSelector((state: RootState) => state.auth);

  // Retrieve booking details from navigation state
  const booking = location.state?.booking as Booking | undefined;

  // States for Cancel Confirmation Dialog
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelBooking, { isLoading: isCancelling }] = useCancelBookingMutation();

  // States for Arrived Confirmation Dialog
  const [arrivedDialogOpen, setArrivedDialogOpen] = useState(false);

  // States for Completed Confirmation Dialog
  const [completedDialogOpen, setCompletedDialogOpen] = useState(false);

  // Read confirm flag from navigation state
  const shouldStartInConfirmMode = location.state?.confirm === true;
  const [isConfirming, setIsConfirming] = useState(shouldStartInConfirmMode);

  // States for Employee Booking Confirmation Section
  const [selectedTableId, setSelectedTableId] = useState<number | ''>('');
  const [tableError, setTableError] = useState('');
  const [confirmBooking, { isLoading: isConfirmingSubmit }] = useConfirmBookingMutation();
  const [arrivedBooking, { isLoading: isMarkingArrived }] = useArrivedBookingMutation();
  const [completedBooking, { isLoading: isCompleting }] = useCompletedBookingMutation();

  const handleTableChange = (tableId: number) => {
    setSelectedTableId(tableId);
    setTableError('');
  };

  // Fetch tables dynamically only when confirmation section is opened by Employee
  const { data: tablesData, isLoading: isLoadingTables } = useGetManagerTablesQuery(
    { page: 0, size: 100 },
    { skip: !isConfirming }
  );

  // Handle missing state gracefully if details are unavailable
  if (!booking) {
    return (
      <Container maxWidth="md" sx={{ mt: { xs: 4, sm: 8 }, mb: 4, px: { xs: 2, sm: 0 } }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
          <Typography color="error" variant="h5" fontWeight="bold" gutterBottom>
            Booking Details Unavailable
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Booking details could not be loaded directly. Please select a booking from your portal.
          </Typography>
          <Button
            component={Link}
            to="/bookings"
            variant="contained"
            color="primary"
            sx={{ textTransform: 'none', fontWeight: 'bold', borderRadius: 2 }}
          >
            Go to My Bookings
          </Button>
        </Paper>
      </Container>
    );
  }

  const handleCancelConfirm = async () => {
    try {
      await cancelBooking(booking.id).unwrap();
      dispatch(addAlert({ message: 'Reservation cancelled successfully!', type: 'success' }));
      navigate(backPath);
    } catch (err: any) {
      console.error('Failed to cancel reservation:', err);
      dispatch(addAlert({
        message: err?.data?.message || 'Failed to cancel reservation. Please try again.',
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
      dispatch(addAlert({ message: `Booking #${booking.id} marked as arrived successfully!`, type: 'success' }));
      navigate(backPath);
    } catch (err: any) {
      console.error('Failed to mark as arrived:', err);
      dispatch(addAlert({
        message: err?.data?.message || 'Failed to mark as arrived. Please try again.',
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
      dispatch(addAlert({ message: `Booking #${booking.id} marked as completed successfully!`, type: 'success' }));
      navigate(backPath);
    } catch (err: any) {
      console.error('Failed to mark as completed:', err);
      dispatch(addAlert({
        message: err?.data?.message || 'Failed to mark as completed. Please try again.',
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
    if (selectedTableId === '') {
      dispatch(addAlert({ message: 'Please select a table to confirm.', type: 'error' }));
      return;
    }

    const selectedTable = tablesData?.content.find(t => t.id === selectedTableId);
    if (!selectedTable) return;

    let hasValidationError = false;

    if (selectedTable.capacity < booking.guestCount) {
      setTableError(`Table capacity is too small (${selectedTable.capacity} seats for ${booking.guestCount} guests).`);
      hasValidationError = true;
    } else if (selectedTable.isSmokingAllowed !== booking.isSmoking) {
      setTableError(
        `Smoking policy mismatch (Table is ${selectedTable.isSmokingAllowed ? 'Smoking Allowed' : 'Non-Smoking'}, but reservation requires ${booking.isSmoking ? 'Smoking Allowed' : 'Non-Smoking'}).`
      );
      hasValidationError = true;
    }

    if (hasValidationError) {
      return;
    }

    try {
      await confirmBooking({
        bookingId: booking.id,
        body: { tableId: Number(selectedTableId) }
      }).unwrap();

      dispatch(addAlert({
        message: `Reservation confirmed successfully with table: ${selectedTable.name}!`,
        type: 'success'
      }));
      navigate(backPath);
    } catch (err: any) {
      console.error('Failed to confirm reservation:', err);
      dispatch(addAlert({ 
        message: err?.data?.message || 'Failed to confirm reservation. Please try again.', 
        type: 'error' 
      }));
    }
  };

  const handleCancelSection = () => {
    setIsConfirming(false);
    setSelectedTableId('');
    setTableError('');
    // If we started directly in confirm mode from the bookings list, clicking cancel should take us back
    if (shouldStartInConfirmMode) {
      navigate('/employee/bookings');
    }
  };

  const bookingDate = new Date(booking.dateTime);
  const canCancel = booking.status === BookingStatus.PENDING || booking.status === BookingStatus.CONFIRMED;
  const isEmployee = role === Role.EMPLOYEE || role === Role.MANAGER;
  const showConfirmButton = isEmployee && booking.status === BookingStatus.PENDING && !isConfirming;

  // Dynamic back path based on role
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
                Booking Details
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                Specifications & Reservation Specifications
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
              Reservation Information
            </Typography>
          </Box>
          
          <Grid container spacing={4}>
            {/* Booking ID */}
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <BadgeIcon color="primary" sx={{ mt: 0.5, fontSize: 28 }} />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
                    Booking ID
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
                    Date & Time
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 0.5, fontSize: '1.1rem' }}>
                    {bookingDate.toLocaleDateString(undefined, { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })} at {bookingDate.toLocaleTimeString(undefined, { 
                      hour: '2-digit', 
                      minute: '2-digit' 
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
                    Guests Count
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 0.5, fontSize: '1.1rem' }}>
                    {booking.guestCount} {booking.guestCount === 1 ? 'guest' : 'guests'}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Smoking Policy */}
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                {booking.isSmoking ? (
                  <SmokingRoomsIcon color="success" sx={{ mt: 0.5, fontSize: 28 }} />
                ) : (
                  <SmokeFreeIcon color="action" sx={{ mt: 0.5, fontSize: 28 }} />
                )}
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
                    Smoking Policy
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 0.5, fontSize: '1.1rem' }}>
                    {booking.isSmoking ? 'Smoking Allowed' : 'Non-Smoking'}
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
              {role === Role.CLIENT ? 'Restaurant Information' : 'Client Information'}
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
                        Restaurant Name
                      </Typography>
                      <Typography variant="body1" sx={{ mt: 0.5, fontSize: '1.1rem' }}>
                        {booking.restaurant?.name || 'Restaurant'}
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
                        Phone Number
                      </Typography>
                      <Typography variant="body1" sx={{ mt: 0.5, fontSize: '1.1rem' }}>
                        {booking.restaurant?.phoneNumber || 'No phone listed'}
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
                        Address
                      </Typography>
                      <Typography variant="body1" sx={{ mt: 0.5, fontSize: '1.1rem' }}>
                        {booking.restaurant?.address || 'No address listed'}
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
                        Client Name
                      </Typography>
                      <Typography variant="body1" sx={{ mt: 0.5, fontSize: '1.1rem' }}>
                        {booking.client ? `${booking.client.firstName} ${booking.client.lastName}` : 'Client'}
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
                        Phone Number
                      </Typography>
                      <Typography variant="body1" sx={{ mt: 0.5, fontSize: '1.1rem' }}>
                        {booking.client?.phoneNumber || 'No phone listed'}
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
                Assign Table & Confirm Reservation
              </Typography>

              {isLoadingTables ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2 }}>
                  <CircularProgress size={24} />
                  <Typography variant="body2" color="text.secondary">
                    Loading available tables...
                  </Typography>
                </Box>
              ) : (
                <Grid container spacing={3} direction="column">
                  <Grid item xs={12}>
                    <FormControl required fullWidth error={!!tableError} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}>
                      <InputLabel id="table-select-label">Select Table</InputLabel>
                      <Select
                        labelId="table-select-label"
                        id="table-select"
                        value={selectedTableId}
                        label="Select Table"
                        onChange={(e) => handleTableChange(Number(e.target.value))}
                      >
                        {tablesData?.content.map((table) => (
                          <MenuItem key={table.id} value={table.id}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <TableBarIcon color="primary" fontSize="small" />
                              <Typography variant="body2">
                                {table.name} (Capacity: {table.capacity} {table.capacity === 1 ? 'seat' : 'seats'}) {table.isSmokingAllowed ? '• Smoking' : '• Non-Smoking'}
                              </Typography>
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                      {tableError && <FormHelperText error>{tableError}</FormHelperText>}
                    </FormControl>
                  </Grid>
                </Grid>
              )}

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
                  Confirm Booking
                </Button>
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={handleCancelSection}
                  disabled={isConfirmingSubmit}
                  startIcon={<CancelIcon />}
                  sx={{ textTransform: 'none', fontWeight: 'bold', borderRadius: 2.5 }}
                >
                  Cancel
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
                  Process Booking
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
                  Mark as Arrived
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
                  Mark as Completed
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
                  Cancel Reservation
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
          Cancel Reservation
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="cancel-dialog-description">
            Are you sure you want to cancel reservation <strong>{booking.id}</strong>? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={handleCancelClose} 
            color="inherit" 
            sx={{ textTransform: 'none', fontWeight: 'bold' }}
            disabled={isCancelling}
          >
            Go Back
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
            Cancel Booking
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
          Confirm Guest Arrival
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="arrived-dialog-description">
            Are you sure you want to mark reservation <strong>{booking.id}</strong> as ARRIVED? The guests will be checked in.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={handleArrivedClose} 
            color="inherit" 
            sx={{ textTransform: 'none', fontWeight: 'bold' }}
            disabled={isMarkingArrived}
          >
            Go Back
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
            Confirm Arrival
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
          Complete Reservation
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="completed-dialog-description">
            Are you sure you want to mark reservation <strong>{booking.id}</strong> as COMPLETED? The table will be freed.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={handleCompletedClose} 
            color="inherit" 
            sx={{ textTransform: 'none', fontWeight: 'bold' }}
            disabled={isCompleting}
          >
            Go Back
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
            Complete Booking
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default BookingDetailPage;
