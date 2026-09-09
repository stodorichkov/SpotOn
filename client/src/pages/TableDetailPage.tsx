import React, { useState, useEffect } from 'react';
import {Link, useLocation, useNavigate, useParams} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Trans, useTranslation } from 'react-i18next';
import { useUpdateTableMutation, useDeleteTableMutation } from '../features/restaurants/restaurantsSlice';
import { addAlert } from '../features/alerts/alertsSlice';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Divider,
  Button,
  IconButton,
  TextField,
  Switch,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import TableBarIcon from '@mui/icons-material/TableBar';
import SmokingRoomsIcon from '@mui/icons-material/SmokingRooms';
import SmokeFreeIcon from '@mui/icons-material/SmokeFree';
import PeopleIcon from '@mui/icons-material/People';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';

interface RestaurantTable {
  id: number;
  name: string;
  capacity: number;
  isSmokingAllowed: boolean;
}

const TableDetailPage: React.FC = () => {
  const { t } = useTranslation();
  useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [updateTable, { isLoading: isUpdating }] = useUpdateTableMutation();
  const [deleteTable, { isLoading: isDeleting }] = useDeleteTableMutation();

  const [currentTable, setCurrentTable] = useState<RestaurantTable | undefined>(
    location.state?.table as RestaurantTable | undefined
  );

  const shouldStartInEditMode = location.state?.edit === true;
  const [isEditing, setIsEditing] = useState(shouldStartInEditMode);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const [editName, setEditName] = useState('');
  const [editCapacity, setEditCapacity] = useState<number | ''>(1);
  const [editSmoking, setEditSmoking] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; capacity?: string }>({});

  useEffect(() => {
    if (currentTable) {
      setEditName(currentTable.name);
      setEditCapacity(currentTable.capacity);
      setEditSmoking(currentTable.isSmokingAllowed);
    }
  }, [currentTable, isEditing]);

  if (!currentTable) {
    return (
      <Container maxWidth="md" sx={{ mt: { xs: 2, sm: 4 }, mb: { xs: 2, sm: 4 }, px: { xs: 1, sm: 2 } }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
          <Typography color="error" variant="h5" fontWeight="bold" gutterBottom>
            {t('tableDetail.notFoundTitle')}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {t('tableDetail.notFoundBody')}
          </Typography>
          <Button
            component={Link}
            to="/manager/tables"
            variant="contained"
            color="primary"
            sx={{ textTransform: 'none', fontWeight: 'bold', borderRadius: 2 }}
          >
            {t('tableDetail.backToTables')}
          </Button>
        </Paper>
      </Container>
    );
  }

  const handleCancel = () => {
    setIsEditing(false);
    setErrors({});
    if (shouldStartInEditMode) {
      navigate('/manager/tables');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};

    if (!editName.trim()) {
      newErrors.name = t('validation.blankField');
    }

    if (editCapacity === '') {
      newErrors.capacity = t('validation.blankField');
    } else if (Number(editCapacity) < 1) {
      newErrors.capacity = t('validation.tableMinCapacity');
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const updated = await updateTable({
        id: currentTable.id,
        body: {
          name: editName.trim(),
          capacity: Number(editCapacity),
          isSmokingAllowed: editSmoking,
        }
      }).unwrap();

      setCurrentTable(updated);
      setIsEditing(false);
      setErrors({});
      dispatch(addAlert({ message: t('tableDetail.success'), type: 'success' }));

      if (shouldStartInEditMode) {
        navigate('/manager/tables');
      }
    } catch (err: any) {
      console.error('Failed to update table:', err);
      dispatch(addAlert({
        message: err?.data?.message || t('tableDetail.updateFailure'),
        type: 'error'
      }));
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteTable(currentTable.id).unwrap();
      dispatch(addAlert({ message: t('tableDetail.removeSuccess'), type: 'success' }));
      navigate('/manager/tables');
    } catch (err: any) {
      console.error('Failed to remove table:', err);
      dispatch(addAlert({
        message: err?.data?.message || t('tableDetail.removeFailure'),
        type: 'error'
      }));
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  const hasChanges = currentTable && (
    editName.trim() !== currentTable.name ||
    Number(editCapacity) !== currentTable.capacity ||
    editSmoking !== currentTable.isSmokingAllowed
  );

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
              <TableBarIcon sx={{ fontSize: { xs: 28, sm: 32 } }} />
            </Box>
            <Box>
              <Typography variant="h4" component="h1" fontWeight="bold" sx={{ fontSize: { xs: '1.5rem', sm: '2.125rem' } }}>
                {t('tableDetail.titlePrefix', { name: currentTable.name })}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                {isEditing ? t('tableDetail.editingSubtitle') : t('tableDetail.subtitle')}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, alignSelf: { xs: 'flex-end', sm: 'auto' } }}>
            {!isEditing && (
              <>
                <IconButton onClick={handleMenuOpen} color="primary" aria-label="table actions">
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  anchorEl={menuAnchorEl}
                  open={Boolean(menuAnchorEl)}
                  onClose={handleMenuClose}
                  PaperProps={{
                    sx: {
                      borderRadius: 2,
                      minWidth: 150,
                      boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                    }
                  }}
                >
                  <MenuItem
                    onClick={() => {
                      handleMenuClose();
                      setIsEditing(true);
                    }}
                  >
                    <ListItemIcon>
                      <EditIcon color="primary" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={t('tableDetail.menuEdit')} />
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleMenuClose();
                      setDeleteDialogOpen(true);
                    }}
                    sx={{ color: 'error.main' }}
                  >
                    <ListItemIcon>
                      <DeleteIcon color="error" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={t('tableDetail.menuRemove')} />
                  </MenuItem>
                </Menu>
              </>
            )}
          </Box>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {isEditing ? (
          <Box component="form" onSubmit={handleSave} noValidate>
            <Typography variant="h6" fontWeight="bold" color="text.secondary" sx={{ mb: 3 }}>
              {t('tableDetail.editTitle')}
            </Typography>

            <Grid container spacing={3.5} direction="column">
              {/* Table Name / Number */}
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="name"
                  label={t('tableDetail.tableName')}
                  value={editName}
                  onChange={(e) => {
                    setEditName(e.target.value);
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

              {/* Table Capacity */}
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="capacity"
                  label={t('tableDetail.capacity')}
                  type="number"
                  value={editCapacity}
                  onChange={(e) => {
                    const val = e.target.value;
                    const num = val === '' ? '' : Number(val);
                    if (num === '' || num >= 1) {
                      setEditCapacity(num);
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
                          setEditCapacity((prev) => {
                            const current = prev === '' ? 1 : Number(prev);
                            return current > 1 ? current - 1 : 1;
                          });
                          if (errors.capacity) setErrors({ ...errors, capacity: undefined });
                        }}
                        disabled={editCapacity !== '' && Number(editCapacity) <= 1}
                        size="small"
                        sx={{ color: 'text.secondary' }}
                      >
                        <RemoveIcon />
                      </IconButton>
                    ),
                    endAdornment: (
                      <IconButton
                        onClick={() => {
                          setEditCapacity((prev) => (prev === '' ? 1 : Number(prev) + 1));
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
                    {t('tableDetail.smokingAllowed')}
                  </Typography>
                  <Switch
                    checked={editSmoking}
                    onChange={(e) => setEditSmoking(e.target.checked)}
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

            {/* Buttons aligned to the left (justifyContent: 'flex-start') */}
            <Box sx={{ mt: 5, display: 'flex', gap: 2, justifyContent: 'flex-start' }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isUpdating || !hasChanges}
                startIcon={isUpdating ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                sx={{ textTransform: 'none', fontWeight: 'bold', borderRadius: 2 }}
              >
                {t('tableDetail.save')}
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                onClick={handleCancel}
                disabled={isUpdating}
                startIcon={<CancelIcon />}
                sx={{ textTransform: 'none', fontWeight: 'bold', borderRadius: 2 }}
              >
                {t('tableDetail.cancel')}
              </Button>
            </Box>
          </Box>
        ) : (
          <Box>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" fontWeight="bold" color="text.secondary">
                {t('tableDetail.specificationsTitle')}
              </Typography>
            </Box>

            <Grid container spacing={4}>
              {/* Table Name */}
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <TableBarIcon color="primary" sx={{ mt: 0.5, fontSize: 28 }} />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
                      {t('tableDetail.tableName')}
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 0.5, fontSize: '1.1rem' }}>
                      {currentTable.name}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              {/* Capacity */}
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <PeopleIcon color="primary" sx={{ mt: 0.5, fontSize: 28 }} />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
                      {t('tableDetail.capacity')}
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 0.5, fontSize: '1.1rem' }}>
                      {t('tableDetail.capacity', { count: currentTable.capacity })}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              {/* Smoking Policy */}
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  {currentTable.isSmokingAllowed ? (
                    <SmokingRoomsIcon color="success" sx={{ mt: 0.5, fontSize: 28 }} />
                  ) : (
                    <SmokeFreeIcon color="action" sx={{ mt: 0.5, fontSize: 28 }} />
                  )}
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
                      {t('tableDetail.smokingPolicy')}
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 0.5, fontSize: '1.1rem' }}>
                      {currentTable.isSmokingAllowed ? t('tableDetail.smokingAllowed') : t('tableDetail.nonSmoking')}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>

      {/* Custom Material UI Confirmation Dialog for Deleting Table */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
        PaperProps={{
          sx: {
            borderRadius: 3,
            px: 1,
            py: 0.5
          }
        }}
      >
        <DialogTitle id="delete-dialog-title" fontWeight="bold">
          {t('tableDetail.deleteTitle')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            <Trans
              i18nKey="tableDetail.deleteBody"
              values={{ name: currentTable.name }}
              components={{ bold: <strong /> }}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleDeleteCancel}
            color="inherit"
            sx={{ textTransform: 'none', fontWeight: 'bold' }}
            disabled={isDeleting}
          >
            {t('common.cancel')}
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            sx={{ textTransform: 'none', fontWeight: 'bold', borderRadius: 2 }}
            disabled={isDeleting}
            autoFocus
          >
            {t('common.remove')}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TableDetailPage;
