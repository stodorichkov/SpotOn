import React, { useState, useEffect } from 'react';
import { useGetRestaurantProfileQuery, useGetRestaurantFormQuery, useUpdateRestaurantProfileMutation } from '../features/restaurants/restaurantsSlice';
import { useDispatch } from 'react-redux';
import { addAlert } from '../features/alerts/alertsSlice';
import { RegexConstants, MessageConstants } from '../constants';
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
  CircularProgress
} from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import CategoryIcon from '@mui/icons-material/Category';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

const ManagerRestaurantPage: React.FC = () => {
  const dispatch = useDispatch();
  const { data: restaurant, isLoading, error, refetch } = useGetRestaurantProfileQuery();
  const [updateRestaurant, { isLoading: isSaving }] = useUpdateRestaurantProfileMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Query categories only when isEditing is true
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
      newErrors.name = MessageConstants.BLANK_FIELD;
    }
    if (!address.trim()) {
      newErrors.address = MessageConstants.BLANK_FIELD;
    }
    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = MessageConstants.BLANK_FIELD;
    } else if (!RegexConstants.PHONE_NUMBER_REGEX.test(phoneNumber.trim())) {
      newErrors.phoneNumber = MessageConstants.INVALID_PHONE_NUMBER;
    }
    if (selectedCategoryIds.length === 0) {
      newErrors.categories = MessageConstants.NO_CATEGORY;
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

      dispatch(addAlert({ message: 'Restaurant profile updated successfully!', type: 'success' }));
      setIsEditing(false);
      refetch();
    } catch (err: any) {
      console.error('Failed to update restaurant:', err);
      dispatch(addAlert({
        message: err?.data?.message || 'Failed to update restaurant details.',
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
            Error
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Failed to load restaurant profile. Please make sure you are logged in as a manager.
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
              <Typography variant="h4" component="h1" fontWeight="bold" sx={{ fontSize: { xs: '1.5rem', sm: '2.125rem' } }}>
                {isEditing ? 'Edit Restaurant' : restaurant.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                Restaurant Profile & Details
              </Typography>
            </Box>
          </Box>

          {!isEditing && (
            <IconButton onClick={() => setIsEditing(true)} color="primary">
              <EditIcon />
            </IconButton>
          )}
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
                  label="Restaurant Name"
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
                  label="Address"
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
                  label="Phone Number"
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
                  Select Categories
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
                      <Typography variant="body2" color="text.secondary">Loading categories...</Typography>
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
                    <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>No categories available.</Typography>
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
                Save
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
                Cancel
              </Button>
            </Box>
          </Box>
        ) : (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <LocationOnIcon color="primary" sx={{ mt: 0.5, fontSize: 28 }} />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
                    Address
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
                    Phone Number
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
                    Categories
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
                        No categories specified.
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        )}
      </Paper>
    </Container>
  );
};

export default ManagerRestaurantPage;