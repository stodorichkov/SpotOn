import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useRegisterEmployeeMutation } from '../features/auth/authApi';
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
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const AddEmployeePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [registerEmployee, { isLoading: registering }] = useRegisterEmployeeMutation();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errors, setErrors] = useState<{ firstName?: string; lastName?: string; phoneNumber?: string }>({});
  const [successData, setSuccessData] = useState<{ username: string; password: string } | null>(null);

  const handleCopyBoth = (username: string, password: string) => {
    const textToCopy = `username: ${username}\npassword: ${password}`;
    navigator.clipboard.writeText(textToCopy);
    dispatch(addAlert({ message: t('addEmployee.credentialsCopied'), type: 'info' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};

    if (!firstName.trim()) {
      newErrors.firstName = t('validation.blankField');
    } else if (!RegexConstants.NAME_REGEX.test(firstName.trim())) {
      newErrors.firstName = t('validation.invalidName');
    }

    if (!lastName.trim()) {
      newErrors.lastName = t('validation.blankField');
    } else if (!RegexConstants.NAME_REGEX.test(lastName.trim())) {
      newErrors.lastName = t('validation.invalidName');
    }

    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = t('validation.blankField');
    } else if (!RegexConstants.PHONE_NUMBER_REGEX.test(phoneNumber.trim())) {
      newErrors.phoneNumber = t('validation.invalidPhoneNumber');
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await registerEmployee({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phoneNumber: phoneNumber.trim(),
      }).unwrap();

      setSuccessData({
        username: response.username,
        password: response.password,
      });
      dispatch(addAlert({ message: t('addEmployee.success'), type: 'success' }));
    } catch (err: any) {
      console.error('Failed to register employee:', err);
      dispatch(addAlert({
        message: err?.data?.message || t('addEmployee.failure'),
        type: 'error'
      }));
    }
  };

  const handleBack = () => {
    navigate('/manager/employees');
  };

  return (
    <Container maxWidth="xs" sx={{ mt: { xs: 4, sm: 8 }, mb: 4, px: { xs: 2, sm: 0 } }}>
      <Paper elevation={3} sx={{ p: { xs: 3, sm: 4 }, borderRadius: 3 }}>
        {successData ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="h5" component="h1" fontWeight="bold" color="success.main" align="center">
                {t('addEmployee.credentialsTitle')}
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 0.5 }}>
                {t('addEmployee.credentialsSubtitle')}
              </Typography>
            </Box>

            <TextField
              label={t('addEmployee.username')}
              value={successData.username}
              InputProps={{
                readOnly: true,
              }}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2.5,
                  backgroundColor: 'action.hover'
                }
              }}
            />
            <TextField
              label={t('addEmployee.password')}
              value={successData.password}
              InputProps={{
                readOnly: true,
              }}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2.5,
                  backgroundColor: 'action.hover'
                }
              }}
            />
            <Button
              variant="outlined"
              color="primary"
              startIcon={<ContentCopyIcon />}
              onClick={() => handleCopyBoth(successData.username, successData.password)}
              sx={{ textTransform: 'none', fontWeight: 'bold', py: 1.2, borderRadius: 2 }}
            >
              {t('addEmployee.copyCredentials')}
            </Button>
            <Button
              onClick={handleBack}
              variant="contained"
              color="primary"
              size="large"
              sx={{ textTransform: 'none', fontWeight: 'bold', py: 1.5, borderRadius: 2 }}
            >
              {t('addEmployee.done')}
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar
              sx={{
                m: 1,
                backgroundColor: 'info.main',
                color: 'info.contrastText',
                width: 52,
                height: 52
              }}
            >
              <PersonAddIcon sx={{ fontSize: 28 }} />
            </Avatar>

            <Typography component="h1" variant="h5" fontWeight="bold" sx={{ mt: 1 }}>
              {t('addEmployee.title')}
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 0.5, mb: 3 }}>
              {t('addEmployee.subtitle')}
            </Typography>

            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
              <Grid container spacing={1.5}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="firstName"
                    label={t('addEmployee.firstName')}
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
                    label={t('addEmployee.lastName')}
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
                    label={t('addEmployee.phoneNumber')}
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
                    {registering ? t('addEmployee.adding') : t('addEmployee.addButton')}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default AddEmployeePage;
