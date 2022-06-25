import { Chess } from "chess.ts";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useSupabase } from ".";
import { games, LichessOpeningPosition } from "../lichess";
import { Position, Move, unwrap } from "@chess-buddy/database";

export const POSITION_QUERY = "position";
export function useRepertoirePosition(
  repertoire_id: string | undefined,
  fen: string
) {
  const supabase = useSupabase();
  return useQuery(
    [POSITION_QUERY, fen],
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

export interface MoveWithChildPosition extends Move {
  child_position: Position;
}

const POSITION_MOVES_QUERY = "moves";
export function useRepertoirePositionMoves(
  repertoire_id: string | undefined,
  fen: string
) {
  const supabase = useSupabase();
  return useQuery(
    [POSITION_MOVES_QUERY, repertoire_id, fen],
    async () => {
      const { data, error } = await supabase
        .from<MoveWithChildPosition>("moves")
        .select(
          `
          *,
          child_position: move_child_position_fkey(*)
        `
        )
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

export interface AddPositionToRepertoireArguments {
  repertoirePosition: Position;
  lichessOpeningPosition: LichessOpeningPosition;
  moveSan: string;
}

export function useAddPositionToRepertoire() {
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  return useMutation(
    "useAddPositionToRepertoire",
    async ({
      repertoirePosition,
      lichessOpeningPosition,
      moveSan,
    }: AddPositionToRepertoireArguments) => {
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
      const childPosition: Position = await supabase
        .from<Position>("positions")
        .insert({
          repertoire_id: repertoirePosition.repertoire_id,
          fen: newFen,
          frequency: childFrequency,
        })
        .single()
        .then(unwrap);

      const move = await supabase
        .from<Move>("moves")
        .insert({
          repertoire_id: repertoirePosition.repertoire_id,
          parent_fen: currentFen,
          child_fen: newFen,
          san: moveSan,
          move_frequency: moveFrequency,
        })
        .single()
        .then(unwrap);

      return { move, childPosition };
    },
    {
      onSuccess: (result, variables) => {
        queryClient.setQueryData<Move[]>(
          [
            POSITION_MOVES_QUERY,
            variables.repertoirePosition.repertoire_id,
            variables.repertoirePosition.fen,
          ],
          (old) => {
            const moveWithChildPosition = {
              ...result.move,
              child_position: result.childPosition,
            };

            return [...old!, moveWithChildPosition];
          }
        );
      },
    }
  );
}

export interface RemovePositionFromRepertoireArguments {
  repertoire_id: string;
  parent_fen: string;
  child_fen: string;
}

export function useRemovePositionFromRepertoire() {
  const supabase = useSupabase();

  return useMutation(
    "RemovePositionFromRepertoire",
    async ({
      repertoire_id,
      parent_fen,
      child_fen,
    }: RemovePositionFromRepertoireArguments) => {
      // TODO: Recursively delete all unreachable positions
      // TODO: Update frequency in child positions that are still reachable
      // TODO: Move this to a stored procedure to make it faster and transactional
      return await supabase
        .from<Move>("moves")
        .delete()
        .match({ repertoire_id, parent_fen, child_fen });
    },
    {
      onSuccess: (result, variables) => {
        // TODO
      },
    }
  );
}
