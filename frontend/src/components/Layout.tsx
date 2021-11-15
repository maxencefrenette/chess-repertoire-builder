import { Box } from '@mui/system';
import React from 'react';
import { Routing } from './Routing';
import { TopBar } from './TopBar';

export const Layout = () => {
    return (
        <Box sx={{ height: '100%', backgroundColor: '#e5e5e5' }}>
            <TopBar />
            <Routing />
        </Box>
    );
};
