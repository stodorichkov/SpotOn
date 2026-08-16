import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Grid, TextField, Button, Skeleton, Box, IconButton, InputAdornment } from '@mui/material';
import { useGetProfileQuery, useChangeUsernameMutation, useChangePasswordMutation, useEditProfileMutation, ChangePasswordRequest, EditProfileRequest } from '../features/auth/authApi';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { updateChangePasswordFormField, clearChangePasswordForm } from '../features/auth/changePasswordSlice';
import { addAlert } from '../features/alerts/alertsSlice';
import * as yup from 'yup';
import { RegexConstants, MessageConstants } from '../constants';

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

    const [isEditingContact, setIsEditingContact] = useState(false);
    const [profileFormState, setProfileFormState] = useState<EditProfileFormState>({ firstName: '', lastName: '', phoneNumber: '' });
    const [profileErrors, setProfileErrors] = useState<ProfileValidationErrors>({});

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
                <Typography variant="h4" gutterBottom>
                    <Skeleton width="20%" />
                </Typography>
                {/* Skeleton for sections */}
            </Container>
        );
    }

    if (!user) {
        return <Typography>User not found.</Typography>;
    }

    const isClient = user.role === 'CLIENT';

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Profile
            </Typography>

            {/* Username Section */}
            <Paper sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" gutterBottom>
                        Username
                    </Typography>
                    {isClient && !isEditingUsername && (
                        <IconButton onClick={() => setIsEditingUsername(true)}>
                            <EditIcon />
                        </IconButton>
                    )}
                </Box>
                <TextField
                    fullWidth
                    label="Username"
                    value={isEditingUsername ? newUsername : user.username}
                    onChange={(e) => {
                        setNewUsername(e.target.value)
                        if (usernameError) {
                            setUsernameError(undefined);
                        }
                    }}
                    InputProps={{
                        readOnly: !isEditingUsername,
                    }}
                    variant={isEditingUsername ? 'outlined' : 'filled'}
                    error={!!usernameError}
                    helperText={usernameError || ' '}
                />
                {isEditingUsername && (
                    <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                        <Button
                            startIcon={<SaveIcon />}
                            onClick={handleUsernameChange}
                            disabled={isChangingUsername || newUsername === user.username}
                            variant="contained"
                            color="primary"
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
                        >
                            Cancel
                        </Button>
                    </Box>
                )}
            </Paper>

            {/* Contact Information Section */}
            {user.role !== 'ADMIN' && (
                <Paper sx={{ p: 3, mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6" gutterBottom>
                            Contact Information
                        </Typography>
                        {isClient && !isEditingContact && (
                            <IconButton onClick={() => setIsEditingContact(true)}>
                                <EditIcon />
                            </IconButton>
                        )}
                    </Box>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="First Name"
                                name="firstName"
                                value={isEditingContact ? profileFormState.firstName : user.firstName}
                                onChange={handleProfileFormChange}
                                InputProps={{ readOnly: !isEditingContact }}
                                variant={isEditingContact ? 'outlined' : 'filled'}
                                error={!!profileErrors.firstName}
                                helperText={profileErrors.firstName || ' '}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Last Name"
                                name="lastName"
                                value={isEditingContact ? profileFormState.lastName : user.lastName}
                                onChange={handleProfileFormChange}
                                InputProps={{ readOnly: !isEditingContact }}
                                variant={isEditingContact ? 'outlined' : 'filled'}
                                error={!!profileErrors.lastName}
                                helperText={profileErrors.lastName || ' '}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Phone Number"
                                name="phoneNumber"
                                value={isEditingContact ? profileFormState.phoneNumber : user.phoneNumber}
                                onChange={handleProfileFormChange}
                                InputProps={{ readOnly: !isEditingContact }}
                                variant={isEditingContact ? 'outlined' : 'filled'}
                                error={!!profileErrors.phoneNumber}
                                helperText={profileErrors.phoneNumber || ' '}
                            />
                        </Grid>
                    </Grid>
                    {isEditingContact && (
                        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                            <Button
                                startIcon={<SaveIcon />}
                                onClick={handleProfileChange}
                                disabled={isUpdatingProfile}
                                variant="contained"
                                color="primary"
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
                            >
                                Cancel
                            </Button>
                        </Box>
                    )}
                </Paper>
            )}

            {/* Change Password Section */}
            <Paper component="form" noValidate onSubmit={handlePasswordChange} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Change Password
                </Typography>
                <Grid container spacing={2}>
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
                            helperText={passwordErrors.currentPassword || ' '}
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
                            helperText={passwordErrors.newPassword || ' '}
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
                            helperText={passwordErrors.confirm || ' '}
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
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{
                        mt: 3,
                        fontWeight: 'bold',
                        textTransform: 'none',
                    }}
                    disabled={isChangingPassword}
                >
                    {isChangingPassword ? 'Changing Password...' : 'Change Password'}
                </Button>
            </Paper>
        </Container>
    );
};

export default ProfilePage;