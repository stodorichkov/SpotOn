import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useCreateTableMutation } from '../features/restaurants/restaurantsSlice';
import { addAlert } from '../features/alerts/alertsSlice';
import { MessageConstants } from '../constants';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  CircularProgress,
  Switch,
  IconButton
} from '@mui/material';
import TableBarIcon from '@mui/icons-material/TableBar';
import SmokingRoomsIcon from '@mui/icons-material/SmokingRooms';
import SmokeFreeIcon from '@mui/icons-material/SmokeFree';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const AddTablePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [createTable, { isLoading: isCreating }] = useCreateTableMutation();

  const [name, setName] = useState('');
  const [capacity, setCapacity] = useState<number | ''>(1);
  const [isSmokingAllowed, setIsSmokingAllowed] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; capacity?: string }>({});

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};

    if (!name.trim()) {
      newErrors.name = MessageConstants.BLANK_FIELD;
    }

    if (capacity === '') {
      newErrors.capacity = MessageConstants.BLANK_FIELD;
    } else if (Number(capacity) < 1) {
      newErrors.capacity = MessageConstants.TABLE_MIN_CAPACITY;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await createTable({
        name: name.trim(),
        capacity: Number(capacity),
        isSmokingAllowed,
      }).unwrap();

      dispatch(addAlert({ message: `Table "${name.trim()}" added successfully!`, type: 'success' }));
      navigate('/manager/tables');
    } catch (err: any) {
      console.error('Failed to add table:', err);
      dispatch(addAlert({
        message: err?.data?.message || 'Failed to add table. Please try again.',
        type: 'error'
      }));
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: { xs: 4, sm: 8 }, mb: 4, px: { xs: 2, sm: 0 } }}>
      <Paper elevation={3} sx={{ p: { xs: 3, sm: 4 }, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'primary.main',
              color: 'primary.contrastText',
              borderRadius: '50%',
              width: 52,
              height: 52,
              mb: 2
            }}
          >
            <TableBarIcon sx={{ fontSize: 28 }} />
          </Box>
          
          <Typography component="h1" variant="h5" fontWeight="bold" sx={{ mt: 1, mb: 1 }}>
            Add New Table
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Add a new table to your restaurant layout.
          </Typography>

          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="name"
                  label="Table Name / Number"
                  name="name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors({ ...errors, name: undefined });
                  }}
                  error={!!errors.name}
                  helperText={errors.name}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2.5,
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="capacity"
                  label="Capacity"
                  name="capacity"
                  type="number"
                  value={capacity}
                  onChange={(e) => {
                    const val = e.target.value;
                    const num = val === '' ? '' : Number(val);
                    if (num === '' || num >= 1) {
                      setCapacity(num);
                    }
                    if (errors.capacity) setErrors({ ...errors, capacity: undefined });
                  }}
                  error={!!errors.capacity}
                  helperText={errors.capacity}
                  inputProps={{ 
                    min: 1, 
                    style: { textAlign: 'center' } 
                  }}
                  InputProps={{
                    startAdornment: (
                      <IconButton
                        onClick={() => {
                          setCapacity((prev) => {
                            const current = prev === '' ? 1 : Number(prev);
                            return current > 1 ? current - 1 : 1;
                          });
                          if (errors.capacity) setErrors({ ...errors, capacity: undefined });
                        }}
                        disabled={capacity !== '' && Number(capacity) <= 1}
                        size="small"
                        sx={{ color: 'text.secondary' }}
                      >
                        <RemoveIcon />
                      </IconButton>
                    ),
                    endAdornment: (
                      <IconButton
                        onClick={() => {
                          setCapacity((prev) => (prev === '' ? 1 : Number(prev) + 1));
                          if (errors.capacity) setErrors({ ...errors, capacity: undefined });
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
                    checked={isSmokingAllowed}
                    onChange={(e) => setIsSmokingAllowed(e.target.checked)}
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
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={isCreating}
              sx={{
                mt: 3,
                py: 1.2,
                fontWeight: 'bold',
                textTransform: 'none',
                borderRadius: 2,
                fontSize: '1rem'
              }}
            >
              {isCreating ? <CircularProgress size={24} color="inherit" /> : 'Add Table'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default AddTablePage;
