import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Grid, TextField, Button, Skeleton, Box, IconButton, InputAdornment, Divider, Chip } from '@mui/material';
import { useGetProfileQuery, useChangeUsernameMutation, useChangePasswordMutation, useEditProfileMutation, ChangePasswordRequest, EditProfileRequest } from '../features/auth/authApi';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import PersonIcon from '@mui/icons-material/Person';
import { Visibility, VisibilityOff, Phone } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { updateChangePasswordFormField, clearChangePasswordForm } from '../features/auth/changePasswordSlice';
import { addAlert } from '../features/alerts/alertsSlice';
import * as yup from 'yup';
import { RegexConstants, MessageConstants, Role } from '../constants';

type ChangePasswordFormState = ChangePasswordRequest;
type EditProfileFormState = EditProfileRequest;
type PasswordValidationErrors = Partial<Record<keyof ChangePasswordFormState, string>>;
type ProfileValidationErrors = Partial<Record<keyof EditProfileFormState, string>>;

const passwordValidationSchema = yup.object({
    currentPassword: yup
        .string()
        .required(MessageConstants.BLANK_FIELD),
    newPassword: yup
        .string()
        .required(MessageConstants.BLANK_FIELD)
        .test('password-format', MessageConstants.INVALID_PASSWORD, (value) => {
            if (!value) return true;
            return RegexConstants.PASSWORD_REGEX.test(value);
        })
        .test('new-password-match', MessageConstants.NEW_PASSWORD_MATCHES_CURRENT, function (value) {
            return this.parent.currentPassword !== value;
        }),
    confirm: yup
        .string()
        .oneOf([yup.ref('newPassword')], MessageConstants.PASSWORD_MISMATCH)
        .required(MessageConstants.BLANK_FIELD),
});

const usernameValidationSchema = yup.object({
    username: yup
        .string()
        .required(MessageConstants.BLANK_FIELD)
        .test('username-format', MessageConstants.INVALID_USERNAME, (value) => {
            if (!value) return true;
            return RegexConstants.USERNAME_REGEX.test(value);
        }),
});

