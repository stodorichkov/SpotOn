import React, { useState } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useGetRestaurantByIdQuery, useCreateBookingMutation } from '../features/restaurants/restaurantsSlice';
import { addAlert } from '../features/alerts/alertsSlice';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Divider,
  Button,
  TextField,
  Switch,
  CircularProgress,
  IconButton
} from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SmokingRoomsIcon from '@mui/icons-material/SmokingRooms';
import SmokeFreeIcon from '@mui/icons-material/SmokeFree';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

// Helper to get local date-time string in YYYY-MM-DDTHH:MM format
const getLocalDateTimeString = (date: Date) => {
  const pad = (num: number) => String(num).padStart(2, '0');
  const yyyy = date.getFullYear();
  const MM = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const hh = pad(date.getHours());
  const mm = pad(date.getMinutes());
  return `${yyyy}-${MM}-${dd}T${hh}:${mm}`;
};

const ReservationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const restaurantId = Number(id);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const { data: restaurant, isLoading: isRestaurantLoading, error } = useGetRestaurantByIdQuery(
    restaurantId,
    { skip: isNaN(restaurantId) }
  );

  // Read referring path from router state or fallback to restaurant details
  const fromPath = location.state?.from || `/restaurants/${restaurantId}`;

  const [createBooking, { isLoading: isSubmitting }] = useCreateBookingMutation();

  // Form states matching BookingClientRequest fields
  const [guests, setGuests] = useState<number | ''>(1);
  const [dateTime, setDateTime] = useState(() => getLocalDateTimeString(new Date()));
  const [smoking, setSmoking] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Set today's date-time as min local value
  const minDateTime = getLocalDateTimeString(new Date());

  const handleGuestsChange = (val: string) => {
    const num = val === '' ? '' : Number(val);
    if (num === '' || num >= 1) {
      setGuests(num);
    }
    if (errors.guests) setErrors({ ...errors, guests: '' });
  };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};

    if (guests === '' || Number(guests) < 1) {
      newErrors.guests = 'Please specify at least 1 guest.';
    }

    if (!dateTime) {
      newErrors.dateTime = 'Reservation date and time are required.';
    } else if (new Date(dateTime) <= new Date()) {
      newErrors.dateTime = 'Reservation date and time must be in the future.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      // Construct BookingClientRequest payload (exactly aligned to Spring record)
      const bookingPayload = {
        restaurantId: Number(restaurantId),
        guestCount: Number(guests),
        isSmoking: smoking,
        dateTime: new Date(dateTime).toISOString()
      };
      
      await createBooking(bookingPayload).unwrap();

      dispatch(addAlert({
        message: `Reservation confirmed for ${restaurant?.name || 'the restaurant'} on ${dateTime.replace('T', ' ')}!`,
        type: 'success'
      }));
      
      // Navigate back to referrer path
      navigate(fromPath);
    } catch (err: any) {
      console.error('Reservation failed:', err);
      dispatch(addAlert({
        message: err?.data?.message || 'Failed to process reservation. Please try again.',
        type: 'error'
      }));
    }
  };

  if (isNaN(restaurantId) || error) {
    return (
      <Container maxWidth="md" sx={{ mt: { xs: 4, sm: 8 }, mb: 4, px: { xs: 2, sm: 0 } }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
          <Typography color="error" variant="h5" fontWeight="bold" gutterBottom>
            Error Loading Reservation Form
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            The selected restaurant details could not be found. Please select a restaurant from the home page.
          </Typography>
          <Button
            component={Link}
            to="/"
            variant="contained"
            color="primary"
            sx={{ textTransform: 'none', fontWeight: 'bold', borderRadius: 2 }}
          >
            Go to Home Page
          </Button>
        </Paper>
      </Container>
    );
  }

  // Custom switch icons (matching AddTablePage.tsx)
  const customSwitchIcon = (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 20,
        height: 20,
        borderRadius: '50%',
        backgroundColor: '#ffffff',
        boxShadow: 2,
      }}
    >
      <SmokeFreeIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
    </Box>
  );

  const customSwitchCheckedIcon = (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 20,
        height: 20,
        borderRadius: '50%',
        backgroundColor: '#ffffff',
        boxShadow: 2,
      }}
    >
      <SmokingRoomsIcon sx={{ fontSize: 14, color: 'primary.main' }} />
    </Box>
  );

  return (
    <Container maxWidth="md" sx={{ mt: { xs: 3, sm: 5 }, mb: 6, px: { xs: 1, sm: 2 } }}>
      <Paper elevation={3} sx={{ p: { xs: 3, sm: 5 }, borderRadius: 4 }}>
        {isRestaurantLoading ? (
          <Box sx={{ py: 6, textAlign: 'center' }}>
            <CircularProgress size={50} />
            <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
              Loading restaurant details...
            </Typography>
          </Box>
        ) : restaurant ? (
          <Box component="form" onSubmit={handleConfirm} noValidate>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                  borderRadius: '50%',
                  width: 50,
                  height: 50,
                  flexShrink: 0
                }}
              >
                <CalendarMonthIcon />
              </Box>
              <Box>
                <Typography variant="h4" component="h1" fontWeight="bold" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                  Book a Table at {restaurant.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Please fill in the form below to secure your reservation
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ mb: 4 }} />

            <Grid container spacing={3.5} direction="column">
              {/* Guests Count (Capacity picker style) */}
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="guests"
                  label="Number of Guests"
                  type="number"
                  value={guests}
                  onChange={(e) => handleGuestsChange(e.target.value)}
                  error={!!errors.guests}
                  helperText={errors.guests}
                  inputProps={{ 
                    min: 1, 
                    style: { textAlign: 'center' } 
                  }}
                  InputProps={{
                    startAdornment: (
                      <IconButton
                        onClick={() => {
                          setGuests((prev) => {
                            const current = prev === '' ? 1 : Number(prev);
                            return current > 1 ? current - 1 : 1;
                          });
                          if (errors.guests) setErrors({ ...errors, guests: '' });
                        }}
                        disabled={guests !== '' && Number(guests) <= 1}
                        size="small"
                        sx={{ color: 'text.secondary' }}
                      >
                        <RemoveIcon />
                      </IconButton>
                    ),
                    endAdornment: (
                      <IconButton
                        onClick={() => {
                          setGuests((prev) => (prev === '' ? 1 : Number(prev) + 1));
                          if (errors.guests) setErrors({ ...errors, guests: '' });
                        }}
                        size="small"
                        sx={{ color: 'text.secondary' }}
                      >
                        <AddIcon />
                      </IconButton>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2.5,
                    },
                    '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                      display: 'none',
                    },
                    '& input[type=number]': {
                      MozAppearance: 'textfield',
                    },
                  }}
                />
              </Grid>

              {/* Smoking Switch */}
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    px: 1,
                    py: 1,
                  }}
                >
                  <Typography variant="body1" color="text.secondary">
                    Smoking Allowed
                  </Typography>
                  <Switch
                    checked={smoking}
                    onChange={(e) => setSmoking(e.target.checked)}
                    color="primary"
                    icon={customSwitchIcon}
                    checkedIcon={customSwitchCheckedIcon}
                    sx={{
                      transform: 'scale(1.4)',
                      marginRight: 1,
                    }}
                  />
                </Box>
              </Grid>

              {/* Combined Date & Time Input */}
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="dateTime"
                  label="Reservation Date & Time"
                  type="datetime-local"
                  value={dateTime}
                  onChange={(e) => {
                    setDateTime(e.target.value);
                    if (errors.dateTime) setErrors({ ...errors, dateTime: '' });
                  }}
                  error={!!errors.dateTime}
                  helperText={errors.dateTime}
                  inputProps={{ min: minDateTime }}
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2.5,
                    }
                  }}
                />
              </Grid>
            </Grid>

            {/* Buttons Aligned Left */}
            <Box sx={{ mt: 5, display: 'flex', gap: 2, justifyContent: 'flex-start' }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <CalendarMonthIcon />}
                sx={{ 
                  textTransform: 'none', 
                  fontWeight: 'bold', 
                  borderRadius: 2.5,
                  px: 4,
                  py: 1
                }}
              >
                Confirm Reservation
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                component={Link}
                to={fromPath}
                sx={{ 
                  textTransform: 'none', 
                  fontWeight: 'bold', 
                  borderRadius: 2.5,
                  px: 4,
                  py: 1
                }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        ) : null}
      </Paper>
    </Container>
  );
};

export default ReservationPage;
