import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useRegisterManagerMutation } from '../features/auth/authApi';
import { addAlert } from '../features/alerts/alertsSlice';
import { RegexConstants, MessageConstants } from '../constants';
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
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const AddManagerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const restaurantId = Number(id);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [registerManager, { isLoading: registering }] = useRegisterManagerMutation();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errors, setErrors] = useState<{ firstName?: string; lastName?: string; phoneNumber?: string }>({});
  const [successData, setSuccessData] = useState<{ username: string; password: string } | null>(null);

  const handleCopyBoth = (username: string, password: string) => {
    const textToCopy = `username: ${username}\npassword: ${password}`;
    navigator.clipboard.writeText(textToCopy);
    dispatch(addAlert({ message: 'Credentials copied to clipboard!', type: 'info' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};

    if (!firstName.trim()) {
      newErrors.firstName = MessageConstants.BLANK_FIELD;
    } else if (!RegexConstants.NAME_REGEX.test(firstName.trim())) {
      newErrors.firstName = MessageConstants.INVALID_NAME;
    }

    if (!lastName.trim()) {
      newErrors.lastName = MessageConstants.BLANK_FIELD;
    } else if (!RegexConstants.NAME_REGEX.test(lastName.trim())) {
      newErrors.lastName = MessageConstants.INVALID_NAME;
    }

    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = MessageConstants.BLANK_FIELD;
    } else if (!RegexConstants.PHONE_NUMBER_REGEX.test(phoneNumber.trim())) {
      newErrors.phoneNumber = MessageConstants.INVALID_PHONE_NUMBER;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await registerManager({
        employeeData: {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          phoneNumber: phoneNumber.trim(),
        },
        restaurantId,
      }).unwrap();

      setSuccessData({
        username: response.username,
        password: response.password,
      });
      dispatch(addAlert({ message: 'Manager registered successfully!', type: 'success' }));
    } catch (err: any) {
      console.error('Failed to register manager:', err);
      dispatch(addAlert({
        message: err?.data?.message || 'Failed to add manager. Please try again.',
        type: 'error'
      }));
    }
  };

  const handleBack = () => {
    navigate(`/admin/restaurants/${restaurantId}/employees`);
  };

  if (isNaN(restaurantId)) {
    return (
      <Container maxWidth="xs" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
          <Typography color="error" variant="h6" fontWeight="bold" gutterBottom>
            Error
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Invalid Restaurant ID.
          </Typography>
          <Button component={Link} to="/admin/restaurants" startIcon={<ArrowBackIcon />} sx={{ mt: 2, textTransform: 'none', fontWeight: 'bold' }}>
            Back to Restaurants
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="xs" sx={{ mt: { xs: 4, sm: 8 }, mb: 4, px: { xs: 2, sm: 0 } }}>
      <Paper elevation={3} sx={{ p: { xs: 3, sm: 4 }, borderRadius: 3 }}>
        {successData ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="h5" component="h1" fontWeight="bold" color="success.main" align="center">
                Manager Credentials
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 0.5 }}>
                The manager has been registered successfully. Copy these credentials now. The password will not be shown again.
              </Typography>
            </Box>
            
            <TextField
              label="Username"
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
              label="Password"
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
              Copy Credentials
            </Button>
            <Button
              onClick={handleBack}
              variant="contained"
              color="primary"
              size="large"
              sx={{ textTransform: 'none', fontWeight: 'bold', py: 1.5, borderRadius: 2 }}
            >
              Done
            </Button>
          </Box>
        ) : (
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
              Add New Manager
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 0.5, mb: 3 }}>
              Register a new manager for this restaurant.
            </Typography>

            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
              <Grid container spacing={1.5}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
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
                    label="Last Name"
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
                    label="Phone Number"
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
                    {registering ? 'Adding manager...' : 'Add manager'}
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

export default AddManagerPage;