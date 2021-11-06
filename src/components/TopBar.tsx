import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link as RouterLink } from '@reach/router';
import React from 'react';

export const TopBar = () => {
    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ marginRight: '100px' }}
                    >
                        Chess Buddy
                    </Typography>
                    <Button component={RouterLink} to="/" color="inherit">Board</Button>
                    <Button component={RouterLink} to="/repertoire" color="inherit">Repertoire</Button>
                    <Button component={RouterLink} to="/options" color="inherit">Options</Button>
                    <Button component={RouterLink} to="/help" color="inherit">Help</Button>
                </Toolbar>
            </AppBar>
        </div>
    );
};
