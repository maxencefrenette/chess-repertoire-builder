import { Chess } from "chess.ts";
import { useQuery } from "react-query";
import { useSupabase, Position } from ".";
import { games, LichessOpeningPosition } from "../lichess";
import { Move } from "./models/move";

export function useRepertoirePosition(
  repertoire_id: string | undefined,
  fen: string
) {
  const supabase = useSupabase();
  return useQuery(
    ["positions", fen],
    async () => {
      const { data, error } = await supabase
        .from<Position>("positions")
        .select()
        .eq("repertoire_id", repertoire_id!)
        .eq("fen", fen)
        .maybeSingle();

      if (error !== null) {
        throw error;
      }

      return data;
    },
    { enabled: !!repertoire_id }
  );
}

export function useRepertoirePositionMoves(
  repertoire_id: string | undefined,
  fen: string
) {
  const supabase = useSupabase();
  return useQuery(
    ["moves", fen],
    async () => {
      const { data, error } = await supabase
        .from<Move>("moves")
        .select()
        .eq("repertoire_id", repertoire_id!)
        .eq("parent_fen", fen);

      if (error !== null) {
        throw error;
      }

      return data!;
    },
    { enabled: !!repertoire_id }
  );
}

export function useAddPositionToRepertoire() {
  const supabase = useSupabase();

  return async (
    repertoirePosition: Position,
    lichessOpeningPosition: LichessOpeningPosition,
    moveSan: string
  ) => {
    const currentFen = repertoirePosition.fen;
    const currentPosition = new Chess(repertoirePosition.fen);
    const newPosition = currentPosition.clone();
    newPosition.move(moveSan);
    const newFen = newPosition.fen();

    let moveFrequency = 1;
    if (currentPosition.turn() === "b") {
      const totalGames = games(lichessOpeningPosition);
      const gamesAfterMove = games(
        lichessOpeningPosition.moves.find(
          (moveStats) => moveStats.san === moveSan
        )!
      );

      moveFrequency = gamesAfterMove / totalGames;
    }

    // TODO: account for transpositions
    const childFrequency = repertoirePosition.frequency * moveFrequency;

    // TODO: move this to a stored procedure to make it faster and transactional
    await supabase.from<Position>("positions").insert({
      repertoire_id: repertoirePosition.repertoire_id,
      fen: newFen,
      frequency: childFrequency,
    });

    await supabase.from<Move>("moves").insert({
      repertoire_id: repertoirePosition.repertoire_id,
      parent_fen: currentFen,
      child_fen: newFen,
      move: moveSan,
      move_frequency: moveFrequency,
    });
  };
}

export function useRemovePositionFromRepertoire() {
  const supabase = useSupabase();

  return async (repertoire_id: string, fen: string) => {
    // TODO: Recursively delete all unreachable positions
    // TODO: Update frequency in child positions that are still reachable
    // TODO: Move this to a stored procedure to make it faster and transactional
    const p1 = supabase
      .from<Position>("positions")
      .delete()
      .match({ repertoire_id, fen });
    const p2 = supabase
      .from<Move>("moves")
      .delete()
      .match({ repertoire_id, parent_fen: fen });
    const p3 = supabase
      .from<Move>("moves")
      .delete()
      .match({ repertoire_id, child_fen: fen });

    await Promise.all([p1, p2, p3]);
  };
}
