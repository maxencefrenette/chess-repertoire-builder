import React from 'react';
import { Button, Typography, IconButton } from '@mui/material';
import { useStore } from '../../store';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

export const MovesBreadcrumbs = () => {
    const store = useStore();
    const position = store.ui.position;
    const moves = position.history();

    return (
        <>
            <IconButton
                size="small"
                disabled={moves.length === 0}
                onClick={() => store.ui.navigateToMove(-1)}
            >
                <FirstPageIcon />
            </IconButton>
            <IconButton
                size="small"
                disabled={moves.length === 0}
                onClick={() => store.ui.navigateToMove(moves.length - 2)}
            >
                <NavigateBeforeIcon />
            </IconButton>
            {' '}
            {moves.map((move, i) => {
                return (
                    <React.Fragment key={i + move}>
                        {i % 2 === 0 && (
                            <Typography
                                variant="body2"
                                sx={{ display: 'inline' }}
                            >
                                {i / 2 + 1}.
                            </Typography>
                        )}
                        <Button
                            size="small"
                            variant="text"
                            sx={{ minWidth: '0', textTransform: 'unset' }}
                            onClick={() => store.ui.navigateToMove(i)}
                        >
                            {move}
                        </Button>
                    </React.Fragment>
                );
            })}
        </>
    );
};
