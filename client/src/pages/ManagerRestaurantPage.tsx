import React, { useState, useEffect } from 'react';
import {
  useGetRestaurantProfileQuery,
  useGetRestaurantFormQuery,
  useUpdateRestaurantProfileMutation,
  useUpdateRestaurantStatusMutation,
  useUploadRestaurantImageMutation,
  useDeleteRestaurantImageMutation,
  useUpdateWorkingHoursMutation,
  useUpdateReservationDurationMutation,
  DayOfWeek,
  WorkingHoursEntry
} from '../features/restaurants/restaurantsSlice';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { addAlert } from '../features/alerts/alertsSlice';
import { RegexConstants } from '../constants';
import { getCategoryStyle } from '../utils/categoryColor';
import {
  Container,
  Paper,
  Typography,
  Box,
  Chip,
  Grid,
  Skeleton,
  Divider,
  IconButton,
  TextField,
  Button,
  CircularProgress,
  ToggleButtonGroup,
  ToggleButton,
  Switch,
  FormControlLabel
} from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import CategoryIcon from '@mui/icons-material/Category';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import DeleteIcon from '@mui/icons-material/Delete';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { bg } from 'date-fns/locale/bg';
import { enGB } from 'date-fns/locale/en-GB';
import { format } from 'date-fns';
import { DAYS_OF_WEEK, formatWorkingHoursTime } from '../utils/workingHours';

interface WorkingHoursDraftEntry {
  dayOfWeek: DayOfWeek;
  closed: boolean;
  openTime: Date | null;
  closeTime: Date | null;
}

const timeStringToDate = (time: string | null | undefined): Date | null => {
  if (!time) return null;
  const [hours, minutes] = time.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
};

const dateToTimeString = (date: Date | null): string | null => {
  if (!date) return null;
  return format(date, 'HH:mm');
};

const buildWorkingHoursDraft = (existing?: WorkingHoursEntry[]): WorkingHoursDraftEntry[] => {
  return DAYS_OF_WEEK.map((day) => {
    const found = existing?.find((entry) => entry.dayOfWeek === day);
    if (found) {
      return {
        dayOfWeek: day,
        closed: found.closed,
        openTime: timeStringToDate(found.openTime),
        closeTime: timeStringToDate(found.closeTime)
      };
    }
    return {
      dayOfWeek: day,
      closed: false,
      openTime: timeStringToDate('09:00'),
      closeTime: timeStringToDate('18:00')
    };
  });
};

const ManagerRestaurantPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { data: restaurant, isLoading, error, refetch } = useGetRestaurantProfileQuery();
  const [updateRestaurant, { isLoading: isSaving }] = useUpdateRestaurantProfileMutation();
  const [updateRestaurantStatus, { isLoading: isUpdatingStatus }] = useUpdateRestaurantStatusMutation();
  const [updateWorkingHours, { isLoading: isSavingHours }] = useUpdateWorkingHoursMutation();
  const [updateReservationDuration, { isLoading: isSavingDuration }] = useUpdateReservationDurationMutation();
  const [uploadRestaurantImage, { isLoading: isUploadingImage }] = useUploadRestaurantImageMutation();
  const [deleteRestaurantImage, { isLoading: isDeletingImage }] = useDeleteRestaurantImageMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [isEditingHours, setIsEditingHours] = useState(false);
  const [workingHoursDraft, setWorkingHoursDraft] = useState<WorkingHoursDraftEntry[]>([]);
  const [hoursErrors, setHoursErrors] = useState<Record<string, string>>({});

  const [isEditingDuration, setIsEditingDuration] = useState(false);
  const [durationInput, setDurationInput] = useState('');
  const [durationError, setDurationError] = useState('');

  const { data: availableCategories = [], isLoading: isLoadingCategories } = useGetRestaurantFormQuery(
    undefined,
    { skip: !isEditing }
  );

  useEffect(() => {
    if (restaurant) {
      setName(restaurant.name || '');
      setAddress(restaurant.address || '');
      setPhoneNumber(restaurant.phoneNumber || '');
      setSelectedCategoryIds(restaurant.categories?.map((cat) => cat.id) || []);
    }
  }, [restaurant]);

  const handleToggleCategory = (catId: number) => {
    let nextCategoryIds;
    if (selectedCategoryIds.includes(catId)) {
      nextCategoryIds = selectedCategoryIds.filter((id) => id !== catId);
    } else {
      nextCategoryIds = [...selectedCategoryIds, catId];
    }
    setSelectedCategoryIds(nextCategoryIds);
    if (nextCategoryIds.length > 0 && errors.categories) {
      setErrors({ ...errors, categories: '' });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = t('validation.blankField');
    }
    if (!address.trim()) {
      newErrors.address = t('validation.blankField');
    }
    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = t('validation.blankField');
    } else if (!RegexConstants.PHONE_NUMBER_REGEX.test(phoneNumber.trim())) {
      newErrors.phoneNumber = t('validation.invalidPhoneNumber');
    }
    if (selectedCategoryIds.length === 0) {
      newErrors.categories = t('validation.noCategory');
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await updateRestaurant({
        name: name.trim(),
        address: address.trim(),
        phoneNumber: phoneNumber.trim(),
        categories: selectedCategoryIds
      }).unwrap();

      dispatch(addAlert({ message: t('managerRestaurant.success'), type: 'success' }));
      setIsEditing(false);
      refetch();
    } catch (err: any) {
      console.error('Failed to update restaurant:', err);
      dispatch(addAlert({
        message: err?.data?.message || t('managerRestaurant.failure'),
        type: 'error'
      }));
    }
  };

  const handleToggleStatus = async (isOpen: boolean) => {
    try {
      await updateRestaurantStatus({ isOpen }).unwrap();
      dispatch(addAlert({
        message: isOpen ? t('managerRestaurant.statusOpenSuccess') : t('managerRestaurant.statusClosedSuccess'),
        type: 'success'
      }));
      refetch();
    } catch (err: any) {
      console.error('Failed to update restaurant status:', err);
      dispatch(addAlert({
        message: err?.data?.message || t('managerRestaurant.statusFailure'),
        type: 'error'
      }));
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      await uploadRestaurantImage(formData).unwrap();
      dispatch(addAlert({ message: t('managerRestaurant.imageUploadSuccess'), type: 'success' }));
      refetch();
    } catch (err: any) {
      console.error('Failed to upload restaurant image:', err);
      dispatch(addAlert({
        message: err?.data?.message || t('managerRestaurant.imageUploadFailure'),
        type: 'error'
      }));
    }
  };

  const handleDeleteImage = async (imageId: number) => {
    try {
      await deleteRestaurantImage(imageId).unwrap();
      dispatch(addAlert({ message: t('managerRestaurant.imageDeleteSuccess'), type: 'success' }));
      refetch();
    } catch (err: any) {
      console.error('Failed to delete restaurant image:', err);
      dispatch(addAlert({
        message: err?.data?.message || t('managerRestaurant.imageDeleteFailure'),
        type: 'error'
      }));
    }
  };

  const handleStartEditHours = () => {
    setWorkingHoursDraft(buildWorkingHoursDraft(restaurant?.workingHours));
    setHoursErrors({});
    setIsEditingHours(true);
  };

  const handleCancelEditHours = () => {
    setIsEditingHours(false);
    setHoursErrors({});
  };

  const handleDayClosedChange = (day: DayOfWeek, closed: boolean) => {
    setWorkingHoursDraft((prev) => prev.map((entry) => (entry.dayOfWeek === day ? { ...entry, closed } : entry)));
    if (hoursErrors[day]) {
      setHoursErrors((prev) => ({ ...prev, [day]: '' }));
    }
  };

  const handleDayTimeChange = (day: DayOfWeek, field: 'openTime' | 'closeTime', value: Date | null) => {
    setWorkingHoursDraft((prev) => prev.map((entry) => (entry.dayOfWeek === day ? { ...entry, [field]: value } : entry)));
    if (hoursErrors[day]) {
      setHoursErrors((prev) => ({ ...prev, [day]: '' }));
    }
  };

  const handleSaveWorkingHours = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    workingHoursDraft.forEach((entry) => {
      if (!entry.closed) {
        if (!entry.openTime || !entry.closeTime) {
          newErrors[entry.dayOfWeek] = t('validation.blankField');
        } else if (entry.openTime.getTime() >= entry.closeTime.getTime()) {
          newErrors[entry.dayOfWeek] = t('managerRestaurant.invalidWorkingHoursRange');
        }
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setHoursErrors(newErrors);
      return;
    }

    try {
      await updateWorkingHours({
        workingHours: workingHoursDraft.map((entry) => ({
          dayOfWeek: entry.dayOfWeek,
          closed: entry.closed,
          openTime: entry.closed ? null : dateToTimeString(entry.openTime),
          closeTime: entry.closed ? null : dateToTimeString(entry.closeTime)
        }))
      }).unwrap();

      dispatch(addAlert({ message: t('managerRestaurant.workingHoursSuccess'), type: 'success' }));
      setIsEditingHours(false);
      refetch();
    } catch (err: any) {
      console.error('Failed to update working hours:', err);
      dispatch(addAlert({
        message: err?.data?.message || err?.data || t('managerRestaurant.workingHoursFailure'),
        type: 'error'
      }));
    }
  };

  const handleStartEditDuration = () => {
    setDurationInput(restaurant ? String(restaurant.reservationDurationMinutes) : '');
    setDurationError('');
    setIsEditingDuration(true);
  };

  const handleCancelEditDuration = () => {
    setIsEditingDuration(false);
    setDurationError('');
  };

  const handleSaveDuration = async (e: React.FormEvent) => {
    e.preventDefault();
    const minutes = Number(durationInput);

    if (!durationInput.trim() || !Number.isInteger(minutes) || minutes < 1) {
      setDurationError(t('managerRestaurant.invalidReservationDuration'));
      return;
    }

    try {
      await updateReservationDuration({ reservationDurationMinutes: minutes }).unwrap();
      dispatch(addAlert({ message: t('managerRestaurant.reservationDurationSuccess'), type: 'success' }));
      setIsEditingDuration(false);
      refetch();
    } catch (err: any) {
      console.error('Failed to update reservation duration:', err);
      dispatch(addAlert({
        message: err?.data?.message || t('managerRestaurant.reservationDurationFailure'),
        type: 'error'
      }));
    }
  };

  const hasChanges = restaurant && (
    name.trim() !== (restaurant.name || '') ||
    address.trim() !== (restaurant.address || '') ||
    phoneNumber.trim() !== (restaurant.phoneNumber || '') ||
    JSON.stringify([...selectedCategoryIds].sort()) !== JSON.stringify(restaurant.categories?.map(c => c.id).sort())
  );

  if (isLoading) {
    return (
      <Container maxWidth="md" sx={{ mt: { xs: 2, sm: 4 }, mb: { xs: 2, sm: 4 }, px: { xs: 1, sm: 2 } }}>
        <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Skeleton variant="circular" width={60} height={60} />
            <Box sx={{ width: '100%' }}>
              <Skeleton variant="text" width="60%" height={40} />
              <Skeleton variant="text" width="40%" height={25} />
            </Box>
          </Box>
          <Divider sx={{ mb: 3 }} />
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 2 }} />
            </Grid>
            <Grid item xs={12}>
              <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 2 }} />
            </Grid>
            <Grid item xs={12}>
              <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 2 }} />
            </Grid>
          </Grid>
        </Paper>
      </Container>
    );
  }

  if (error || !restaurant) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
          <Typography color="error" variant="h5" fontWeight="bold" gutterBottom>
            {t('common.error')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t('managerRestaurant.errorLoading')}
          </Typography>
        </Paper>
      </Container>
    );
  }

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
              <RestaurantIcon sx={{ fontSize: { xs: 28, sm: 32 } }} />
            </Box>
            <Box>
              <Typography variant="h5" component="h1" fontWeight="bold" sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }}>
                {restaurant.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                {t('managerRestaurant.subtitle')}
              </Typography>
            </Box>
          </Box>

          <ToggleButtonGroup
            value={restaurant.isOpen ? 'open' : 'closed'}
            exclusive
            onChange={(e, value) => {
              if (value !== null) {
                handleToggleStatus(value === 'open');
              }
            }}
            disabled={isUpdatingStatus}
            size="small"
          >
            <ToggleButton
              value="open"
              sx={{
                textTransform: 'none',
                fontWeight: 'bold',
                px: 2,
                '&.Mui-selected': { backgroundColor: 'success.main', color: 'success.contrastText', '&:hover': { backgroundColor: 'success.dark' } }
              }}
            >
              {t('managerRestaurant.statusOpen')}
            </ToggleButton>
            <ToggleButton
              value="closed"
              sx={{
                textTransform: 'none',
                fontWeight: 'bold',
                px: 2,
                '&.Mui-selected': { backgroundColor: 'error.main', color: 'error.contrastText', '&:hover': { backgroundColor: 'error.dark' } }
              }}
            >
              {t('managerRestaurant.statusClosed')}
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" fontWeight="bold" color="text.secondary" sx={{ alignSelf: 'flex-start', mb: 2 }}>
            {t('managerRestaurant.imagesTitle')}
          </Typography>

          {restaurant.images?.[0] ? (
            <Box
              component="img"
              src={restaurant.images[0].url}
              alt={restaurant.name}
              sx={{ width: '100%', maxHeight: 280, objectFit: 'cover', borderRadius: 2 }}
            />
          ) : (
            <Box
              sx={{
                width: '100%',
                height: 280,
                borderRadius: 2,
                backgroundColor: 'action.hover',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'text.secondary'
              }}
            >
              <RestaurantIcon sx={{ fontSize: 64, opacity: 0.5 }} />
            </Box>
          )}

          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
            <Button
              component="label"
              variant={restaurant.images?.[0] ? 'outlined' : 'contained'}
              color="primary"
              startIcon={isUploadingImage ? <CircularProgress size={16} color="inherit" /> : <PhotoCameraIcon />}
              disabled={isUploadingImage}
              sx={{ textTransform: 'none', fontWeight: 'bold', borderRadius: 2 }}
            >
              {restaurant.images?.[0] ? t('managerRestaurant.changeImage') : t('managerRestaurant.uploadImage')}
              <input hidden accept="image/*" type="file" onChange={handleImageChange} />
            </Button>
            {restaurant.images?.[0] && (
              <Button
                variant="outlined"
                color="error"
                startIcon={isDeletingImage ? <CircularProgress size={16} color="inherit" /> : <DeleteIcon />}
                disabled={isDeletingImage}
                onClick={() => handleDeleteImage(restaurant.images[0].id)}
                sx={{ textTransform: 'none', fontWeight: 'bold', borderRadius: 2 }}
              >
                {t('managerRestaurant.removeImage')}
              </Button>
            )}
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {isEditing ? (
          <Box component="form" onSubmit={handleSave} noValidate>
            <Grid container spacing={1.5}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="name"
                  label={t('managerRestaurant.name')}
                  variant="outlined"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                  }}
                  error={!!errors.name}
                  helperText={errors.name}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2.5,
                      transition: 'all 0.2s',
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="address"
                  label={t('managerRestaurant.address')}
                  variant="outlined"
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    if (errors.address) setErrors((prev) => ({ ...prev, address: '' }));
                  }}
                  error={!!errors.address}
                  helperText={errors.address}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2.5,
                      transition: 'all 0.2s',
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="phoneNumber"
                  label={t('managerRestaurant.phoneNumber')}
                  variant="outlined"
                  value={phoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value);
                    if (errors.phoneNumber) setErrors((prev) => ({ ...prev, phoneNumber: '' }));
                  }}
                  error={!!errors.phoneNumber}
                  helperText={errors.phoneNumber}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2.5,
                      transition: 'all 0.2s',
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1, color: 'text.secondary', ml: 0.5 }}>
                  {t('managerRestaurant.selectCategories')}
                </Typography>
                <Box sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 1,
                  maxHeight: 130,
                  overflowY: 'auto',
                  p: 1.5,
                  border: '1px solid',
                  borderColor: errors.categories ? 'error.main' : 'divider',
                  borderRadius: 2.5,
                  backgroundColor: 'background.paper',
                  transition: 'border-color 0.2s',
                  alignItems: isLoadingCategories ? 'center' : 'stretch',
                  justifyContent: isLoadingCategories ? 'center' : 'flex-start',
                  minHeight: 56
                }}>
                  {isLoadingCategories ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 1 }}>
                      <CircularProgress size={20} />
                      <Typography variant="body2" color="text.secondary">{t('managerRestaurant.loadingCategories')}</Typography>
                    </Box>
                  ) : availableCategories && availableCategories.length > 0 ? (
                    availableCategories.map((cat) => {
                      const isSelected = selectedCategoryIds.includes(cat.id);
                      return (
                        <Chip
                          key={cat.id}
                          label={cat.name}
                          onClick={() => handleToggleCategory(cat.id)}
                          variant="outlined"
                          sx={{
                            ...(isSelected ? getCategoryStyle(cat.name) : { borderColor: 'divider', color: 'text.secondary' }),
                            fontWeight: isSelected ? 'bold' : 'normal',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            '&:hover': {
                              transform: 'scale(1.05)',
                            }
                          }}
                        />
                      );
                    })
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>{t('managerRestaurant.noCategoriesAvailable')}</Typography>
                  )}
                </Box>
                {errors.categories && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5, display: 'block' }}>
                    {errors.categories}
                  </Typography>
                )}
              </Grid>
            </Grid>

            <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
              <Button
                type="submit"
                startIcon={isSaving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                disabled={isSaving || !hasChanges}
                variant="contained"
                color="primary"
                sx={{ textTransform: 'none', fontWeight: 'bold', borderRadius: 2 }}
              >
                {t('managerRestaurant.save')}
              </Button>
              <Button
                startIcon={<CancelIcon />}
                onClick={() => {
                  setIsEditing(false);
                  setName(restaurant.name || '');
                  setAddress(restaurant.address || '');
                  setPhoneNumber(restaurant.phoneNumber || '');
                  setSelectedCategoryIds(restaurant.categories?.map((cat) => cat.id) || []);
                  setErrors({});
                }}
                variant="outlined"
                color="inherit"
                disabled={isSaving}
                sx={{ textTransform: 'none', fontWeight: 'bold', borderRadius: 2 }}
              >
                {t('managerRestaurant.cancel')}
              </Button>
            </Box>
          </Box>
        ) : (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" fontWeight="bold" color="text.secondary">
                {t('managerRestaurant.detailsTitle')}
              </Typography>
              <IconButton
                onClick={() => setIsEditing(true)}
                color="primary"
              >
                <EditIcon />
              </IconButton>
            </Box>
            <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <RestaurantIcon color="primary" sx={{ mt: 0.5, fontSize: 28 }} />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
                    {t('managerRestaurant.name')}
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 0.5, fontSize: '1.1rem' }}>
                    {restaurant.name}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <LocationOnIcon color="primary" sx={{ mt: 0.5, fontSize: 28 }} />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
                    {t('managerRestaurant.address')}
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 0.5, fontSize: '1.1rem' }}>
                    {restaurant.address}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <PhoneIcon color="primary" sx={{ mt: 0.5, fontSize: 28 }} />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
                    {t('managerRestaurant.phoneNumber')}
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 0.5, fontSize: '1.1rem' }}>
                    {restaurant.phoneNumber}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <CategoryIcon color="primary" sx={{ mt: 0.5, fontSize: 28 }} />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" fontWeight="bold" sx={{ mb: 1 }}>
                    {t('managerRestaurant.categories')}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {restaurant.categories && restaurant.categories.length > 0 ? (
                      restaurant.categories.map((category) => (
                        <Chip
                          key={category.id}
                          label={category.name}
                          sx={{ ...getCategoryStyle(category.name), fontWeight: 'bold' }}
                        />
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        {t('managerRestaurant.noCategoriesSpecified')}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Box>
            </Grid>
            </Grid>
          </Box>
        )}

        <Divider sx={{ my: 3 }} />

        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" fontWeight="bold" color="text.secondary">
              {t('managerRestaurant.workingHoursTitle')}
            </Typography>
            {!isEditingHours && (
              <IconButton onClick={handleStartEditHours} color="primary">
                <EditIcon />
              </IconButton>
            )}
          </Box>

          {isEditingHours ? (
            <Box component="form" onSubmit={handleSaveWorkingHours} noValidate>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={i18n.language === 'bg' ? bg : enGB}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {workingHoursDraft.map((entry) => (
                    <Box
                      key={entry.dayOfWeek}
                      sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: { xs: 'stretch', sm: 'center' },
                        gap: { xs: 1, sm: 2 },
                        p: 1.5,
                        borderRadius: 2.5,
                        backgroundColor: 'action.hover'
                      }}
                    >
                      <Typography sx={{ width: { sm: 130 }, fontWeight: 'bold', flexShrink: 0 }}>
                        {t(`managerRestaurant.days.${entry.dayOfWeek.toLowerCase()}`)}
                      </Typography>

                      <FormControlLabel
                        sx={{ ml: 0, flexShrink: 0 }}
                        control={
                          <Switch
                            checked={!entry.closed}
                            onChange={(e) => handleDayClosedChange(entry.dayOfWeek, !e.target.checked)}
                            color="success"
                          />
                        }
                        label={entry.closed ? t('managerRestaurant.statusClosed') : t('managerRestaurant.statusOpen')}
                      />

                      {!entry.closed && (
                        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                          <TimePicker
                            label={t('managerRestaurant.openTimeLabel')}
                            value={entry.openTime}
                            onChange={(value) => handleDayTimeChange(entry.dayOfWeek, 'openTime', value)}
                            ampm={false}
                            slotProps={{ textField: { size: 'small', sx: { width: 130 } } }}
                          />
                          <TimePicker
                            label={t('managerRestaurant.closeTimeLabel')}
                            value={entry.closeTime}
                            onChange={(value) => handleDayTimeChange(entry.dayOfWeek, 'closeTime', value)}
                            ampm={false}
                            slotProps={{ textField: { size: 'small', sx: { width: 130 } } }}
                          />
                        </Box>
                      )}

                      {hoursErrors[entry.dayOfWeek] && (
                        <Typography variant="caption" color="error">
                          {hoursErrors[entry.dayOfWeek]}
                        </Typography>
                      )}
                    </Box>
                  ))}
                </Box>
              </LocalizationProvider>

              <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
                <Button
                  type="submit"
                  startIcon={isSavingHours ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                  disabled={isSavingHours}
                  variant="contained"
                  color="primary"
                  sx={{ textTransform: 'none', fontWeight: 'bold', borderRadius: 2 }}
                >
                  {t('managerRestaurant.save')}
                </Button>
                <Button
                  startIcon={<CancelIcon />}
                  onClick={handleCancelEditHours}
                  variant="outlined"
                  color="inherit"
                  disabled={isSavingHours}
                  sx={{ textTransform: 'none', fontWeight: 'bold', borderRadius: 2 }}
                >
                  {t('managerRestaurant.cancel')}
                </Button>
              </Box>
            </Box>
          ) : (
            <Grid container spacing={1.5}>
              {DAYS_OF_WEEK.map((day) => {
                const entry = restaurant.workingHours?.find((item) => item.dayOfWeek === day);
                const isClosed = !entry || entry.closed;
                return (
                  <Grid item xs={12} sm={6} key={day}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <AccessTimeIcon color="primary" sx={{ fontSize: 22 }} />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <Typography variant="body2" fontWeight="bold">
                          {t(`managerRestaurant.days.${day.toLowerCase()}`)}
                        </Typography>
                        <Typography variant="body2" color={isClosed ? 'error.main' : 'text.secondary'}>
                          {isClosed ? t('managerRestaurant.statusClosed') : `${formatWorkingHoursTime(entry!.openTime)} - ${formatWorkingHoursTime(entry!.closeTime)}`}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" fontWeight="bold" color="text.secondary">
              {t('managerRestaurant.reservationDurationTitle')}
            </Typography>
            {!isEditingDuration && (
              <IconButton onClick={handleStartEditDuration} color="primary">
                <EditIcon />
              </IconButton>
            )}
          </Box>

          {isEditingDuration ? (
            <Box component="form" onSubmit={handleSaveDuration} noValidate>
              <TextField
                required
                fullWidth
                type="number"
                label={t('managerRestaurant.reservationDurationLabel')}
                value={durationInput}
                onChange={(e) => {
                  setDurationInput(e.target.value);
                  if (durationError) setDurationError('');
                }}
                error={!!durationError}
                helperText={durationError}
                inputProps={{ min: 1 }}
                sx={{ maxWidth: 360, '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
              />
              <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
                <Button
                  type="submit"
                  startIcon={isSavingDuration ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                  disabled={isSavingDuration}
                  variant="contained"
                  color="primary"
                  sx={{ textTransform: 'none', fontWeight: 'bold', borderRadius: 2 }}
                >
                  {t('managerRestaurant.save')}
                </Button>
                <Button
                  startIcon={<CancelIcon />}
                  onClick={handleCancelEditDuration}
                  variant="outlined"
                  color="inherit"
                  disabled={isSavingDuration}
                  sx={{ textTransform: 'none', fontWeight: 'bold', borderRadius: 2 }}
                >
                  {t('managerRestaurant.cancel')}
                </Button>
              </Box>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              <HourglassBottomIcon color="primary" sx={{ mt: 0.5, fontSize: 28 }} />
              <Box>
                <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
                  {t('managerRestaurant.reservationDurationLabel')}
                </Typography>
                <Typography variant="body1" sx={{ mt: 0.5, fontSize: '1.1rem' }}>
                  {restaurant.reservationDurationMinutes}
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default ManagerRestaurantPage;
