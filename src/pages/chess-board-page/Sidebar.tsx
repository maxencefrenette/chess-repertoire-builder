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
} from '@mui/material';
import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { games, score } from '../../helpers/chess';
import { useLichessOpeningPosition } from '../../hooks/lichess';
import { useStore } from '../../store';
import { MovesBreadcrumbs } from './MovesBreadcrumbs';
import { RepertoireSelect } from './RepertoireSelect';
import AddIcon from '@mui/icons-material/Add';
import { useQuery } from 'react-query';
import { Position } from '../../models/Position';
import { useSupabase } from '../../hooks/supabase';

export const Sidebar: React.FC = observer(() => {
    const store = useStore();
    const supabase = useSupabase();

    const fen = store.ui.position.fen();

    const {data: lichessOpeningStats} = useLichessOpeningPosition(
        store.ui.position.fen()
    );

    const { data: repertoirePosition } = useQuery(
        ['positions', fen],
        async () => {
            const { data, error } = await supabase
                .from<Position>('positions')
                .select()
                .eq('fen', fen)
                .maybeSingle();

            if (error !== null) {
                throw error;
            }

            return data;
        }
    );

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
            const gamesAfterMove = games(lichessOpeningStats.moves.find(moveStats => moveStats.san === moveSan)!);

            frequency *= gamesAfterMove / totalGames;
        }
        
        await supabase.from<Position>("positions").insert({
            fen,
            repertoire_id: repertoirePosition?.repertoire_id,
            frequency,
        })
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
                                        <IconButton
                                            color="primary"
                                            disabled={
                                                !currentPositionIsInRepertoire
                                            }
                                            onClick={() =>
                                                handleAddToRepertoire(move.san)
                                            }
                                        >
                                            <AddIcon />
                                        </IconButton>
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
