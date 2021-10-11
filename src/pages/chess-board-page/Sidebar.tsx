import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { score } from '../../helpers/chess';
import { useOpeningPosition } from '../../hooks/api';
import { useStore } from '../../store';

export const Sidebar: React.FC = observer(() => {
    const store = useStore();
    const openingStatsResponse = useOpeningPosition(store.ui.position.fen());

    if (!openingStatsResponse.data) {
        return <div>Loading...</div>;
    }

    const openingStats = openingStatsResponse.data;

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Move</TableCell>
                        <TableCell>Score</TableCell>
                        <TableCell>Games</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {openingStats.moves.map((move) => (
                        <TableRow
                            key={move.san}
                            onClick={() => store.ui.makeMove(move.san)}
                            hover={true}
                        >
                            <TableCell>{move.san}</TableCell>
                            <TableCell>
                                {score(move).toLocaleString(undefined, {
                                    style: 'percent',
                                })}
                            </TableCell>
                            <TableCell>{move.white + move.draws + move.black}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
});
