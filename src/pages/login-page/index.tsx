import React, { useState } from 'react';
import {
    Avatar,
    Box,
    Button,
    Container,
    TextField,
    Typography,
} from '@mui/material';
import { RouteComponentProps } from '@reach/router';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useSupabase } from '../../hooks/supabase';

export const LoginPage: React.FC<RouteComponentProps> = () => {
    const supabase = useSupabase();
    const [message, setMessage] = useState('');

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        const { error } = await supabase.auth.signIn({
            email: data.get('email') as string,
        });

        if (error !== null) {
            setMessage(error.message);
        } else {
            setMessage(
                'Check your emails and click on your maic link to sign-in.'
            );
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate
                    sx={{ mt: 1 }}
                >
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Send Magic Link
                    </Button>
                    <Typography variant="body2">{message}</Typography>
                </Box>
            </Box>
        </Container>
    );
};
