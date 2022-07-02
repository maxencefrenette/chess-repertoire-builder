import { Position, Repertoire } from "@chess-buddy/database";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useSupabase } from ".";

export const REPERTOIRE_QUERY = "REPERTOIRE_QUERY";
export function useRepertoireQuery(repertoireId: string | undefined) {
  const supabase = useSupabase();

  return useQuery(
    [REPERTOIRE_QUERY, repertoireId],
    async () => {
      const { data } = await supabase
        .from<Repertoire>("repertoires")
        .select()
        .eq("id", repertoireId!)
        .single();
      return data!;
    },
    {
      enabled: !!repertoireId,
    }
  );
}

export const REPERTOIRES_QUERY = "REPERTOIRES_QUERY";
export function useRepertoiresQuery() {
  const supabase = useSupabase();

  return useQuery(REPERTOIRES_QUERY, async () => {
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
 * Returns a mutation that creates a repertoire
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
        transpositions: 1,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(REPERTOIRES_QUERY);
      },
    }
  );
}

export const DELETE_REPERTOIRE_MUTATION = "DELETE_REPERTOIRE_MUTATION";

/**
 * Returns a mutation that deletes a repertoire
 * @returns
 */
export function useDeleteRepertoire() {
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  return useMutation(
    DELETE_REPERTOIRE_MUTATION,
    async (repertoireId: string) => {
      await supabase
        .from<Repertoire>("repertoires")
        .delete()
        .eq("id", repertoireId);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(REPERTOIRES_QUERY);
      },
    }
  );
}
