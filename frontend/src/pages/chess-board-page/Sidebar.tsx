import { Box, Divider, IconButton, Paper, Tooltip } from '@mui/material';
import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useLichessOpeningPosition, score, games } from '../../api/lichess';
import { useStore } from '../../store';
import { MovesBreadcrumbs } from './MovesBreadcrumbs';
import { RepertoireSelect } from './RepertoireSelect';
import AddIcon from '@mui/icons-material/Add';
import {
    useRepertoirePosition,
    useAddPositionToRepertoire,
    useRepertoirePositionMoves,
} from '../../api/supabase';
import {
    DataGrid,
    GridColDef,
    GridValueFormatterParams,
} from '@mui/x-data-grid';
import './Sidebar.css';

export const Sidebar: React.FC = observer(() => {
    const store = useStore();

    const fen = store.ui.position.fen();
    const repertoireId = store.ui.repertoire?.id;

    const { data: lichessOpeningStats } = useLichessOpeningPosition(fen);
    const { data: repertoirePosition } = useRepertoirePosition(
        repertoireId,
        fen
    );
    const { data: repertoirePositionMoves } = useRepertoirePositionMoves(
        repertoireId,
        fen
    );
    const addPositionToRepertoire = useAddPositionToRepertoire();

    if (
        !lichessOpeningStats ||
        (repertoireId &&
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

    const repertoireSelected = store.ui.repertoire !== undefined;
    const currentPositionIsInRepertoire = repertoirePosition !== null;

    const columns: GridColDef[] = [
        {
            field: 'add_to_repertoire',
            headerName: '',
            disableColumnMenu: true,
            hideSortIcons: true,
            width: 51,
            align: 'center',
            renderCell: ({ row }) => {
                return (
                    <Tooltip title="Add to repertoire">
                        <IconButton
                            color="primary"
                            disabled={!currentPositionIsInRepertoire}
                            onClick={() => handleAddToRepertoire(row.id)}
                        >
                            <AddIcon />
                        </IconButton>
                    </Tooltip>
                );
            },
        },
        {
            field: 'id',
            headerName: 'Move',
            width: 120,
        },
        {
            field: 'score',
            headerName: 'Score',
            width: 120,
            valueFormatter: formatPercent,
        },
        {
            field: 'games',
            width: 120,
            headerName: 'Games',
        },
        {
            field: 'frequency',
            headerName: 'Frequency',
            width: 120,
            valueFormatter: formatFrequency,
            hide: !repertoireSelected,
        },
    ];

    const rows = store.ui.position
        .moves()
        .map((moveSan) => {
            const lichessMove = lichessOpeningStats.moves.find(
                (m) => m.san === moveSan
            );

            const repertoireMove = repertoirePositionMoves?.find(
                (m) => m.move === moveSan
            );

            return {
                id: moveSan,
                score: lichessMove && score(lichessMove),
                games: lichessMove && games(lichessMove),
                frequency: repertoireMove && repertoireMove.move_frequency,
                isInRepertoire: !!repertoireMove,
            };
        })
        .filter((row) => row.games || row.frequency);

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
            <DataGrid
                rows={rows}
                columns={columns}
                autoHeight={true}
                hideFooter={true}
                sortModel={[{ field: 'games', sort: 'desc' }]}
                getRowClassName={({ row }) =>
                    row.isInRepertoire ? 'row-in-repertoire' : ''
                }
                onRowClick={action(({ row }) => {
                    store.ui.hoveredMove = undefined;
                    store.ui.makeMove(row.id);
                })}
                componentsProps={{
                    row: {
                        onMouseOver: (event: React.MouseEvent) => {
                            const moveSan =
                                event.currentTarget.getAttribute('data-id')!;
                            store.ui.hoveredMove = moveSan;
                        },
                    },
                }}
            />
        </Paper>
    );
});

function formatPercent(params: GridValueFormatterParams) {
    return params.value?.toLocaleString(undefined, {
        style: 'percent',
        minimumFractionDigits: 2,
    });
}

function formatFrequency(params: GridValueFormatterParams) {
    const value = params.value;

    if (typeof value !== 'number' || value <= 0) {
        return;
    } else if (value > 0.5) {
        return value.toLocaleString(undefined, {
            style: 'percent',
            minimumFractionDigits: 2,
        });
    } else {
        return `1 in ${Math.round(1 / value)}`;
    }
}
