import { Chess } from "chess.ts";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useSupabase } from ".";
import { games, LichessOpeningPosition } from "../lichess";
import { Position, Move } from "@chess-buddy/database";

export const POSITION_QUERY = "position";

/**
 * Gets a position
 *
 * @param repertoire_id
 * @param fen
 * @returns
 */
export function useRepertoirePosition(
  repertoire_id: string | undefined,
  fen: string
) {
  const supabase = useSupabase();
  return useQuery(
    [POSITION_QUERY, repertoire_id, fen],
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

export const POSITION_MOVES_QUERY = "moves";
export interface MoveWithChildPosition extends Move {
  child_position: Position;
}

/**
 * Gets all moves from a given parent position
 * @param repertoire_id
 * @param fen
 * @returns
 */
export function useRepertoirePositionMoves(
  repertoire_id: string | undefined,
  fen: string
) {
  const supabase = useSupabase();
  return useQuery(
    [POSITION_MOVES_QUERY, repertoire_id, fen],
    async () => {
      const { data } = await supabase
        .from<MoveWithChildPosition>("moves")
        .select(
          `
          *,
          child_position: move_child_position_fkey(*)
        `
        )
        .eq("repertoire_id", repertoire_id!)
        .eq("parent_fen", fen);

      return data!;
    },
    { enabled: !!repertoire_id }
  );
}

export const REPERTOIRE_HOLES_QUERY = "REPERTOIRE_HOLES_QUERY";

/**
 * Gets the repertoire holes for a given repertoire. Must be called twice to get both types of holes.
 * @param repertoire_id
 * @param type
 * @returns
 */
export function useRepertoireHoles(repertoire_id: string, type: 1 | 2) {
  const supabase = useSupabase();

  return useQuery([REPERTOIRE_HOLES_QUERY, repertoire_id, type], async () => {
    const { data } = await supabase.rpc<Position>(
      `find_repertoire_holes_type_${type}`,
      { repertoire_id }
    );

    return data!;
  });
}

export const ADD_MOVE_TO_REPERTOIRE_MUTATION = "ADD_MOVE_TO_REPERTOIRE";
export interface AddMoveToRepertoireArguments {
  repertoirePosition: Position;
  lichessOpeningPosition: LichessOpeningPosition;
  moveSan: string;
}

/**
 * Returns a mutation that adds a move to a repertoire
 * @returns
 */
export function useAddMoveToRepertoire() {
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  return useMutation(
    ADD_MOVE_TO_REPERTOIRE_MUTATION,
    async ({
      repertoirePosition,
      lichessOpeningPosition,
      moveSan,
    }: AddMoveToRepertoireArguments) => {
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

      const childFrequency = repertoirePosition.frequency * moveFrequency;

      await supabase.rpc("add_move_to_repertoire", {
        repertoire_id: repertoirePosition.repertoire_id,
        parent_fen: currentFen,
        child_fen: newFen,
        move_san: moveSan,
        move_frequency: moveFrequency,
        position_turn: newPosition.turn(),
        position_frequency: childFrequency,
      });
    },
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries([
          POSITION_MOVES_QUERY,
          variables.repertoirePosition.repertoire_id,
          variables.repertoirePosition.fen,
        ]);

        queryClient.invalidateQueries([
          REPERTOIRE_HOLES_QUERY,
          variables.repertoirePosition.repertoire_id,
        ]);
      },
    }
  );
}

export const REMOVE_MOVE_FROM_REPERTOIRE = "REMOVE_MOVE_FROM_REPERTOIRE";
export interface RemovePositionFromRepertoireArguments {
  repertoire_id: string;
  parent_fen: string;
  child_fen: string;
}

/**
 * Returns a mutation that deletes a move from a repertoire and recalculate statistics
 * @returns
 */
export function useDeleteMoveFromRepertoire() {
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  return useMutation(
    REMOVE_MOVE_FROM_REPERTOIRE,
    async ({
      repertoire_id,
      parent_fen,
      child_fen,
    }: RemovePositionFromRepertoireArguments) => {
      return await supabase
        .from<Move>("moves")
        .delete()
        .match({ repertoire_id, parent_fen, child_fen });
    },
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries([
          POSITION_MOVES_QUERY,
          variables.repertoire_id,
          variables.parent_fen,
        ]);

        queryClient.invalidateQueries([
          POSITION_QUERY,
          variables.repertoire_id,
          variables.child_fen,
        ]);

        queryClient.invalidateQueries([
          REPERTOIRE_HOLES_QUERY,
          variables.repertoire_id,
        ]);
      },
    }
  );
}
