import {
  Button,
  LinearProgress,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import { RouteComponentProps } from "@reach/router";
import {
  useAddMoveToRepertoire,
  useRepertoireQuery,
  useSupabase,
} from "api/supabase";
import React, { useState } from "react";
import { PageContainer } from "shared/PageContainer";
import { parse, Move as PgnMove } from "pgn-parser";
import { startingPosition } from "shared/chess";
import { Chess } from "chess.ts";
import { Position } from "@chess-buddy/database";
import { fetchLichessOpeningPosition } from "api/lichess";

const Input = styled("input")({
  display: "none",
});

interface ImportPgnPageProps extends RouteComponentProps {
  repertoireId?: string;
}

export const ImportPgnPage: React.FC<ImportPgnPageProps> = ({
  repertoireId,
}) => {
  const supabase = useSupabase();
  const addMoveToRepertoireMutation = useAddMoveToRepertoire();
  const [file, setFile] = useState<File | undefined>();
  const [processedMoves, setProcessedMoves] = useState(0);
  const [totalMoves, setTotalMoves] = useState(1);

  const { data: repertoire } = useRepertoireQuery(repertoireId);
  if (!repertoire) return null;

  const importPgn = async () => {
    const fileContents = await file!.text();
    const pgn = parse(fileContents)[0];
    setTotalMoves(countMoves(pgn.moves));

    const { data: repertoirePosition } = await supabase
      .from<Position>("positions")
      .select()
      .eq("repertoire_id", repertoire.id)
      .eq("fen", startingPosition)
      .single();

    await importMoves(repertoirePosition!, pgn.moves);
  };

  const importMoves = async (
    repertoirePosition: Position,
    moves: PgnMove[]
  ) => {
    const [move, ...mainLine] = moves;

    // Import the current move
    const lichessOpeningPosition = await fetchLichessOpeningPosition(
      repertoirePosition.fen,
      repertoire.lichess_speeds,
      repertoire.lichess_ratings
    );
    await addMoveToRepertoireMutation.mutateAsync({
      repertoirePosition,
      lichessOpeningPosition,
      moveSan: move.move,
    });
    setProcessedMoves((processedMoves) => processedMoves + 1);

    // Recursively import main line
    if (mainLine.length > 0) {
      const position = new Chess(repertoirePosition.fen);
      position.move(move.move);
      const childFen = position.fen();

      const { data: childRepertoirePosition } = await supabase
        .from<Position>("positions")
        .select()
        .eq("repertoire_id", repertoire.id)
        .eq("fen", childFen)
        .single();

      await importMoves(childRepertoirePosition!, mainLine);
    }

    // Recursively import side lines
    for (const rav of move.ravs || []) {
      await importMoves(repertoirePosition, rav.moves);
    }
  };

  return (
    <PageContainer>
      <Typography variant="h2">Import into {repertoire.name}</Typography>
      <br />
      <Stack spacing={2}>
        <label htmlFor="contained-button-file">
          <Input
            accept=".pgn"
            id="contained-button-file"
            type="file"
            onChange={(e) => setFile(e.target.files?.item(0) ?? undefined)}
          />
          <Button variant="contained" component="span">
            Select File
          </Button>
          &nbsp;
          {file?.name}
        </label>
        <span>
          <Button variant="contained" disabled={!file} onClick={importPgn}>
            Import
          </Button>
        </span>
        {processedMoves !== 0 && (
          <LinearProgress
            variant="determinate"
            value={(processedMoves / totalMoves) * 100}
          />
        )}
      </Stack>
    </PageContainer>
  );
};

function countMoves(moves: PgnMove[]): number {
  return moves
    .map((move) => {
      if (!move.ravs) return 1;
      return (
        1 +
        move.ravs.map((rav) => countMoves(rav.moves)).reduce((a, b) => a + b, 0)
      );
    })
    .reduce((a, b) => a + b, 0);
}
