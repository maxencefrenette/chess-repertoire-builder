import {
    Box,
    Divider,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';
import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { score } from '../../helpers/chess';
import { useOpeningPosition } from '../../hooks/api';
import { useStore } from '../../store';
import { MovesBreadcrumbs } from './MovesBreadcrumbs';
import { RepertoireSelect } from './RepertoireSelect';

export const Sidebar: React.FC = observer(() => {
    const store = useStore();

    const openingStatsResponse = useOpeningPosition(store.ui.position.fen());

    if (!openingStatsResponse.data) {
        return <div>Loading...</div>;
    }

    const openingStats = openingStatsResponse.data;

    return (
        <Paper>
            <Box sx={{ padding: '16px' }}>
                <RepertoireSelect />
            </Box>
            <Divider />
            <Box sx={{ padding: '16px' }}>
                <MovesBreadcrumbs />
            </Box>
            <Divider />
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Move</TableCell>
                            <TableCell>Score</TableCell>
                            <TableCell>Games</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody
                        onMouseLeave={action(
                            () => (store.ui.hoveredMoveUci = undefined)
                        )}
                    >
                        {openingStats.moves.map((move) => (
                            <TableRow
                                key={move.san}
                                hover={true}
                                onClick={action(() => {
                                    store.ui.hoveredMoveUci = undefined;
                                    store.ui.makeMove(move.san);
                                })}
                                onMouseEnter={action(
                                    () => (store.ui.hoveredMoveUci = move.uci)
                                )}
                            >
                                <TableCell>{move.san}</TableCell>
                                <TableCell>
                                    {score(move).toLocaleString(undefined, {
                                        style: 'percent',
                                    })}
                                </TableCell>
                                <TableCell>
                                    {move.white + move.draws + move.black}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
});
