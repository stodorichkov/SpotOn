import React, { useEffect, useMemo, useState } from 'react';
import { TextField, Button, Container, Typography, Box, Paper, Grid, InputAdornment, IconButton, Avatar } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { RootState, AppDispatch } from '../store/store';
import { updateRegisterFormField, clearRegisterForm } from '../features/auth/registerSlice';
import * as yup from 'yup';
import { RegexConstants } from '../constants';
import { useRegisterClientMutation, ClientRegistrationRequest } from '../features/auth/authApi';
import { useNavigate, Link } from 'react-router-dom';
import { addAlert } from '../features/alerts/alertsSlice';

type RegisterFormState = ClientRegistrationRequest & { confirm: string };
type ValidationErrors = Partial<Record<keyof RegisterFormState, string>>;

const RegisterPage = () => {
    const { t } = useTranslation();
    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();
    const formState = useSelector((state: RootState) => state.registerForm as RegisterFormState);
    const [registerClient, { isLoading }] = useRegisterClientMutation();
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
        password: yup
            .string()
            .required(t('validation.blankField'))
            .test('password-format', t('validation.invalidPassword'), (value) => {
                if (!value) return true;
                return RegexConstants.PASSWORD_REGEX.test(value);
            }),
        confirm: yup
            .string()
            .oneOf([yup.ref('password')], t('validation.passwordMismatch'))
            .required(t('validation.blankField')),
    }), [t]);

    useEffect(() => {
        return () => {
            dispatch(clearRegisterForm());
        };
    }, [dispatch]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const name = event.target.name as keyof RegisterFormState;
        const value = event.target.value;

        dispatch(updateRegisterFormField({ field: name as any, value }));

        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const handleSubmit: React.ComponentProps<'form'>['onSubmit'] = async (event) => {
        event.preventDefault();

        try {
            await validationSchema.validate(formState, { abortEarly: false });
            setErrors({});
        } catch (err) {
            const validationError = err as yup.ValidationError;
            if (validationError.inner) {
                const formattedErrors: ValidationErrors = {};
                validationError.inner.forEach((error) => {
                    if (error.path) {
                        formattedErrors[error.path as keyof RegisterFormState] = error.message;
                    }
                });
                setErrors(formattedErrors);
            }
            return;
        }

        try {
            await registerClient(formState as ClientRegistrationRequest).unwrap();
            dispatch(addAlert({ message: t('register.success'), type: 'success' }));
            navigate('/login');
        } catch (err: any) {
            dispatch(addAlert({
                message: err?.data?.message || t('register.failure'),
                type: 'error'
            }));
        }
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleClickShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    return (
        <Container maxWidth="xs" sx={{ mt: { xs: 4, sm: 8 }, mb: 4, px: { xs: 2, sm: 0 } }}>
            <Paper elevation={3} sx={{ p: { xs: 3, sm: 4 }, borderRadius: 3 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Avatar
                        sx={{
                            m: 1,
                            backgroundColor: 'secondary.main',
                            color: 'secondary.contrastText',
                            width: 52,
                            height: 52
                        }}
                    >
                        <PersonAddIcon sx={{ fontSize: 28 }} />
                    </Avatar>

                    <Typography component="h1" variant="h5" fontWeight="bold" sx={{ mt: 1 }}>
                        {t('register.title')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 0.5, mb: 3 }}>
                        {t('register.subtitle')}
                    </Typography>

                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ width: '100%' }}>
                        <Grid container spacing={1.5}>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label={t('register.email')}
                                    name="email"
                                    type="email"
                                    value={formState.email || ''}
                                    onChange={handleChange}
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
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id="firstName"
                                    label={t('register.firstName')}
                                    name="firstName"
                                    value={formState.firstName || ''}
                                    onChange={handleChange}
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
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id="lastName"
                                    label={t('register.lastName')}
                                    name="lastName"
                                    value={formState.lastName || ''}
                                    onChange={handleChange}
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
                                    label={t('register.phoneNumber')}
                                    name="phoneNumber"
                                    value={formState.phoneNumber || ''}
                                    onChange={handleChange}
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
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    label={t('register.password')}
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    value={formState.password || ''}
                                    onChange={handleChange}
                                    error={!!errors.password}
                                    helperText={errors.password}
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
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
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
                                    label={t('register.confirmPassword')}
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    id="confirm"
                                    value={formState.confirm || ''}
                                    onChange={handleChange}
                                    error={!!errors.confirm}
                                    helperText={errors.confirm}
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
                                                    onClick={handleClickShowConfirmPassword}
                                                    onMouseDown={handleMouseDownPassword}
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
                            color="secondary"
                            sx={{
                                mt: 3,
                                py: 1.2,
                                fontWeight: 'bold',
                                textTransform: 'none',
                                borderRadius: 2,
                                fontSize: '1rem'
                            }}
                            disabled={isLoading}
                        >
                            {isLoading ? t('register.registering') : t('register.registerButton')}
                        </Button>

                        <Box sx={{ mt: 3, textAlign: 'center' }}>
                            <Typography variant="body2" color="text.secondary">
                                {t('register.haveAccount')}{' '}
                                <Link to="/login" style={{ textDecoration: 'none', color: '#b71c1c', fontWeight: 'bold' }}>
                                    {t('register.loginLink')}
                                </Link>
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default RegisterPage;
