import React, { useMemo, useState } from 'react';
import { TextField, Button, Container, Typography, Box, Paper, Grid, Avatar } from '@mui/material';
import LockResetIcon from '@mui/icons-material/LockReset';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { AppDispatch } from '../store/store';
import * as yup from 'yup';
import { useResetPasswordMutation } from '../features/auth/authApi';
import { useNavigate } from 'react-router-dom';
import { addAlert } from '../features/alerts/alertsSlice';

const ForgotPasswordPage = () => {
    const { t } = useTranslation();
    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();
    const [resetPassword, { isLoading }] = useResetPasswordMutation();
    const [email, setEmail] = useState('');
    const [error, setError] = useState<string | undefined>(undefined);

    const validationSchema = useMemo(() => yup.object({
        email: yup
            .string()
            .required(t('validation.blankField'))
            .email(t('validation.invalidEmail')),
    }), [t]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
        if (error) {
            setError(undefined);
        }
    };

    const handleSubmit: React.ComponentProps<'form'>['onSubmit'] = async (event) => {
        event.preventDefault();

        try {
            await validationSchema.validate({ email }, { abortEarly: false });
            setError(undefined);
        } catch (err) {
            const validationError = err as yup.ValidationError;
            setError(validationError.message);
            return;
        }

        try {
            await resetPassword({ email: email.trim() }).unwrap();
            dispatch(addAlert({ message: t('forgotPassword.success'), type: 'success' }));
            navigate('/login');
        } catch (err: any) {
            dispatch(addAlert({
                message: err?.data?.message || t('forgotPassword.failure'),
                type: 'error'
            }));
        }
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
                        <LockResetIcon sx={{ fontSize: 28 }} />
                    </Avatar>

                    <Typography component="h1" variant="h5" fontWeight="bold" sx={{ mt: 1 }}>
                        {t('forgotPassword.title')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 0.5, mb: 3 }}>
                        {t('forgotPassword.subtitle')}
                    </Typography>

                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ width: '100%' }}>
                        <Grid container spacing={1.5}>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label={t('forgotPassword.email')}
                                    name="email"
                                    type="email"
                                    value={email}
                                    onChange={handleChange}
                                    error={!!error}
                                    helperText={error}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2.5,
                                            transition: 'all 0.2s',
                                        }
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
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
                            {isLoading ? t('forgotPassword.submitting') : t('forgotPassword.submitButton')}
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default ForgotPasswordPage;