const profileValidationSchema = yup.object({
    firstName: yup
        .string()
        .required(MessageConstants.BLANK_FIELD)
        .test('firstName-format', MessageConstants.INVALID_NAME, (value) => {
            if (!value) return true;
            return RegexConstants.NAME_REGEX.test(value);
        }),
    lastName: yup
        .string()
        .required(MessageConstants.BLANK_FIELD)
        .test('lastName-format', MessageConstants.INVALID_NAME, (value) => {
            if (!value) return true;
            return RegexConstants.NAME_REGEX.test(value);
        }),
    phoneNumber: yup
        .string()
        .required(MessageConstants.BLANK_FIELD)
        .test('phoneNumber-format', MessageConstants.INVALID_PHONE_NUMBER, (value) => {
            if (!value) return true;
            return RegexConstants.PHONE_NUMBER_REGEX.test(value);
        }),
});

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
    const { data: user, isLoading, refetch } = useGetProfileQuery();
    const [changeUsername, { isLoading: isChangingUsername }] = useChangeUsernameMutation();
    const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();
    const [editProfile, { isLoading: isUpdatingProfile }] = useEditProfileMutation();
    const dispatch: AppDispatch = useDispatch();
    const passwordFormState = useSelector((state: RootState) => state.changePasswordForm as ChangePasswordFormState);

    const [isEditingUsername, setIsEditingUsername] = useState(false);
    const [newUsername, setNewUsername] = useState('');
    const [passwordErrors, setPasswordErrors] = useState<PasswordValidationErrors>({});
    const [usernameError, setUsernameError] = useState<string | undefined>(undefined);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showPasswordSection, setShowPasswordSection] = useState(false);

    const [isEditingContact, setIsEditingContact] = useState(false);
    const [profileFormState, setProfileFormState] = useState<EditProfileFormState>({ firstName: '', lastName: '', phoneNumber: '' });
    const [profileErrors, setProfileErrors] = useState<ProfileValidationErrors>({});

    const hasContactChanges = !!user && (
        (profileFormState.firstName || '').trim() !== (user.firstName || '').trim() ||
        (profileFormState.lastName || '').trim() !== (user.lastName || '').trim() ||
        (profileFormState.phoneNumber || '').trim() !== (user.phoneNumber || '').trim()
    );

    useEffect(() => {
        if (user) {
            setNewUsername(user.username);
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

    const handleUsernameChange = async () => {
        try {
            await usernameValidationSchema.validate({ username: newUsername });
            setUsernameError(undefined);
        } catch (err) {
            const validationError = err as yup.ValidationError;
            setUsernameError(validationError.message);
            return;
        }

        if (user && newUsername !== user.username) {
            changeUsername({ newUsername })
                .unwrap()
                .then(() => {
                    setIsEditingUsername(false);
                    dispatch(addAlert({ message: 'Username changed successfully!', type: 'success' }));
                    refetch();
                })
                .catch(() => {
                    // Error is handled by the global error handling middleware
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
            dispatch(addAlert({ message: 'Password changed successfully!', type: 'success' }));
            dispatch(clearChangePasswordForm());
        } catch (err) {
            // The error will be handled by the middleware
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
            dispatch(addAlert({ message: 'Profile updated successfully!', type: 'success' }));
            refetch();
        } catch (err) {
            // The error will be handled by the middleware
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
                        Error
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        User profile not found.
                    </Typography>
                </Paper>
            </Container>
        );
    }

    const isClient = user.role === Role.CLIENT;
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
                                {user.firstName ? `${user.firstName} ${user.lastName}` : user.username}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                                Account Profile & Security Settings
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

                {/* Username Section */}
                <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                        <Typography variant="h6" fontWeight="bold" color="text.secondary">
                            Account Details
                        </Typography>
                        {isClient && !isEditingUsername && (
                            <IconButton onClick={() => setIsEditingUsername(true)} color="primary">
                                <EditIcon />
                            </IconButton>
                        )}
                    </Box>
                    {isEditingUsername ? (
                        <Grid container spacing={1.5}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Username"
                                    value={newUsername}
                                    onChange={(e) => {
                                        setNewUsername(e.target.value);
                                        if (usernameError) {
                                            setUsernameError(undefined);
                                        }
                                    }}
                                    variant="outlined"
                                    error={!!usernameError}
                                    helperText={usernameError}
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
                                            Username
                                        </Typography>
                                        <Typography variant="body1" sx={{ mt: 0.5, fontSize: '1.1rem' }}>
                                            {user.username}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                    )}
                    {isEditingUsername && (
                        <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                            <Button
                                startIcon={<SaveIcon />}
                                onClick={handleUsernameChange}
                                disabled={isChangingUsername || newUsername === user.username}
                                variant="contained"
                                color="primary"
                                sx={{ textTransform: 'none', fontWeight: 'bold', borderRadius: 2 }}
                            >
                                Save
                            </Button>
                            <Button
                                startIcon={<CancelIcon />}
                                onClick={() => {
                                    setIsEditingUsername(false);
                                    setNewUsername(user.username);
                                    setUsernameError(undefined);
                                }}
                                variant="outlined"
                                color="inherit"
                                sx={{ textTransform: 'none', fontWeight: 'bold', borderRadius: 2 }}
                            >
                                Cancel
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
                                    Personal Information
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
                                            label="First Name"
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
                                            label="Last Name"
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
                                            label="Phone Number"
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
                                                    First Name
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
                                                    Last Name
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
                                                    Phone Number
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
                                        Save
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
                                        Cancel
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
                            Change Password
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
                                    label="Current Password"
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
                                    label="New Password"
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
                                    label="Confirm New Password"
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
                                Save
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
                                Cancel
                            </Button>
                        </Box>
                    </Box>
                )}
            </Paper>
        </Container>
    );
};

export default ProfilePage;