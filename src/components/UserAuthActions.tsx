import { Button, IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import React from 'react';
import { useSupabase } from '../api/supabase';
import { Link as RouterLink } from '@reach/router';
import { AccountCircle } from '@mui/icons-material';
import { useStore } from '../store';
import { observer } from 'mobx-react-lite';

export const UserAuthActions = observer(() => {
    const store = useStore();
    const supabase = useSupabase();

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    // Use the store instead of supabase to check if the user is logged in in order to trigger appropriate rerenders through mobx
    if (store.ui.isLoggedIn === false) {
        return (
            <Button component={RouterLink} to="/login" color="inherit">
                Login
            </Button>
        );
    } else if (store.ui.isLoggedIn === true) {
        const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
            setAnchorEl(event.currentTarget);
        };

        const handleClose = () => {
            setAnchorEl(null);
        };

        const handleLogout = () => {
            supabase.auth.signOut();
            handleClose();
        };

        return (
            <>
                <Tooltip title={supabase.auth.user()?.email || ""}>
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
                </Tooltip>
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
    } else {
        // Display nothing if we don't know yet if the user is logged-in. This happens while the app is still loading.
        return null;
    }
});
