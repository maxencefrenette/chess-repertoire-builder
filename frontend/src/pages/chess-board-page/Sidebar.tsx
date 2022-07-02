import { Box, Paper, styled } from "@mui/material";
import { action } from "mobx";
import { observer } from "mobx-react-lite";
import React from "react";
import { useLichessOpeningPosition, score, games } from "api/lichess";
import { useStore } from "store";
import { MovesBreadcrumbs } from "./MovesBreadcrumbs";
import {
  useRepertoirePosition,
  useRepertoirePositionMoves,
} from "api/supabase";
import {
  DataGrid,
  GridColDef,
  GridValueFormatterParams,
} from "@mui/x-data-grid";
import "./Sidebar.css";
import { AddRemovePositionButton } from "./AddRemovePositionButton";
import { Repertoire } from "@chess-buddy/database";
import { formatPercent, formatFrequency } from "shared/format";
import { PgnExportButton } from "shared/PgnExportButton";

const StyledDataGrid = styled(DataGrid)`
  .MuiDataGrid-cell:focus {
    outline: none;
  }
`;

export interface SidebarProps {
  repertoire?: Repertoire;
}

export const Sidebar: React.FC<SidebarProps> = observer(({ repertoire }) => {
  const store = useStore();

  const fen = store.ui.position.fen();
  const repertoireId = repertoire?.id;

  const { data: lichessOpeningStats } = useLichessOpeningPosition(
    fen,
    repertoire?.lichess_speeds,
    repertoire?.lichess_ratings
  );
  const { data: repertoirePosition } = useRepertoirePosition(repertoireId, fen);
  const { data: repertoirePositionMoves } = useRepertoirePositionMoves(
    repertoireId,
    fen
  );

  if (
    !lichessOpeningStats ||
    (repertoireId &&
      (repertoirePosition === undefined ||
        repertoirePositionMoves === undefined))
  ) {
    return <div>Loading...</div>;
  }

  const repertoireSelected = repertoire !== undefined;
  const currentPositionIsInRepertoire = repertoirePosition !== null;

  const columns: GridColDef[] = [
    {
      field: "add_to_repertoire",
      headerName: "",
      disableColumnMenu: true,
      hideSortIcons: true,
      width: 51,
      align: "center",
      hide: !repertoireSelected,
      renderCell: ({ row }) => {
        return (
          <AddRemovePositionButton
            moveSan={row.id}
            repertoirePosition={repertoirePosition!}
            lichessOpeningPosition={lichessOpeningStats}
            currentPositionIsInRepertoire={currentPositionIsInRepertoire}
            moveIsInRepertoire={row.isInRepertoire}
          />
        );
      },
    },
    {
      field: "id",
      headerName: "Move",
      width: 120,
    },
    {
      field: "score",
      headerName: "Score",
      width: 120,
      valueFormatter: formatPercentColumn,
    },
    {
      field: "games",
      width: 120,
      headerName: "Games",
    },
    {
      field: "move_frequency",
      headerName: "Move Frequency",
      description:
        "The frequency of this move, given that this position has been reached.",
      width: 120,
      valueFormatter: formatFrequencyColumn,
    },
    {
      field: "position_frequency",
      headerName: "Position Frequency",
      description:
        "The overall frequency of the resulting position (including transpositions), given the currently selected repertoire.",
      width: 120,
      valueFormatter: formatFrequencyColumn,
      hide: !repertoireSelected,
    },
    {
      field: "position_transpositions",
      headerName: "Transpositions",
      description:
        "The number of lines that lead to the resulting position in this repertoire",
      width: 120,
      hide: !repertoireSelected,
    },
  ];

  // Zip repertoire moves with lichess moves data
  const rows = store.ui.position
    .moves()
    .map((moveSan) => {
      const lichessMove = lichessOpeningStats.moves.find(
        (m) => m.san === moveSan
      );

      const repertoireMove = repertoirePositionMoves?.find(
        (m) => m.san === moveSan
      );

      return {
        id: moveSan,
        score: lichessMove && score(lichessMove),
        games: lichessMove && games(lichessMove),
        move_frequency: lichessMove
          ? games(lichessMove) / games(lichessOpeningStats)
          : 0,
        position_frequency: repertoireMove?.child_position.frequency,
        position_transpositions: repertoireMove?.child_position.transpositions,
        isInRepertoire: !!repertoireMove,
      };
    })
    .filter((row) => row.games || row.position_frequency);

  return (
    <Paper sx={{ marginBottom: "16px" }}>
      <Box sx={{ padding: "16px" }}>
        {repertoire?.name}
        {repertoire && (
          <PgnExportButton
            sx={{ margin: "0 8px" }}
            repertoireId={repertoire.id}
          />
        )}
        <MovesBreadcrumbs />
      </Box>
      <StyledDataGrid
        rows={rows}
        columns={columns}
        autoHeight={true}
        hideFooter={true}
        sortModel={[{ field: "games", sort: "desc" }]}
        getRowClassName={({ row }) =>
          row.isInRepertoire ? "row-in-repertoire" : ""
        }
        onRowClick={action(({ row }) => {
          store.ui.hoveredMove = undefined;
          store.ui.makeMove(row.id);
        })}
        componentsProps={{
          row: {
            onMouseEnter: action((event: React.MouseEvent) => {
              const moveSan = event.currentTarget.getAttribute("data-id")!;
              store.ui.hoveredMove = moveSan;
            }),
            onMouseLeave: action((event: React.MouseEvent) => {
              const moveSan = event.currentTarget.getAttribute("data-id")!;

              if (store.ui.hoveredMove === moveSan) {
                store.ui.hoveredMove = undefined;
              }
            }),
          },
        }}
      />
      <Box sx={{ height: "52px", padding: "0 10px", lineHeight: "51px" }}>
        Score: {formatPercent(score(lichessOpeningStats))}
        <Box sx={{ display: "inline-block", width: "30px" }} />
        Games: {games(lichessOpeningStats)}
        {repertoirePosition && (
          <>
            <Box sx={{ display: "inline-block", width: "30px" }} />
            Frequency: {formatFrequency(repertoirePosition.frequency)}
            <Box sx={{ display: "inline-block", width: "30px" }} />
            Transpositions: {repertoirePosition.transpositions}
          </>
        )}
      </Box>
    </Paper>
  );
});

export function formatPercentColumn(params: GridValueFormatterParams) {
  if (params.value === undefined) {
    return "";
  }

  return formatPercent(params.value as number);
}

function formatFrequencyColumn(params: GridValueFormatterParams) {
  if (params.value === undefined) {
    return "";
  }

  return formatFrequency(params.value as number);
}
