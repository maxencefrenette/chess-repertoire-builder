import { Button, Container } from '@mui/material';
import { RouteComponentProps } from '@reach/router';
import React from 'react';

export const RepertoirePage: React.FC<RouteComponentProps> = () => {
    return (
        <Container fixed sx={{ paddingTop: '16px' }}>
            <Button variant="contained">Create Repertoire</Button>
        </Container>
    );
};
