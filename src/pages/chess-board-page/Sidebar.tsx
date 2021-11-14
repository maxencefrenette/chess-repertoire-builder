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
import { useLichessOpeningPosition, games, score } from '../../api/lichess';
import { useStore } from '../../store';
import { MovesBreadcrumbs } from './MovesBreadcrumbs';
import { RepertoireSelect } from './RepertoireSelect';
import AddIcon from '@mui/icons-material/Add';
import { Position } from '../../api/supabase/models/position';
import { useSupabase, useRepertoirePosition } from '../../api/supabase';

export const Sidebar: React.FC = observer(() => {
    const store = useStore();
    const supabase = useSupabase();

    const fen = store.ui.position.fen();

    const { data: lichessOpeningStats } = useLichessOpeningPosition(fen);
    const { data: repertoirePosition } = useRepertoirePosition(fen);

    if (!lichessOpeningStats || repertoirePosition === undefined) {
        return <div>Loading...</div>;
    }

    const showRepertoireActionsColumn = store.ui.repertoire !== undefined;
    const currentPositionIsInRepertoire = repertoirePosition !== null;

    const handleAddToRepertoire = async (moveSan: string) => {
        const newPosition = store.ui.position.clone();
        newPosition.move(moveSan);
        const fen = newPosition.fen();

        let frequency = repertoirePosition!.frequency;

        if (store.ui.position.turn() === 'b') {
            const totalGames = games(lichessOpeningStats);
            const gamesAfterMove = games(
                lichessOpeningStats.moves.find(
                    (moveStats) => moveStats.san === moveSan
                )!
            );

            frequency *= gamesAfterMove / totalGames;
        }

        await supabase.from<Position>('positions').insert({
            fen,
            repertoire_id: repertoirePosition?.repertoire_id,
            frequency,
        });
    };

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
                        {lichessOpeningStats.moves.map((move) => (
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
                                {showRepertoireActionsColumn && (
                                    <TableCell
                                        sx={{ padding: '6px' }}
                                        onClick={(event) =>
                                            event.stopPropagation()
                                        }
                                    >
                                        <Tooltip title="Add to repertoire">
                                            <IconButton
                                                color="primary"
                                                disabled={
                                                    !currentPositionIsInRepertoire
                                                }
                                                onClick={() =>
                                                    handleAddToRepertoire(
                                                        move.san
                                                    )
                                                }
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
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
});
