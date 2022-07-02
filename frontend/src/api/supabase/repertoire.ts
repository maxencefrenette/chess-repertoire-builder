import { Position, Repertoire } from "@chess-buddy/database";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useSupabase } from ".";

export const REPERTOIRES_QUERY = "REPERTOIRES_QUERY";
export function useRepertoiresQuery() {
  const supabase = useSupabase();

  return useQuery("repertoires", async () => {
    const { data } = await supabase.from<Repertoire>("repertoires").select();

    return data!;
  });
}

export const CREATE_REPERTOIRE_MUTATION = "CREATE_REPERTOIRE_MUTATION";
export interface CreateRepertoireArguments {
  name: string;
  color: "w" | "b";
  lichessSpeeds: string;
  lichessRatings: string;
}

/**
 * Returns a mutation that adds a move to a repertoire
 * @returns
 */
export function useCreateRepertoire() {
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  return useMutation(
    CREATE_REPERTOIRE_MUTATION,
    async ({
      name,
      color,
      lichessSpeeds,
      lichessRatings,
    }: CreateRepertoireArguments) => {
      const { data: repertoire } = await supabase
        .from<Repertoire>("repertoires")
        .insert({
          user_id: supabase.auth.user()?.id,
          name,
          color,
          lichess_speeds: lichessSpeeds,
          lichess_ratings: lichessRatings,
        })
        .single();

      await supabase.from<Position>("positions").insert({
        repertoire_id: repertoire!.id,
        fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        turn: "w",
        frequency: 1,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(REPERTOIRES_QUERY);
      },
    }
  );
}
