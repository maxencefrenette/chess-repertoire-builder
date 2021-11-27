import { Chess } from "chess.ts";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useSupabase } from ".";
import { games, LichessOpeningPosition } from "../lichess";
import { Position, Move } from "database/models";

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

const POSITION_MOVES_QUERY = "moves";
export function useRepertoirePositionMoves(
  repertoire_id: string | undefined,
  fen: string
) {
  const supabase = useSupabase();
  return useQuery(
    [POSITION_MOVES_QUERY, fen],
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
      const { data: position } = await supabase
        .from<Position>("positions")
        .insert({
          repertoire_id: repertoirePosition.repertoire_id,
          fen: newFen,
          frequency: childFrequency,
        })
        .single();

      const { data: move } = await supabase
        .from<Move>("moves")
        .insert({
          repertoire_id: repertoirePosition.repertoire_id,
          parent_fen: currentFen,
          child_fen: newFen,
          move: moveSan,
          move_frequency: moveFrequency,
        })
        .single();

      return { position, move };
    },
    {
      onSuccess: async (result, variables) => {
        queryClient.setQueryData<Move[]>(
          [POSITION_MOVES_QUERY, variables.repertoirePosition.fen],
          (old) => {
            return [...old!, result.move!];
          }
        );
      },
    }
  );
}

export function useRemovePositionFromRepertoire() {
  const supabase = useSupabase();

  return async (repertoire_id: string, fen: string) => {
    // TODO: Recursively delete all unreachable positions
    // TODO: Update frequency in child positions that are still reachable
    // TODO: Move this to a stored procedure to make it faster and transactional
    return await supabase
      .from<Move>("moves")
      .delete()
      .match({ repertoire_id, parent_fen: fen });
  };
}
