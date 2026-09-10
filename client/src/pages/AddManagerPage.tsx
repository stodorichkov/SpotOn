import React, { useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { useRegisterManagerMutation } from '../features/auth/authApi';
import { addAlert } from '../features/alerts/alertsSlice';
import { RegexConstants } from '../constants';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  CircularProgress,
  Avatar
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const AddManagerPage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const restaurantId = Number(id);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [registerManager, { isLoading: registering }] = useRegisterManagerMutation();

  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errors, setErrors] = useState<{ email?: string; firstName?: string; lastName?: string; phoneNumber?: string }>({});

  const validationSchema = useMemo(() => yup.object({
    email: yup
      .string()
      .required(t('validation.blankField'))
      .email(t('validation.invalidEmail')),
    firstName: yup
      .string()
      .required(t('validation.blankField'))
      .test('firstName-format', t('validation.invalidName'), (value) => {
        if (!value) return true;
        return RegexConstants.NAME_REGEX.test(value);
      }),
    lastName: yup
      .string()
      .required(t('validation.blankField'))
      .test('lastName-format', t('validation.invalidName'), (value) => {
        if (!value) return true;
        return RegexConstants.NAME_REGEX.test(value);
      }),
    phoneNumber: yup
      .string()
      .required(t('validation.blankField'))
      .test('phoneNumber-format', t('validation.invalidPhoneNumber'), (value) => {
        if (!value) return true;
        return RegexConstants.PHONE_NUMBER_REGEX.test(value);
      }),
  }), [t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formState = { email, firstName, lastName, phoneNumber };

    try {
      await validationSchema.validate(formState, { abortEarly: false });
      setErrors({});
    } catch (err) {
      const validationError = err as yup.ValidationError;
      if (validationError.inner) {
        const formattedErrors: typeof errors = {};
        validationError.inner.forEach((error) => {
          if (error.path) {
            formattedErrors[error.path as keyof typeof errors] = error.message;
          }
        });
        setErrors(formattedErrors);
      }
      return;
    }

    try {
      const trimmedEmail = email.trim();
      await registerManager({
        employeeData: {
          email: trimmedEmail,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          phoneNumber: phoneNumber.trim(),
        },
        restaurantId,
      }).unwrap();

      dispatch(addAlert({ message: t('addManager.success'), type: 'success' }));
      navigate(`/admin/restaurants/${restaurantId}/employees`);
    } catch (err: any) {
      console.error('Failed to register manager:', err);
      dispatch(addAlert({
        message: err?.data?.message || t('addManager.failure'),
        type: 'error'
      }));
    }
  };

  if (isNaN(restaurantId)) {
    return (
      <Container maxWidth="xs" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
          <Typography color="error" variant="h6" fontWeight="bold" gutterBottom>
            {t('common.error')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t('addManager.invalidRestaurantId')}
          </Typography>
          <Button component={Link} to="/admin/restaurants" startIcon={<ArrowBackIcon />} sx={{ mt: 2, textTransform: 'none', fontWeight: 'bold' }}>
            {t('addManager.backToRestaurants')}
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="xs" sx={{ mt: { xs: 4, sm: 8 }, mb: 4, px: { xs: 2, sm: 0 } }}>
      <Paper elevation={3} sx={{ p: { xs: 3, sm: 4 }, borderRadius: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar
              sx={{
                m: 1,
                backgroundColor: 'warning.main',
                color: 'warning.contrastText',
                width: 52,
                height: 52
              }}
            >
              <PersonAddIcon sx={{ fontSize: 28 }} />
            </Avatar>

            <Typography component="h1" variant="h5" fontWeight="bold" sx={{ mt: 1 }}>
              {t('addManager.title')}
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 0.5, mb: 3 }}>
              {t('addManager.subtitle')}
            </Typography>

            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
              <Grid container spacing={1.5}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label={t('addManager.email')}
                    variant="outlined"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                    }}
                    error={!!errors.email}
                    helperText={errors.email}
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
                    id="firstName"
                    label={t('addManager.firstName')}
                    variant="outlined"
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                      if (errors.firstName) setErrors((prev) => ({ ...prev, firstName: undefined }));
                    }}
                    error={!!errors.firstName}
                    helperText={errors.firstName}
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
                    id="lastName"
                    label={t('addManager.lastName')}
                    variant="outlined"
                    value={lastName}
                    onChange={(e) => {
                      setLastName(e.target.value);
                      if (errors.lastName) setErrors((prev) => ({ ...prev, lastName: undefined }));
                    }}
                    error={!!errors.lastName}
                    helperText={errors.lastName}
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
                    label={t('addManager.phoneNumber')}
                    variant="outlined"
                    value={phoneNumber}
                    onChange={(e) => {
                      setPhoneNumber(e.target.value);
                      if (errors.phoneNumber) setErrors((prev) => ({ ...prev, phoneNumber: undefined }));
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

                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    startIcon={registering ? <CircularProgress size={20} color="inherit" /> : <PersonAddIcon />}
                    disabled={registering}
                    sx={{
                      textTransform: 'none',
                      fontWeight: 'bold',
                      py: 1.2,
                      borderRadius: 2,
                      fontSize: '1rem'
                    }}
                  >
                    {registering ? t('addManager.adding') : t('addManager.addButton')}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Box>
      </Paper>
    </Container>
  );
};

export default AddManagerPage;
