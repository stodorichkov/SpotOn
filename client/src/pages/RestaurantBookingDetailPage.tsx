import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useGetBookingStatusHistoryQuery, BookingEmployeeResponse } from '../features/restaurants/restaurantsSlice';
import { RootState } from '../store/store';
import { BookingStatus, Role } from '../constants';
import { getIntlLocale } from '../utils/dateLocale';
import { translateBookingStatus, translateRole } from '../utils/enumLabels';
import {
  Container,
  Paper,
  Typography,
  Box,
  Chip,
  Grid,
  Divider,
  Skeleton
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SmokingRoomsIcon from '@mui/icons-material/SmokingRooms';
import SmokeFreeIcon from '@mui/icons-material/SmokeFree';
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import HistoryIcon from '@mui/icons-material/History';

const getStatusStyles = (status: string) => {
  switch (status?.toUpperCase()) {
    case BookingStatus.PENDING:
      return { backgroundColor: '#fff7ed', color: '#ea580c', borderColor: '#ffedd5', fontWeight: 'bold' };
    case BookingStatus.CONFIRMED:
      return { backgroundColor: '#eff6ff', color: '#2563eb', borderColor: '#dbeafe', fontWeight: 'bold' };
    case BookingStatus.ARRIVED:
      return { backgroundColor: '#faf5ff', color: '#9333ea', borderColor: '#f3e8ff', fontWeight: 'bold' };
    case BookingStatus.COMPLETED:
      return { backgroundColor: '#f0fdf4', color: '#16a34a', borderColor: '#dcfce7', fontWeight: 'bold' };
    case BookingStatus.CANCELED:
      return { backgroundColor: '#fef2f2', color: '#dc2626', borderColor: '#fee2e2', fontWeight: 'bold' };
    default:
      return { backgroundColor: '#f3f4f6', color: '#4b5563', borderColor: '#e5e7eb', fontWeight: 'bold' };
  }
};

const RestaurantBookingDetailPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { role: currentRole } = useSelector((state: RootState) => state.auth);
  const { id } = useParams<{ id: string }>();
  const bookingId = Number(id);
  const location = useLocation();
  const booking = location.state?.booking as BookingEmployeeResponse | undefined;

  const { data: history, isLoading: isLoadingHistory, error: historyError } = useGetBookingStatusHistoryQuery(
    bookingId,
    { skip: isNaN(bookingId) }
  );

  const formatDateTime = (value: string) => {
    const date = new Date(value);
    return `${date.toLocaleDateString(getIntlLocale(i18n.language), {
      year: 'numeric', month: 'numeric', day: 'numeric'
    })} ${date.toLocaleTimeString(getIntlLocale(i18n.language), {
      hour: '2-digit', minute: '2-digit', hour12: false
    })}`;
  };

  if (!booking) {
    return (
      <Container maxWidth="md" sx={{ mt: { xs: 2, sm: 4 }, mb: { xs: 2, sm: 4 }, px: { xs: 1, sm: 2 } }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
          <Typography color="error" variant="h6" fontWeight="bold" gutterBottom>
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
    <Container maxWidth="md" sx={{ mt: { xs: 2, sm: 4 }, mb: { xs: 2, sm: 4 }, px: { xs: 1, sm: 2 } }}>
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 3, mb: 3 }}>
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
            <Typography variant="h5" component="h1" fontWeight="bold">
              {t('employeeBookings.bookingDetailsHeading', { id: booking.id })}
            </Typography>
          </Box>
          <Chip
            label={translateBookingStatus(t, booking.status || BookingStatus.PENDING)}
            variant="outlined"
            sx={{ ...getStatusStyles(booking.status), fontWeight: 'bold' }}
          />
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              <PersonIcon color="primary" sx={{ mt: 0.5, fontSize: 28 }} />
              <Box>
                <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
                  {t('employeeBookings.client')}
                </Typography>
                <Typography variant="body1" sx={{ mt: 0.5, fontSize: '1.1rem' }}>
                  {booking.client ? `${booking.client.firstName} ${booking.client.lastName}` : t('employeeBookings.clientFallback')}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              <PhoneIcon color="primary" sx={{ mt: 0.5, fontSize: 28 }} />
              <Box>
                <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
                  {t('userDetails.phoneNumber')}
                </Typography>
                <Typography variant="body1" sx={{ mt: 0.5, fontSize: '1.1rem' }}>
                  {booking.client?.phoneNumber || t('employeeBookings.noPhone')}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              <CalendarMonthIcon color="primary" sx={{ mt: 0.5, fontSize: 28 }} />
              <Box>
                <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
                  {t('employeeBookings.dateAndTime')}
                </Typography>
                <Typography variant="body1" sx={{ mt: 0.5, fontSize: '1.1rem' }}>
                  {formatDateTime(booking.dateTime)}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              <PeopleIcon color="primary" sx={{ mt: 0.5, fontSize: 28 }} />
              <Box>
                <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
                  {t('employeeBookings.guests')}
                </Typography>
                <Typography variant="body1" sx={{ mt: 0.5, fontSize: '1.1rem' }}>
                  {t('employeeBookings.guest', { count: booking.guestCount })}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              {booking.isSmoking === null ? (
                <AllInclusiveIcon color="primary" sx={{ mt: 0.5, fontSize: 28 }} />
              ) : booking.isSmoking ? (
                <SmokingRoomsIcon color="primary" sx={{ mt: 0.5, fontSize: 28 }} />
              ) : (
                <SmokeFreeIcon color="primary" sx={{ mt: 0.5, fontSize: 28 }} />
              )}
              <Box>
                <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
                  {t('employeeBookings.smoking')}
                </Typography>
                <Typography variant="body1" sx={{ mt: 0.5, fontSize: '1.1rem' }}>
                  {booking.isSmoking === null
                    ? t('employeeBookings.smokingAny')
                    : booking.isSmoking
                      ? t('employeeBookings.smokingAllowed')
                      : t('employeeBookings.nonSmoking')}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Status History Section */}
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
          <HistoryIcon color="primary" />
          <Typography variant="h6" fontWeight="bold">
            {t('bookingStatusHistory.title')}
          </Typography>
        </Box>

        {isLoadingHistory ? (
          <Box>
            <Skeleton variant="rectangular" height={40} sx={{ borderRadius: 1, mb: 1 }} />
            <Skeleton variant="rectangular" height={40} sx={{ borderRadius: 1, mb: 1 }} />
            <Skeleton variant="rectangular" height={40} sx={{ borderRadius: 1 }} />
          </Box>
        ) : historyError ? (
          <Typography color="error" variant="body2">
            {t('bookingStatusHistory.errorLoading')}
          </Typography>
        ) : !history || history.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            {t('bookingStatusHistory.noHistory')}
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {history.map((entry) => (
              <Box
                key={entry.id}
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  justifyContent: 'space-between',
                  alignItems: { xs: 'flex-start', sm: 'center' },
                  gap: 1,
                  p: 1.5,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <Chip
                  label={translateBookingStatus(t, entry.status)}
                  size="small"
                  variant="outlined"
                  sx={{ ...getStatusStyles(entry.status), fontSize: '0.75rem', borderWidth: 1, borderStyle: 'solid' }}
                />
                <Typography variant="body2" color="text.secondary">
                  {formatDateTime(entry.changedAt)}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    {entry.changedByFirstName || entry.changedByLastName
                      ? (currentRole === Role.MANAGER
                          ? t('bookingStatusHistory.changedByNameOnly', {
                              firstName: entry.changedByFirstName,
                              lastName: entry.changedByLastName
                            })
                          : t('bookingStatusHistory.changedByName', {
                              firstName: entry.changedByFirstName,
                              lastName: entry.changedByLastName,
                              id: entry.changedByUserId
                            }))
                      : (currentRole === Role.MANAGER
                          ? t('bookingStatusHistory.unknownUser')
                          : t('bookingStatusHistory.changedByUserId', { id: entry.changedByUserId }))}
                  </Typography>
                  {entry.changedByRole && (
                    <Chip
                      label={translateRole(t, entry.changedByRole)}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: '0.7rem' }}
                    />
                  )}
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default RestaurantBookingDetailPage;
