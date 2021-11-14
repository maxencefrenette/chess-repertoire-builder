import { Chess } from "chess.ts";
import { useQuery } from "react-query";
import { useSupabase, Position } from ".";
import { games, LichessOpeningPosition } from "../lichess";

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

export function useAddPositionToRepertoire() {
    const supabase = useSupabase();

    return async (repertoirePosition: Position, lichessOpeningPosition: LichessOpeningPosition, moveSan: string) => {
        const currentFen = repertoirePosition.fen;
        const currentPosition = new Chess(repertoirePosition.fen);
        const newPosition = currentPosition.clone();
        newPosition.move(moveSan);
        const newFen = newPosition.fen();

        let frequency = repertoirePosition!.frequency;

        if (currentPosition.turn() === 'b') {
            const totalGames = games(lichessOpeningPosition);
            const gamesAfterMove = games(
                lichessOpeningPosition.moves.find(
                    (moveStats) => moveStats.san === moveSan
                )!
            );

            frequency *= gamesAfterMove / totalGames;
        }

        await supabase.from<Position>('positions').insert({
            fen: newFen,
            repertoire_id: repertoirePosition?.repertoire_id,
            frequency,
        });
    };
}