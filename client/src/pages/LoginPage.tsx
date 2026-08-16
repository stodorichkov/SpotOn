import React, { useEffect, useState } from 'react';
import { TextField, Button, Container, Typography, Box, Paper, Grid, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { updateLoginFormField, clearLoginForm } from '../features/auth/loginSlice';
import * as yup from 'yup';
import { MessageConstants } from '../constants';
import { useLoginMutation, ClientLoginRequest } from '../features/auth/authApi';
import { useNavigate } from 'react-router-dom';
import { addAlert } from '../features/alerts/alertsSlice';

type LoginFormState = ClientLoginRequest;
type ValidationErrors = Partial<Record<keyof LoginFormState, string>>;

const validationSchema = yup.object({
    username: yup
        .string()
        .required(MessageConstants.BLANK_FIELD),
    password: yup
        .string()
        .required(MessageConstants.BLANK_FIELD),
});

const LoginPage = () => {
    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();
    const formState = useSelector((state: RootState) => state.loginForm as LoginFormState);
    const [login, { isLoading }] = useLoginMutation();
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [showPassword, setShowPassword] = useState(false);

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
            dispatch(addAlert({ message: 'Logged in successfully!', type: 'success' }));
            navigate('/');
        } catch (err) {
            // The error will be handled by the middleware
        }
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ padding: 4, marginTop: 8, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography component="h1" variant="h5">
                        Login
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>

                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="username"
                                    label="Username"
                                    name="username"
                                    value={formState.username || ''}
                                    onChange={handleChange}
                                    error={!!errors.username}
                                    helperText={errors.username || ' '}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    value={formState.password || ''}
                                    onChange={handleChange}
                                    error={!!errors.password}
                                    helperText={errors.password || ' '}
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
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{
                                mt: 3,
                                fontWeight: 'bold',
                                textTransform: 'none',
                            }}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Logging in...' : 'Login'}
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default LoginPage;