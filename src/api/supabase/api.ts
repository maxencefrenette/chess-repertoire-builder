import { Chess } from "chess.ts";
import { useQuery } from "react-query";
import { useSupabase, Position } from ".";
import { games, LichessOpeningPosition } from "../lichess";
import { PositionChild } from "./models/position_child";

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

        let moveFrequency = 1;
        if (currentPosition.turn() === 'b') {

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
        await supabase.from<Position>('positions').insert({
            repertoire_id: repertoirePosition.repertoire_id,
            fen: newFen,
            frequency: childFrequency,
        });

        await supabase.from<PositionChild>('positions_children').insert({
            repertoire_id: repertoirePosition.repertoire_id,
            parent_fen: currentFen,
            child_fen: newFen,
            move: moveSan,
            move_frequency: moveFrequency,
        });
    };
}
