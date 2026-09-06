import React, { useState, useEffect, useMemo } from 'react';
import { Container, Typography, Paper, Grid, TextField, Button, Skeleton, Box, IconButton, InputAdornment, Divider, Chip } from '@mui/material';
import { useGetProfileQuery, useChangeEmailMutation, useChangePasswordMutation, useEditProfileMutation, ChangePasswordRequest, EditProfileRequest } from '../features/auth/authApi';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import PersonIcon from '@mui/icons-material/Person';
import { Visibility, VisibilityOff, Phone } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { RootState, AppDispatch } from '../store/store';
import { updateChangePasswordFormField, clearChangePasswordForm } from '../features/auth/changePasswordSlice';
import { addAlert } from '../features/alerts/alertsSlice';
import * as yup from 'yup';
import { RegexConstants, Role } from '../constants';

type ChangePasswordFormState = ChangePasswordRequest;
type EditProfileFormState = EditProfileRequest;
type PasswordValidationErrors = Partial<Record<keyof ChangePasswordFormState, string>>;
type ProfileValidationErrors = Partial<Record<keyof EditProfileFormState, string>>;

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

const ProfilePage = () => {
    const { t } = useTranslation();
    const { data: user, isLoading, refetch } = useGetProfileQuery();
    const [changeEmail, { isLoading: isChangingEmail }] = useChangeEmailMutation();
    const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();
    const [editProfile, { isLoading: isUpdatingProfile }] = useEditProfileMutation();
    const dispatch: AppDispatch = useDispatch();
    const passwordFormState = useSelector((state: RootState) => state.changePasswordForm as ChangePasswordFormState);

    const [isEditingEmail, setIsEditingEmail] = useState(false);
    const [newEmail, setNewEmail] = useState('');
    const [passwordErrors, setPasswordErrors] = useState<PasswordValidationErrors>({});
    const [emailError, setEmailError] = useState<string | undefined>(undefined);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showPasswordSection, setShowPasswordSection] = useState(false);

    const [isEditingContact, setIsEditingContact] = useState(false);
    const [profileFormState, setProfileFormState] = useState<EditProfileFormState>({ firstName: '', lastName: '', phoneNumber: '' });
    const [profileErrors, setProfileErrors] = useState<ProfileValidationErrors>({});

    const passwordValidationSchema = useMemo(() => yup.object({
        currentPassword: yup
            .string()
            .required(t('validation.blankField')),
        newPassword: yup
            .string()
            .required(t('validation.blankField'))
            .test('password-format', t('validation.invalidPassword'), (value) => {
                if (!value) return true;
                return RegexConstants.PASSWORD_REGEX.test(value);
            })
            .test('new-password-match', t('validation.newPasswordMatchesCurrent'), function (value) {
                return this.parent.currentPassword !== value;
            }),
        confirm: yup
            .string()
            .oneOf([yup.ref('newPassword')], t('validation.passwordMismatch'))
            .required(t('validation.blankField')),
    }), [t]);

    const emailValidationSchema = useMemo(() => yup.object({
        email: yup
            .string()
            .required(t('validation.blankField'))
            .email(t('validation.invalidEmail')),
    }), [t]);

    const profileValidationSchema = useMemo(() => yup.object({
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

    const hasContactChanges = !!user && (
        (profileFormState.firstName || '').trim() !== (user.firstName || '').trim() ||
        (profileFormState.lastName || '').trim() !== (user.lastName || '').trim() ||
        (profileFormState.phoneNumber || '').trim() !== (user.phoneNumber || '').trim()
    );

    useEffect(() => {
        if (user) {
            setNewEmail(user.email);
            setProfileFormState({
                firstName: user.firstName,
                lastName: user.lastName,
                phoneNumber: user.phoneNumber,
            });
        }
    }, [user]);

    useEffect(() => {
        return () => {
            dispatch(clearChangePasswordForm());
        };
    }, [dispatch]);

    const handleEmailChange = async () => {
        try {
            await emailValidationSchema.validate({ email: newEmail });
            setEmailError(undefined);
        } catch (err) {
            const validationError = err as yup.ValidationError;
            setEmailError(validationError.message);
            return;
        }

        if (user && newEmail !== user.email) {
            changeEmail({ newEmail })
                .unwrap()
                .then(() => {
                    setIsEditingEmail(false);
                    dispatch(addAlert({ message: t('profile.emailChanged'), type: 'success' }));
                    refetch();
                })
                .catch((err: any) => {
                    dispatch(addAlert({
                        message: err?.data?.message || t('profile.emailChangeFailure'),
                        type: 'error'
                    }));
                });
        }
    };

    const handlePasswordChange = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            await passwordValidationSchema.validate(passwordFormState, { abortEarly: false });
            setPasswordErrors({});
        } catch (err) {
            const validationError = err as yup.ValidationError;
            if (validationError.inner) {
                const formattedErrors: PasswordValidationErrors = {};
                validationError.inner.forEach((error) => {
                    if (error.path) {
                        formattedErrors[error.path as keyof ChangePasswordFormState] = error.message;
                    }
                });
                setPasswordErrors(formattedErrors);
            }
            return;
        }

        try {
            await changePassword(passwordFormState).unwrap();
            dispatch(addAlert({ message: t('profile.passwordChanged'), type: 'success' }));
            dispatch(clearChangePasswordForm());
        } catch (err: any) {
            dispatch(addAlert({
                message: err?.data?.message || t('profile.passwordChangeFailure'),
                type: 'error'
            }));
        }
    };

    const handleProfileChange = async () => {
        try {
            await profileValidationSchema.validate(profileFormState, { abortEarly: false });
            setProfileErrors({});
        } catch (err) {
            const validationError = err as yup.ValidationError;
            if (validationError.inner) {
                const formattedErrors: ProfileValidationErrors = {};
                validationError.inner.forEach((error) => {
                    if (error.path) {
                        formattedErrors[error.path as keyof EditProfileFormState] = error.message;
                    }
                });
                setProfileErrors(formattedErrors);
            }
            return;
        }

        try {
            await editProfile(profileFormState).unwrap();
            setIsEditingContact(false);
            dispatch(addAlert({ message: t('profile.profileUpdated'), type: 'success' }));
            refetch();
        } catch (err: any) {
            dispatch(addAlert({
                message: err?.data?.message || t('profile.profileUpdateFailure'),
                type: 'error'
            }));
        }
    };

    const handlePasswordFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const name = event.target.name as keyof ChangePasswordFormState;
        const value = event.target.value;

        dispatch(updateChangePasswordFormField({ field: name, value }));

        if (passwordErrors[name]) {
            setPasswordErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const handleProfileFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const name = event.target.name as keyof EditProfileFormState;
        const value = event.target.value;

        setProfileFormState((prev) => ({ ...prev, [name]: value }));

        if (profileErrors[name]) {
            setProfileErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    if (isLoading) {
        return (
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                        <Skeleton variant="circular" width={60} height={60} />
                        <Box sx={{ width: '100%' }}>
                            <Skeleton variant="text" width="40%" height={40} />
                            <Skeleton variant="text" width="25%" height={25} />
                        </Box>
                    </Box>
                    <Divider sx={{ mb: 3 }} />
                    <Skeleton variant="rectangular" height={150} sx={{ borderRadius: 2, mb: 3 }} />
                    <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
                </Paper>
            </Container>
        );
    }

    if (!user) {
        return (
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Paper elevation={3} sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
                    <Typography color="error" variant="h5" fontWeight="bold" gutterBottom>
                        {t('common.error')}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        {t('profile.notFound')}
                    </Typography>
                </Paper>
            </Container>
        );
    }

    const canEditContact = user.role === Role.CLIENT || user.role === Role.MANAGER || user.role === Role.EMPLOYEE;

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
                            <PersonIcon sx={{ fontSize: { xs: 28, sm: 32 } }} />
                        </Box>
                        <Box>
                            <Typography variant="h4" component="h1" fontWeight="bold" sx={{ fontSize: { xs: '1.5rem', sm: '2.125rem' } }}>
                                {user.firstName ? `${user.firstName} ${user.lastName}` : user.email}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                                {t('profile.subtitle')}
                            </Typography>
                        </Box>
                    </Box>

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
                </Box>

                <Divider sx={{ mb: 2 }} />

                {/* Email Section */}
                <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                        <Typography variant="h6" fontWeight="bold" color="text.secondary">
                            {t('profile.accountDetails')}
                        </Typography>
                        {!isEditingEmail && (
                            <IconButton onClick={() => setIsEditingEmail(true)} color="primary">
                                <EditIcon />
                            </IconButton>
                        )}
                    </Box>
                    {isEditingEmail ? (
                        <Grid container spacing={1.5}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label={t('profile.email')}
                                    value={newEmail}
                                    onChange={(e) => {
                                        setNewEmail(e.target.value);
                                        if (emailError) {
                                            setEmailError(undefined);
                                        }
                                    }}
                                    variant="outlined"
                                    error={!!emailError}
                                    helperText={emailError}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2.5,
                                            transition: 'all 0.2s',
                                        }
                                    }}
                                />
                            </Grid>
                        </Grid>
                    ) : (
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                    <PersonIcon color="primary" sx={{ mt: 0.5, fontSize: 28 }} />
                                    <Box>
                                        <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
                                            {t('profile.email')}
                                        </Typography>
                                        <Typography variant="body1" sx={{ mt: 0.5, fontSize: '1.1rem' }}>
                                            {user.email}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                    )}
                    {isEditingEmail && (
                        <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                            <Button
                                startIcon={<SaveIcon />}
                                onClick={handleEmailChange}
                                disabled={isChangingEmail || newEmail === user.email}
                                variant="contained"
                                color="primary"
                                sx={{ textTransform: 'none', fontWeight: 'bold', borderRadius: 2 }}
                            >
                                {t('profile.save')}
                            </Button>
                            <Button
                                startIcon={<CancelIcon />}
                                onClick={() => {
                                    setIsEditingEmail(false);
                                    setNewEmail(user.email);
                                    setEmailError(undefined);
                                }}
                                variant="outlined"
                                color="inherit"
                                sx={{ textTransform: 'none', fontWeight: 'bold', borderRadius: 2 }}
                            >
                                {t('profile.cancel')}
                            </Button>
                        </Box>
                    )}
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Contact Information Section */}
                {user.role !== 'ADMIN' && (
                    <>
                        <Box sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                                <Typography variant="h6" fontWeight="bold" color="text.secondary">
                                    {t('profile.personalInformation')}
                                </Typography>
                                {canEditContact && !isEditingContact && (
                                    <IconButton onClick={() => setIsEditingContact(true)} color="primary">
                                        <EditIcon />
                                    </IconButton>
                                )}
                            </Box>
                            {isEditingContact ? (
                                <Grid container spacing={1.5}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label={t('profile.firstName')}
                                            name="firstName"
                                            value={profileFormState.firstName}
                                            onChange={handleProfileFormChange}
                                            variant="outlined"
                                            error={!!profileErrors.firstName}
                                            helperText={profileErrors.firstName}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 2.5,
                                                    transition: 'all 0.2s',
                                                }
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label={t('profile.lastName')}
                                            name="lastName"
                                            value={profileFormState.lastName}
                                            onChange={handleProfileFormChange}
                                            variant="outlined"
                                            error={!!profileErrors.lastName}
                                            helperText={profileErrors.lastName}
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
                                            fullWidth
                                            label={t('profile.phoneNumber')}
                                            name="phoneNumber"
                                            value={profileFormState.phoneNumber}
                                            onChange={handleProfileFormChange}
                                            variant="outlined"
                                            error={!!profileErrors.phoneNumber}
                                            helperText={profileErrors.phoneNumber}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 2.5,
                                                    transition: 'all 0.2s',
                                                }
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            ) : (
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                            <PersonIcon color="primary" sx={{ mt: 0.5, fontSize: 28 }} />
                                            <Box>
                                                <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
                                                    {t('profile.firstName')}
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
                                                    {t('profile.lastName')}
                                                </Typography>
                                                <Typography variant="body1" sx={{ mt: 0.5, fontSize: '1.1rem' }}>
                                                    {user.lastName || '-'}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                            <Phone color="primary" sx={{ mt: 0.5, fontSize: 28 }} />
                                            <Box>
                                                <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
                                                    {t('profile.phoneNumber')}
                                                </Typography>
                                                <Typography variant="body1" sx={{ mt: 0.5, fontSize: '1.1rem' }}>
                                                    {user.phoneNumber || '-'}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Grid>
                                </Grid>
                            )}
                            {isEditingContact && (
                                <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                                    <Button
                                        startIcon={<SaveIcon />}
                                        onClick={handleProfileChange}
                                        disabled={isUpdatingProfile || !hasContactChanges}
                                        variant="contained"
                                        color="primary"
                                        sx={{ textTransform: 'none', fontWeight: 'bold', borderRadius: 2 }}
                                    >
                                        {t('profile.save')}
                                    </Button>
                                    <Button
                                        startIcon={<CancelIcon />}
                                        onClick={() => {
                                            setIsEditingContact(false);
                                            setProfileFormState({
                                                firstName: user.firstName,
                                                lastName: user.lastName,
                                                phoneNumber: user.phoneNumber,
                                            });
                                            setProfileErrors({});
                                        }}
                                        variant="outlined"
                                        color="inherit"
                                        sx={{ textTransform: 'none', fontWeight: 'bold', borderRadius: 2 }}
                                    >
                                        {t('profile.cancel')}
                                    </Button>
                                </Box>
                            )}
                        </Box>
                        <Divider sx={{ my: 2 }} />
                    </>
                )}

                {/* Change Password Section */}
                <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                        <Typography variant="h6" fontWeight="bold" color="text.secondary">
                            {t('profile.changePassword')}
                        </Typography>
                        {!showPasswordSection && (
                            <IconButton
                                onClick={() => {
                                    setShowPasswordSection(true);
                                    dispatch(clearChangePasswordForm());
                                    setPasswordErrors({});
                                    setShowCurrentPassword(false);
                                    setShowNewPassword(false);
                                    setShowConfirmPassword(false);
                                }}
                                color="primary"
                            >
                                <EditIcon />
                            </IconButton>
                        )}
                    </Box>
                </Box>

                {showPasswordSection && (
                    <Box component="form" noValidate onSubmit={handlePasswordChange} sx={{ mt: 1.5 }}>
                        <Grid container spacing={1.5}>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="currentPassword"
                                    label={t('profile.currentPassword')}
                                    type={showCurrentPassword ? 'text' : 'password'}
                                    id="currentPassword"
                                    value={passwordFormState.currentPassword || ''}
                                    onChange={handlePasswordFormChange}
                                    error={!!passwordErrors.currentPassword}
                                    helperText={passwordErrors.currentPassword}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2.5,
                                            transition: 'all 0.2s',
                                        }
                                    }}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle current password visibility"
                                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                    onMouseDown={(e) => e.preventDefault()}
                                                    edge="end"
                                                >
                                                    {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="newPassword"
                                    label={t('profile.newPassword')}
                                    type={showNewPassword ? 'text' : 'password'}
                                    id="newPassword"
                                    value={passwordFormState.newPassword || ''}
                                    onChange={handlePasswordFormChange}
                                    error={!!passwordErrors.newPassword}
                                    helperText={passwordErrors.newPassword}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2.5,
                                            transition: 'all 0.2s',
                                        }
                                    }}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle new password visibility"
                                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                                    onMouseDown={(e) => e.preventDefault()}
                                                    edge="end"
                                                >
                                                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="confirm"
                                    label={t('profile.confirmNewPassword')}
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    id="confirm"
                                    value={passwordFormState.confirm || ''}
                                    onChange={handlePasswordFormChange}
                                    error={!!passwordErrors.confirm}
                                    helperText={passwordErrors.confirm}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2.5,
                                            transition: 'all 0.2s',
                                        }
                                    }}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle confirm password visibility"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    onMouseDown={(e) => e.preventDefault()}
                                                    edge="end"
                                                >
                                                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                            <Button
                                type="submit"
                                startIcon={<SaveIcon />}
                                disabled={isChangingPassword}
                                variant="contained"
                                color="primary"
                                sx={{ textTransform: 'none', fontWeight: 'bold', borderRadius: 2 }}
                            >
                                {t('profile.save')}
                            </Button>
                            <Button
                                startIcon={<CancelIcon />}
                                onClick={() => {
                                    setShowPasswordSection(false);
                                    dispatch(clearChangePasswordForm());
                                    setPasswordErrors({});
                                    setShowCurrentPassword(false);
                                    setShowNewPassword(false);
                                    setShowConfirmPassword(false);
                                }}
                                variant="outlined"
                                color="inherit"
                                sx={{ textTransform: 'none', fontWeight: 'bold', borderRadius: 2 }}
                            >
                                {t('profile.cancel')}
                            </Button>
                        </Box>
                    </Box>
                )}
            </Paper>
        </Container>
    );
};

export default ProfilePage;
