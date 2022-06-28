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
  pgnFileContents += pgnMoves(moves, startingPosition, 0);

  downloadFile(pgnFileName, pgnFileContents);
}

function pgnMoves(repertoireMoves: Move[], startFen: string, halfMove: number) {
  const moves = repertoireMoves.filter((m) => m.parent_fen === startFen);
  // TODO: eleminate transpositions
  // TODO: sort by frequency

  if (moves.length === 0) {
    return "";
  }

  const isWhiteTurn = halfMove % 2 === 0;
  const firstMove = moves[0];
  const subvariations = moves.slice(1);

  let output = "";
  if (halfMove !== 0) output += " ";
  if (isWhiteTurn) output += `${Math.floor(halfMove / 2) + 1}. `;
  output += firstMove.san;

  for (const move of subvariations) {
    output += " (";
    output += `${Math.floor(halfMove / 2) + 1}`;
    output += isWhiteTurn ? "." : "...";
    output += " ";

    output += move.san;
    output += pgnMoves(repertoireMoves, move.child_fen, halfMove + 1);

    output += ")";
  }

  output += pgnMoves(repertoireMoves, firstMove.child_fen, halfMove + 1);

  return output;
}

function downloadFile(name: string, contents: string) {
  const blob = new Blob([contents], { type: "text/plain;charset=utf-8" });
  saveAs(blob, name);
}

function encodeFileName(name: string) {
  return name.replace(/[&/\\#,+()$~%.'":*?<>{}]/, "");
}
