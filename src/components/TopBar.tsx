import { AppBar, Toolbar, Typography, Button } from '@mui/material';
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
                    <Button color="inherit">Board</Button>
                    <Button color="inherit">Repertoire</Button>
                    <Button color="inherit">Options</Button>
                    <Button color="inherit">Help</Button>
                </Toolbar>
            </AppBar>
        </div>
    );
};
