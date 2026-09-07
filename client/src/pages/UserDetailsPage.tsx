import React, { useState } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useGetUserDetailsQuery, useUpdateUserActiveStatusMutation } from '../features/users/usersSlice';
import { useDeleteEmployeeMutation } from '../features/restaurants/restaurantsSlice';
import { Trans, useTranslation } from 'react-i18next';
import { RootState } from '../store/store';
import { addAlert } from '../features/alerts/alertsSlice';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PhoneIcon from '@mui/icons-material/Phone';
import BadgeIcon from '@mui/icons-material/Badge';
import DeleteIcon from '@mui/icons-material/Delete';
import { Role } from '../constants';

const getRoleChipColor = (role?: string) => {
  if (!role) return 'default';
  switch (role.toUpperCase()) {
    case Role.ADMIN:
    case 'ADMINISTRATOR':
      return 'error';
    case Role.CLIENT:
      return 'success';
    case Role.EMPLOYEE:
    case 'STAFF':
      return 'info';
    case 'OWNER':
    case Role.MANAGER:
      return 'warning';
    default:
      return 'default';
  }
};

const UserDetailsPage: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const currentRole = useSelector((state: RootState) => state.auth.role);
  const currentUserId = useSelector((state: RootState) => state.auth.id);

  const stateUser = location.state?.user;

  const hasFullStateData = stateUser && (
    stateUser.role === Role.ADMIN ||
    (stateUser.firstName !== undefined && stateUser.lastName !== undefined)
  );

  const { data: queryUser, isLoading, error } = useGetUserDetailsQuery(
    Number(id),
    { skip: !!hasFullStateData }
  );

  const [overrideActive, setOverrideActive] = useState<boolean | null>(null);
  const [isToggleDialogOpen, setIsToggleDialogOpen] = useState(false);
  const [updateUserActiveStatus, { isLoading: isTogglingActive }] = useUpdateUserActiveStatusMutation();

  const [deleteEmployee, { isLoading: isDeleting }] = useDeleteEmployeeMutation();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const user = hasFullStateData ? stateUser : queryUser;
  const isActive = overrideActive !== null ? overrideActive : user?.isActive;
  const isSelf = !!user && currentUserId === user.id;
  const canManagerRemove = !!user && currentRole === Role.MANAGER && !isSelf &&
    (user.role?.toUpperCase() === Role.EMPLOYEE || user.role?.toUpperCase() === 'STAFF');

  const handleToggleActiveConfirm = async () => {
    if (!user) return;
    try {
      const result = await updateUserActiveStatus({
        id: user.id,
        body: { isActive: !isActive }
      }).unwrap();
      setOverrideActive(result.isActive);
      dispatch(addAlert({
        message: isActive ? t('users.deactivateSuccess') : t('users.activateSuccess'),
        type: 'success'
      }));
    } catch (err: any) {
      console.error('Failed to update user active status:', err);
      dispatch(addAlert({
        message: err?.data?.message || t('users.toggleActiveFailure'),
        type: 'error'
      }));
    } finally {
      setIsToggleDialogOpen(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!user) return;
    try {
      await deleteEmployee(user.id).unwrap();
      dispatch(addAlert({ message: t('managerEmployees.success'), type: 'success' }));
      navigate('/manager/employees');
    } catch (err: any) {
      console.error('Failed to remove employee:', err);
      dispatch(addAlert({
        message: err?.data?.message || t('managerEmployees.failure'),
        type: 'error'
      }));
    } finally {
      setIsDeleteDialogOpen(false);
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
          <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 2, mb: 3 }} />
          <Skeleton variant="rectangular" height={150} sx={{ borderRadius: 2 }} />
        </Paper>
      </Container>
    );
  }

  if (error || !user) {
    return (
      <Container maxWidth="md" sx={{ mt: { xs: 2, sm: 4 }, px: { xs: 1, sm: 2 } }}>
        <Button
          component={Link}
          to="/admin/users"
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 2, textTransform: 'none', fontWeight: 'bold' }}
        >
          {t('userDetails.backToUsers')}
        </Button>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
          <Typography color="error" variant="h5" fontWeight="bold" gutterBottom>
            {t('common.error')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t('userDetails.failedToLoad')}
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
              <PersonIcon sx={{ fontSize: { xs: 28, sm: 32 } }} />
            </Box>
            <Box>
              <Typography variant="h4" component="h1" fontWeight="bold" sx={{ fontSize: { xs: '1.5rem', sm: '2.125rem' } }}>
                {user.firstName ? `${user.firstName} ${user.lastName}` : user.email}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                {t('userDetails.subtitle')}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
            <Chip
              label={user.role}
              color={getRoleChipColor(user.role)}
              variant="outlined"
              sx={{
                fontWeight: 'bold',
                px: 1.5,
                py: 0.5,
                fontSize: '0.85rem',
                borderRadius: 2,
                alignSelf: { xs: 'flex-end', sm: 'auto' }
              }}
            />
            {isActive !== undefined && (
              <Tooltip title={isSelf ? t('users.cannotDeactivateSelf') : ''} arrow disableHoverListener={!isSelf}>
                <span>
                  <ToggleButtonGroup
                    value={isActive ? 'active' : 'inactive'}
                    exclusive
                    size="small"
                    disabled={currentRole !== Role.ADMIN || isSelf}
                    onChange={(e, newValue) => {
                      if (newValue !== null && newValue !== (isActive ? 'active' : 'inactive')) {
                        setIsToggleDialogOpen(true);
                      }
                    }}
                  >
                    <ToggleButton
                      value="active"
                      color="success"
                      sx={{ textTransform: 'none', fontWeight: 'bold', px: 2 }}
                    >
                      {t('users.activeStatusActive')}
                    </ToggleButton>
                    <ToggleButton
                      value="inactive"
                      color="error"
                      sx={{ textTransform: 'none', fontWeight: 'bold', px: 2 }}
                    >
                      {t('users.activeStatusInactive')}
                    </ToggleButton>
                  </ToggleButtonGroup>
                </span>
              </Tooltip>
            )}
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Account Details Section */}
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
                    {t('userDetails.userId')}
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 0.5, fontSize: '1.1rem' }}>
                    {user.id}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={8}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <PersonIcon color="primary" sx={{ mt: 0.5, fontSize: 28 }} />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
                    {t('userDetails.email')}
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 0.5, fontSize: '1.1rem' }}>
                    {user.email}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Contact Information Section */}
        {user.role !== Role.ADMIN && (
          <>
            <Divider sx={{ my: 3 }} />
            <Box>
              <Typography variant="h6" fontWeight="bold" color="text.secondary" sx={{ mb: 2 }}>
                {t('userDetails.personalInformation')}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <PersonIcon color="primary" sx={{ mt: 0.5, fontSize: 28 }} />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
                        {t('userDetails.firstName')}
                      </Typography>
                      <Typography variant="body1" sx={{ mt: 0.5, fontSize: '1.1rem' }}>
                        {user.firstName || '-'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <PersonIcon color="primary" sx={{ mt: 0.5, fontSize: 28 }} />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
                        {t('userDetails.lastName')}
                      </Typography>
                      <Typography variant="body1" sx={{ mt: 0.5, fontSize: '1.1rem' }}>
                        {user.lastName || '-'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <PhoneIcon color="primary" sx={{ mt: 0.5, fontSize: 28 }} />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
                        {t('userDetails.phoneNumber')}
                      </Typography>
                      <Typography variant="body1" sx={{ mt: 0.5, fontSize: '1.1rem' }}>
                        {user.phoneNumber || '-'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </>
        )}

        {canManagerRemove && (
          <>
            <Divider sx={{ my: 3 }} />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => setIsDeleteDialogOpen(true)}
                sx={{ textTransform: 'none', fontWeight: 'bold', borderRadius: 2 }}
              >
                {t('managerEmployees.menuRemove')}
              </Button>
            </Box>
          </>
        )}
      </Paper>

      {/* Remove Employee Confirmation Dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
        PaperProps={{ sx: { borderRadius: 3, px: 1, py: 0.5 } }}
      >
        <DialogTitle id="delete-dialog-title" fontWeight="bold">
          {t('managerEmployees.deleteTitle')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            <Trans
              i18nKey="managerEmployees.deleteBody"
              values={{ name: user ? `${user.firstName || ''} ${user.lastName || ''}` : '' }}
              components={{ bold: <strong /> }}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setIsDeleteDialogOpen(false)}
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
            startIcon={isDeleting ? <CircularProgress size={16} color="inherit" /> : undefined}
            autoFocus
          >
            {t('common.remove')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Activate / Deactivate Confirmation Dialog */}
      <Dialog
        open={isToggleDialogOpen}
        onClose={() => setIsToggleDialogOpen(false)}
        aria-labelledby="toggle-active-dialog-title"
        PaperProps={{ sx: { borderRadius: 3, px: 1, py: 0.5 } }}
      >
        <DialogTitle id="toggle-active-dialog-title" fontWeight="bold">
          {isActive ? t('users.deactivateTitle') : t('users.activateTitle')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {isActive
              ? t('users.deactivateBody', { email: user.email })
              : t('users.activateBody', { email: user.email })}
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
            color={isActive ? 'error' : 'success'}
            variant="contained"
            sx={{ textTransform: 'none', fontWeight: 'bold', borderRadius: 2 }}
            disabled={isTogglingActive}
            startIcon={isTogglingActive ? <CircularProgress size={16} color="inherit" /> : undefined}
            autoFocus
          >
            {isActive ? t('users.menuDeactivate') : t('users.menuActivate')}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserDetailsPage;
