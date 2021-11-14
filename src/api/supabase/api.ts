import { useQuery } from "react-query";
import { useSupabase, Position } from ".";

export function useRepertoirePosition(fen: string) {
    const supabase = useSupabase();
    return useQuery(
        ['positions', fen],
        async () => {
            const { data, error } = await supabase
                .from<Position>('positions')
                .select()
                .eq('fen', fen)
                .maybeSingle();
    
            if (error !== null) {
                throw error;
            }
    
            return data;
        }
    );
}
