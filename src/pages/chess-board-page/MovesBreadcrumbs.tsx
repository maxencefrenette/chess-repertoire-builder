import React from 'react';
import { Button, Typography } from '@mui/material';
import { useStore } from '../../store';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

export const MovesBreadcrumbs = () => {
    const store = useStore();
    const position = store.ui.position;
    const moves = position.history();

    return (
        <>
            <Button
                size="small"
                variant="text"
                sx={{ minWidth: '0', textTransform: 'unset' }}
                disabled={moves.length === 0}
                onClick={() => store.ui.navigateToMove(-1)}
            >
                <FirstPageIcon />
            </Button>
            <Button
                size="small"
                variant="text"
                sx={{ minWidth: '0', textTransform: 'unset' }}
                disabled={moves.length === 0}
                onClick={() => store.ui.navigateToMove(moves.length - 2)}
            >
                <NavigateBeforeIcon />
            </Button>
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
