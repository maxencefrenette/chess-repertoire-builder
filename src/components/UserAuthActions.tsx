import { Button, IconButton, Menu, MenuItem } from '@mui/material';
import React from 'react';
import { useSupabase } from '../hooks/supabase';
import { Link as RouterLink } from '@reach/router';
import { AccountCircle } from '@mui/icons-material';

export const UserAuthActions = () => {
    const supabase = useSupabase();
    const user = supabase.auth.user();

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    if (user === null) {
        return (
            <Button
                component={RouterLink}
                to="/login"
                color="inherit"
            >
                Login
            </Button>
        );
    } else {
        const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
            setAnchorEl(event.currentTarget);
        };

        const handleClose = () => {
            setAnchorEl(null);
        };

        const handleLogout = () => {
            supabase.auth.signOut();
            handleClose();
        }

        return (
            <>
                <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenu}
                    color="inherit"
                >
                    <AccountCircle />
                </IconButton>
                <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
            </>
        );
    }
};
