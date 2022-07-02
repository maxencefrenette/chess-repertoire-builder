import { Move, Repertoire } from "@chess-buddy/database";
import { Button, Theme } from "@mui/material";
import { SxProps } from "@mui/system";
import { SupabaseClient } from "@supabase/supabase-js";
import { useSupabase } from "api/supabase";
import React from "react";
import { startingPosition } from "./chess";
import { saveAs } from "file-saver";

export interface PgnExportButtonProps {
  sx: SxProps<Theme>;
  repertoireId: string;
}

export const PgnExportButton: React.FC<PgnExportButtonProps> = ({
  sx,
  repertoireId,
}) => {
  const supabase = useSupabase();

  return (
    <Button
      sx={sx}
      variant="contained"
      onClick={() => downloadPgn(supabase, repertoireId)}
    >
      Export
    </Button>
  );
};

async function downloadPgn(supabase: SupabaseClient, repertoireId: string) {
  const { data: repertoire } = await supabase
    .from<Repertoire>("repertoires")
    .select("*")
    .eq("id", repertoireId)
    .single();
  const { data: moves } = await supabase
    .from<Move>("moves")
    .select("*")
    .eq("repertoire_id", repertoireId);

  if (!repertoire || !moves) {
    throw new Error("Failed to laod repertoire");
  }

  const pgnFileName = `${encodeFileName(repertoire.name)}.pgn`;

  let pgnFileContents = "";
  pgnFileContents += `[Event "${repertoire.name}"]\n`;
  pgnFileContents += `[Site "${window.origin}/repertoires/${repertoire.id}"]\n`;
  pgnFileContents += `[Result "*"]\n`;
  pgnFileContents += `[Variant "Standard"]\n`;
  pgnFileContents += `\n`;
  pgnFileContents += pgnMoves(moves, startingPosition, 0, new Set());
  pgnFileContents += ` *\n`;

  downloadFile(pgnFileName, pgnFileContents);
}

function pgnMoves(
  repertoireMoves: Move[],
  fen: string,
  halfMove: number,
  visitedFens: Set<string>
) {
  if (visitedFens.has(fen)) return " {Transposes}";
  visitedFens.add(fen);

  const moves = repertoireMoves.filter((m) => m.parent_fen === fen);

  if (moves.length === 0) {
    return "";
  }

  // Sort moves by frequency to put the main line first
  moves.sort((m) => -m.move_frequency);

  const isWhiteTurn = halfMove % 2 === 0;
  const [firstMove, ...subvariations] = moves;

  let output = "";
  if (halfMove !== 0) output += " ";
  if (isWhiteTurn) output += `${Math.floor(halfMove / 2) + 1}. `;
  output += firstMove.san;

  const mainLine = pgnMoves(
    repertoireMoves,
    firstMove.child_fen,
    halfMove + 1,
    visitedFens
  );

  for (const move of subvariations) {
    output += " (";
    output += `${Math.floor(halfMove / 2) + 1}`;
    output += isWhiteTurn ? "." : "...";
    output += " ";

    output += move.san;
    output += pgnMoves(
      repertoireMoves,
      move.child_fen,
      halfMove + 1,
      visitedFens
    );

    output += ")";
  }

  output += mainLine;

  return output;
}

function downloadFile(name: string, contents: string) {
  const blob = new Blob([contents], { type: "text/plain;charset=utf-8" });
  saveAs(blob, name);
}

function encodeFileName(name: string) {
  return name.replace(/[&/\\#,+()$~%.'":*?<>{}]/, "");
}
