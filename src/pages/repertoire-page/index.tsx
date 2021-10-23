import { Button, Container } from '@mui/material';
import { RouteComponentProps } from '@reach/router';
import React from 'react';
import { useStore } from '../../store';
import { RepertoireOptionsForm } from './RepertoireOptionsForm';

export const RepertoirePage: React.FC<RouteComponentProps> = () => {
    const store = useStore();

    return (
        <Container fixed sx={{ paddingTop: '16px' }}>
            <Button variant="contained">Create Repertoire</Button>
            {store.repertoire !== undefined && <RepertoireOptionsForm />}
        </Container>
    );
};
