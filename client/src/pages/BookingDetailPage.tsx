import React, { useState } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useCancelBookingMutation } from '../features/restaurants/restaurantsSlice';
import { addAlert } from '../features/alerts/alertsSlice';
import { getCategoryStyle } from '../utils/categoryColor';
import { BookingStatus } from '../constants';
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
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SmokingRoomsIcon from '@mui/icons-material/SmokingRooms';
import SmokeFreeIcon from '@mui/icons-material/SmokeFree';
import PeopleIcon from '@mui/icons-material/People';
import BadgeIcon from '@mui/icons-material/Badge';
import BusinessIcon from '@mui/icons-material/Business';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CancelIcon from '@mui/icons-material/Cancel';

interface RestaurantContact {
  id: number;
  name: string;
  phoneNumber: string;
  address: string;
}

interface Booking {
  id: number;
  status: string;
  restaurant: RestaurantContact;
  guestCount: number;
  isSmoking: boolean;
  dateTime: string;
}

const getStatusChipColor = (status: string) => {
  switch (status?.toUpperCase()) {
    case BookingStatus.CONFIRMED:
      return 'success';
    case BookingStatus.PENDING:
      return 'warning';
    case BookingStatus.CANCELED:
      return 'error';
    case BookingStatus.ARRIVED:
      return 'info';
    case BookingStatus.COMPLETED:
      return 'primary';
    default:
      return 'default';
  }
};

const BookingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Retrieve booking details from navigation state
  const booking = location.state?.booking as Booking | undefined;

  // States for Cancel Confirmation Dialog
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelBooking, { isLoading: isCancelling }] = useCancelBookingMutation();

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
      navigate('/bookings');
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

  const bookingDate = new Date(booking.dateTime);
  const canCancel = booking.status === BookingStatus.PENDING || booking.status === BookingStatus.CONFIRMED;

  return (
    <Container maxWidth="md" sx={{ mt: { xs: 2, sm: 4 }, mb: { xs: 2, sm: 4 }, px: { xs: 1, sm: 2 } }}>
      <Button
        component={Link}
        to="/bookings"
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 2, textTransform: 'none', fontWeight: 'bold' }}
      >
        Back to Bookings
      </Button>

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
            color={getStatusChipColor(booking.status)}
            variant="outlined"
            sx={{ 
              fontWeight: 'bold', 
              px: 2, 
              py: 0.5, 
              fontSize: '0.85rem', 
              borderRadius: 2,
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

        {/* Section 2: Venue / Restaurant Information */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" fontWeight="bold" color="text.secondary">
              Restaurant Information
            </Typography>
          </Box>
          
          <Grid container spacing={4}>
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

            {/* Restaurant Phone Number */}
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
          </Grid>
        </Box>

        {/* Action Button Section for Cancellation */}
        {canCancel && (
          <>
            <Divider sx={{ my: 4 }} />
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button
                variant="contained"
                color="error"
                size="large"
                startIcon={<CancelIcon />}
                onClick={() => setCancelDialogOpen(true)}
                disabled={isCancelling}
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
            Are you sure you want to cancel your reservation at <strong>{booking?.restaurant?.name}</strong>? This action cannot be undone.
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
    </Container>
  );
};

export default BookingDetailPage;
