import { Box } from '@mui/system';
import { RouteComponentProps } from '@reach/router';
import React from 'react';
import { ChessBoard } from './ChessBoard';
import { Sidebar } from './Sidebar';

export const ChessBoardPage: React.FC<RouteComponentProps> = () => {
    return (
        <Box sx={{ display: 'flex', padding: '10px' }}>
            <Box sx={{ width: '1000px', margin: '10px' }}>
                <ChessBoard />
            </Box>
            <Box sx={{ flex: '1 0 200px', margin: '10px' }}>
                <Sidebar />
            </Box>
        </Box>
    );
};
