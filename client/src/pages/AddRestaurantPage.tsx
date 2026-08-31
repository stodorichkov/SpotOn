import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Chip,
  Grid,
  CircularProgress,
  Avatar
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import AddIcon from '@mui/icons-material/Add';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { RegexConstants } from '../constants';
import { addAlert } from '../features/alerts/alertsSlice';
import { useGetRestaurantFormQuery, useCreateRestaurantMutation } from '../features/restaurants/restaurantsSlice';
import { getCategoryStyle } from '../utils/categoryColor';

const AddRestaurantPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data: availableCategories = [], isLoading, error } = useGetRestaurantFormQuery();
  const [createRestaurant, { isLoading: isCreating }] = useCreateRestaurantMutation();

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const handleSubmit = async (e: React.FormEvent) => {
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
      newErrors.categories = t('addRestaurant.atLeastOneCategory');
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await createRestaurant({
        name: name.trim(),
        address: address.trim(),
        phoneNumber: phoneNumber.trim(),
        categories: selectedCategoryIds
      }).unwrap();

      dispatch(addAlert({
        message: t('addRestaurant.success', { name: name.trim() }),
        type: 'success'
      }));

      navigate('/admin/restaurants');
    } catch (err: any) {
      console.error('Failed to save the restaurant:', err);
      dispatch(addAlert({
        message: err?.data?.message || t('addRestaurant.failure'),
        type: 'error'
      }));
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: { xs: 4, sm: 8 }, mb: 4, px: { xs: 2, sm: 0 } }}>
      <Paper elevation={3} sx={{ p: { xs: 3, sm: 4 }, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar
            sx={{
              m: 1,
              backgroundColor: 'primary.main',
              color: 'primary.contrastText',
              width: 52,
              height: 52
            }}
          >
            <RestaurantIcon sx={{ fontSize: 28 }} />
          </Avatar>

          <Typography component="h1" variant="h5" fontWeight="bold" sx={{ mt: 1 }}>
            {t('addRestaurant.title')}
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 0.5, mb: 3 }}>
            {t('addRestaurant.subtitle')}
          </Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
            <Grid container spacing={1.5}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="name"
                  label={t('addRestaurant.name')}
                  variant="outlined"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors({ ...errors, name: '' });
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
                  label={t('addRestaurant.address')}
                  variant="outlined"
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    if (errors.address) setErrors({ ...errors, address: '' });
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
                  label={t('addRestaurant.phoneNumber')}
                  variant="outlined"
                  value={phoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value);
                    if (errors.phoneNumber) setErrors({ ...errors, phoneNumber: '' });
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
                  {t('addRestaurant.selectCategories')}
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
                  alignItems: isLoading ? 'center' : 'stretch',
                  justifyContent: isLoading ? 'center' : 'flex-start',
                  minHeight: 56
                }}>
                  {isLoading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 1 }}>
                      <CircularProgress size={20} />
                      <Typography variant="body2" color="text.secondary">{t('addRestaurant.loadingCategories')}</Typography>
                    </Box>
                  ) : error ? (
                    <Typography variant="body2" color="error" sx={{ py: 1 }}>{t('addRestaurant.failedLoadCategories')}</Typography>
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
                    <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>{t('addRestaurant.noCategoriesAvailable')}</Typography>
                  )}
                </Box>
                {errors.categories && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5, display: 'block' }}>
                    {errors.categories}
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12} sx={{ mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  startIcon={isCreating ? <CircularProgress size={20} color="inherit" /> : <AddIcon />}
                  disabled={isCreating}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 'bold',
                    py: 1.2,
                    borderRadius: 2,
                    fontSize: '1rem'
                  }}
                >
                  {isCreating ? t('addRestaurant.adding') : t('addRestaurant.addButton')}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default AddRestaurantPage;
