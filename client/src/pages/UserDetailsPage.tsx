import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetUserDetailsQuery } from '../features/users/usersSlice';
import { Container, Typography, Paper, Grid, TextField, CircularProgress, Box } from '@mui/material';

const UserDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { data: user, isLoading, error } = useGetUserDetailsQuery(Number(id));

    if (isLoading) {
        return (
            <Container maxWidth="md" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
            </Container>
        );
    }

    if (error || !user) {
        return <Typography color="error">Error loading user details or user not found.</Typography>;
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                User Details
            </Typography>

            {/* User Information Section */}
            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                    User Information
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={2}>
                        <TextField
                            fullWidth
                            label="ID"
                            value={user.id}
                            InputProps={{ readOnly: true }}
                            variant="filled"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Username"
                            value={user.username}
                            InputProps={{ readOnly: true }}
                            variant="filled"
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            label="Role"
                            value={user.role}
                            InputProps={{ readOnly: true }}
                            variant="filled"
                        />
                    </Grid>
                </Grid>
            </Paper>

            {/* Contact Information Section */}
            <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Contact Information
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="First Name"
                            value={user.firstName || 'N/A'}
                            InputProps={{ readOnly: true }}
                            variant="filled"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Last Name"
                            value={user.lastName || 'N/A'}
                            InputProps={{ readOnly: true }}
                            variant="filled"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Phone Number"
                            value={user.phoneNumber || 'N/A'}
                            InputProps={{ readOnly: true }}
                            variant="filled"
                        />
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
};

export default UserDetailsPage;