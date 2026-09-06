import React, { useEffect, useMemo, useState } from 'react';
import { TextField, Button, Container, Typography, Box, Paper, Grid, InputAdornment, IconButton, Avatar } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import LockIcon from '@mui/icons-material/Lock';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { RootState, AppDispatch } from '../store/store';
import { updateLoginFormField, clearLoginForm } from '../features/auth/loginSlice';
import * as yup from 'yup';
import { useLoginMutation, ClientLoginRequest } from '../features/auth/authApi';
import { useNavigate, Link } from 'react-router-dom';
import { addAlert } from '../features/alerts/alertsSlice';

type LoginFormState = ClientLoginRequest;
type ValidationErrors = Partial<Record<keyof LoginFormState, string>>;

const LoginPage = () => {
    const { t } = useTranslation();
    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();
    const formState = useSelector((state: RootState) => state.loginForm as LoginFormState);
    const [login, { isLoading }] = useLoginMutation();
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [showPassword, setShowPassword] = useState(false);

    const validationSchema = useMemo(() => yup.object({
        email: yup
            .string()
            .required(t('validation.blankField')),
        password: yup
            .string()
            .required(t('validation.blankField')),
    }), [t]);

    useEffect(() => {
        return () => {
            dispatch(clearLoginForm());
        };
    }, [dispatch]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const name = event.target.name as keyof LoginFormState;
        const value = event.target.value;

        dispatch(updateLoginFormField({ field: name, value }));

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
                        formattedErrors[error.path as keyof LoginFormState] = error.message;
                    }
                });
                setErrors(formattedErrors);
            }
            return;
        }

        try {
            await login(formState).unwrap();
            dispatch(addAlert({ message: t('login.success'), type: 'success' }));
            navigate('/');
        } catch (err: any) {
            dispatch(addAlert({
                message: err?.data?.message || t('login.failure'),
                type: 'error'
            }));
        }
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
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
                            backgroundColor: 'primary.main',
                            color: 'primary.contrastText',
                            width: 52,
                            height: 52
                        }}
                    >
                        <LockIcon sx={{ fontSize: 28 }} />
                    </Avatar>

                    <Typography component="h1" variant="h5" fontWeight="bold" sx={{ mt: 1 }}>
                        {t('login.title')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 0.5, mb: 3 }}>
                        {t('login.subtitle')}
                    </Typography>

                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ width: '100%' }}>
                        <Grid container spacing={1.5}>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label={t('login.email')}
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
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    label={t('login.password')}
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
                        </Grid>

                        <Box sx={{ mt: 1, textAlign: 'right' }}>
                            <Link to="/forgot-password" style={{ textDecoration: 'none', color: '#1976d2', fontWeight: 'bold', fontSize: '0.875rem' }}>
                                {t('login.forgotPasswordLink')}
                            </Link>
                        </Box>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            sx={{
                                mt: 2,
                                py: 1.2,
                                fontWeight: 'bold',
                                textTransform: 'none',
                                borderRadius: 2,
                                fontSize: '1rem'
                            }}
                            disabled={isLoading}
                        >
                            {isLoading ? t('login.loggingIn') : t('login.loginButton')}
                        </Button>

                        <Box sx={{ mt: 3, textAlign: 'center' }}>
                            <Typography variant="body2" color="text.secondary">
                                {t('login.noAccount')}{' '}
                                <Link to="/register" style={{ textDecoration: 'none', color: '#1976d2', fontWeight: 'bold' }}>
                                    {t('login.registerLink')}
                                </Link>
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default LoginPage;
