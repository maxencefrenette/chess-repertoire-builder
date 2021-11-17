import {
    Box,
    Divider,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
} from '@mui/material';
import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useLichessOpeningPosition, score } from '../../api/lichess';
import { useStore } from '../../store';
import { MovesBreadcrumbs } from './MovesBreadcrumbs';
import { RepertoireSelect } from './RepertoireSelect';
import AddIcon from '@mui/icons-material/Add';
import {
    useRepertoirePosition,
    useAddPositionToRepertoire,
    useRepertoirePositionMoves,
} from '../../api/supabase';

export const Sidebar: React.FC = observer(() => {
    const store = useStore();

    const fen = store.ui.position.fen();
    const repertoire_id = store.ui.repertoire?.id;

    const { data: lichessOpeningStats } = useLichessOpeningPosition(fen);
    const { data: repertoirePosition } = useRepertoirePosition(
        repertoire_id,
        fen
    );
    const { data: repertoirePositionMoves } = useRepertoirePositionMoves(
        repertoire_id,
        fen
    );
    const addPositionToRepertoire = useAddPositionToRepertoire();

    if (
        !lichessOpeningStats ||
        (repertoire_id &&
            (repertoirePosition === undefined ||
                repertoirePositionMoves === undefined))
    ) {
        return <div>Loading...</div>;
    }

    const handleAddToRepertoire = (moveSan: string) => {
        addPositionToRepertoire(
            repertoirePosition!,
            lichessOpeningStats,
            moveSan
        );
    };

    const showRepertoireActionsColumn = store.ui.repertoire !== undefined;
    const currentPositionIsInRepertoire = repertoirePosition !== null;

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
                            {showRepertoireActionsColumn && (
                                <TableCell sx={{ width: '16px' }}></TableCell>
                            )}
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
                        {lichessOpeningStats.moves.map((move) => {
                            const moveIsInRepertoire = !!repertoirePositionMoves && !!repertoirePositionMoves.find(m => m.move === move.san);
                            const rowBackgroundColor = moveIsInRepertoire ? '#ccc' : 'unset';

                            return (
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
                                    sx={{ backgroundColor: rowBackgroundColor }}
                                >
                                    {showRepertoireActionsColumn && (
                                        <TableCell
                                            sx={{ padding: '6px' }}
                                            onClick={(event) => event.stopPropagation()}
                                        >
                                            <Tooltip title="Add to repertoire">
                                                <IconButton
                                                    color="primary"
                                                    disabled={!currentPositionIsInRepertoire}
                                                    onClick={() => handleAddToRepertoire(
                                                        move.san
                                                    )}
                                                >
                                                    <AddIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    )}
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
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
});
