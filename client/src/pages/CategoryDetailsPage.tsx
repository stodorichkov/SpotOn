import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  useGetCategoryByIdQuery,
  useUpdateCategoryMutation,
  useUpdateCategoryActiveStatusMutation
} from '../features/restaurants/restaurantsSlice';
import { addAlert } from '../features/alerts/alertsSlice';
import { getCategoryStyle } from '../utils/categoryColor';
import { getCategoryDisplayName, getCategoryColorSeed } from '../utils/categoryLabels';
import {
  Container,
  Paper,
  Typography,
  Box,
  Chip,
  Grid,
  Skeleton,
  Divider,
  Button,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import CategoryIcon from '@mui/icons-material/Category';
import BadgeIcon from '@mui/icons-material/Badge';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

const CategoryDetailsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>();
  const categoryId = Number(id);

  const { data: category, isLoading, error } = useGetCategoryByIdQuery(
    categoryId,
    { skip: isNaN(categoryId) }
  );

  const [updateCategory, { isLoading: isSaving }] = useUpdateCategoryMutation();
  const [updateCategoryActiveStatus, { isLoading: isTogglingActive }] = useUpdateCategoryActiveStatusMutation();

  const [isEditingName, setIsEditingName] = useState(false);
  const [nameEnInput, setNameEnInput] = useState('');
  const [nameBgInput, setNameBgInput] = useState('');
  const [nameEnError, setNameEnError] = useState('');
  const [nameBgError, setNameBgError] = useState('');
  const [isToggleDialogOpen, setIsToggleDialogOpen] = useState(false);

  useEffect(() => {
    if (category) {
      setNameEnInput(category.nameEn);
      setNameBgInput(category.nameBg);
    }
  }, [category]);

  const handleStartEditName = () => {
    setNameEnInput(category?.nameEn || '');
    setNameBgInput(category?.nameBg || '');
    setNameEnError('');
    setNameBgError('');
    setIsEditingName(true);
  };

  const handleCancelEditName = () => {
    setNameEnInput(category?.nameEn || '');
    setNameBgInput(category?.nameBg || '');
    setNameEnError('');
    setNameBgError('');
    setIsEditingName(false);
  };

  const handleSaveName = async (e: React.FormEvent) => {
    e.preventDefault();

    let hasError = false;
    if (!nameEnInput.trim()) {
      setNameEnError(t('validation.blankField'));
      hasError = true;
    }
    if (!nameBgInput.trim()) {
      setNameBgError(t('validation.blankField'));
      hasError = true;
    }
    if (hasError) return;

    try {
      await updateCategory({ id: categoryId, body: { nameEn: nameEnInput.trim(), nameBg: nameBgInput.trim() } }).unwrap();
      dispatch(addAlert({ message: t('categories.updateSuccess'), type: 'success' }));
      setIsEditingName(false);
    } catch (err: any) {
      console.error('Failed to update category:', err);
      dispatch(addAlert({
        message: err?.data?.message || t('categories.saveFailure'),
        type: 'error'
      }));
    }
  };

  const handleToggleActiveConfirm = async () => {
    if (!category) return;
    try {
      await updateCategoryActiveStatus({
        id: category.id,
        body: { isActive: !category.isActive }
      }).unwrap();
      dispatch(addAlert({
        message: category.isActive ? t('categories.deactivateSuccess') : t('categories.activateSuccess'),
        type: 'success'
      }));
    } catch (err: any) {
      console.error('Failed to update category active status:', err);
      dispatch(addAlert({
        message: err?.data?.message || t('categories.toggleActiveFailure'),
        type: 'error'
      }));
    } finally {
      setIsToggleDialogOpen(false);
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="md" sx={{ mt: { xs: 2, sm: 4 }, mb: { xs: 2, sm: 4 }, px: { xs: 1, sm: 2 } }}>
        <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Skeleton variant="circular" width={60} height={60} />
            <Box sx={{ width: '100%' }}>
              <Skeleton variant="text" width="40%" height={40} />
              <Skeleton variant="text" width="25%" height={25} />
            </Box>
          </Box>
          <Divider sx={{ mb: 3 }} />
          <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 2 }} />
        </Paper>
      </Container>
    );
  }

  if (error || !category) {
    return (
      <Container maxWidth="md" sx={{ mt: { xs: 2, sm: 4 }, px: { xs: 1, sm: 2 } }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
          <Typography color="error" variant="h5" fontWeight="bold" gutterBottom>
            {t('common.error')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t('categories.failedToLoad')}
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
            alignItems: 'flex-start',
            gap: 2,
            mb: 3
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: { xs: 1.5, sm: 2 } }}>
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
              <CategoryIcon sx={{ fontSize: { xs: 28, sm: 32 } }} />
            </Box>
            <Box>
              <Typography variant="h4" component="h1" fontWeight="bold" sx={{ fontSize: { xs: '1.5rem', sm: '2.125rem' } }}>
                {getCategoryDisplayName(category, i18n.language)}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                {t('categories.detailsSubtitle')}
              </Typography>
            </Box>
          </Box>

          <ToggleButtonGroup
            value={category.isActive ? 'active' : 'inactive'}
            exclusive
            size="small"
            onChange={(e, newValue) => {
              if (newValue !== null && newValue !== (category.isActive ? 'active' : 'inactive')) {
                setIsToggleDialogOpen(true);
              }
            }}
          >
            <ToggleButton
              value="active"
              color="success"
              sx={{ textTransform: 'none', fontWeight: 'bold', px: 2 }}
            >
              {t('categories.activeStatusActive')}
            </ToggleButton>
            <ToggleButton
              value="inactive"
              color="error"
              sx={{ textTransform: 'none', fontWeight: 'bold', px: 2 }}
            >
              {t('categories.activeStatusInactive')}
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Category Details Section */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" fontWeight="bold" color="text.secondary" sx={{ mb: 2 }}>
            {t('userDetails.accountDetails')}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <BadgeIcon color="primary" sx={{ mt: 0.5, fontSize: 28 }} />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
                    {t('categories.categoryId')}
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 0.5, fontSize: '1.1rem' }}>
                    {category.id}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={8}>
              {isEditingName ? (
                <Box component="form" onSubmit={handleSaveName}>
                  <TextField
                    autoFocus
                    required
                    fullWidth
                    label={t('categories.nameEnLabel')}
                    value={nameEnInput}
                    onChange={(e) => {
                      setNameEnInput(e.target.value);
                      if (nameEnError) setNameEnError('');
                    }}
                    error={!!nameEnError}
                    helperText={nameEnError}
                    size="small"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 }, mb: 1.5 }}
                  />
                  <TextField
                    required
                    fullWidth
                    label={t('categories.nameBgLabel')}
                    value={nameBgInput}
                    onChange={(e) => {
                      setNameBgInput(e.target.value);
                      if (nameBgError) setNameBgError('');
                    }}
                    error={!!nameBgError}
                    helperText={nameBgError}
                    size="small"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 }, mb: 1.5 }}
                  />
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      type="submit"
                      startIcon={isSaving ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
                      disabled={isSaving}
                      variant="contained"
                      color="primary"
                      size="small"
                      sx={{ textTransform: 'none', fontWeight: 'bold', borderRadius: 2 }}
                    >
                      {t('categories.save')}
                    </Button>
                    <Button
                      startIcon={<CancelIcon />}
                      onClick={handleCancelEditName}
                      variant="outlined"
                      color="inherit"
                      size="small"
                      disabled={isSaving}
                      sx={{ textTransform: 'none', fontWeight: 'bold', borderRadius: 2 }}
                    >
                      {t('categories.cancel')}
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <CategoryIcon color="primary" sx={{ mt: 0.5, fontSize: 28 }} />
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
                          {t('categories.nameEnLabel')}
                        </Typography>
                        <Chip
                          label={category.nameEn}
                          size="small"
                          sx={{ ...getCategoryStyle(getCategoryColorSeed(category)), fontWeight: 'bold', mt: 0.5 }}
                        />
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
                          {t('categories.nameBgLabel')}
                        </Typography>
                        <Chip
                          label={category.nameBg}
                          size="small"
                          sx={{ ...getCategoryStyle(getCategoryColorSeed(category)), fontWeight: 'bold', mt: 0.5 }}
                        />
                      </Box>
                    </Box>
                  </Box>
                  <IconButton onClick={handleStartEditName} color="primary" size="small">
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Box>
              )}
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Activate / Deactivate Confirmation Dialog */}
      <Dialog
        open={isToggleDialogOpen}
        onClose={() => setIsToggleDialogOpen(false)}
        aria-labelledby="toggle-active-dialog-title"
        PaperProps={{ sx: { borderRadius: 3, px: 1, py: 0.5 } }}
      >
        <DialogTitle id="toggle-active-dialog-title" fontWeight="bold">
          {category.isActive ? t('categories.deactivateTitle') : t('categories.activateTitle')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {category.isActive
              ? t('categories.deactivateBody', { name: getCategoryDisplayName(category, i18n.language) })
              : t('categories.activateBody', { name: getCategoryDisplayName(category, i18n.language) })}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setIsToggleDialogOpen(false)}
            color="inherit"
            sx={{ textTransform: 'none', fontWeight: 'bold' }}
            disabled={isTogglingActive}
          >
            {t('common.cancel')}
          </Button>
          <Button
            onClick={handleToggleActiveConfirm}
            color={category.isActive ? 'error' : 'success'}
            variant="contained"
            sx={{ textTransform: 'none', fontWeight: 'bold', borderRadius: 2 }}
            disabled={isTogglingActive}
            startIcon={isTogglingActive ? <CircularProgress size={16} color="inherit" /> : undefined}
            autoFocus
          >
            {category.isActive ? t('categories.menuDeactivate') : t('categories.menuActivate')}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CategoryDetailsPage;
