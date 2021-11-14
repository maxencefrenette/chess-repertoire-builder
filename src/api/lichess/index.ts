import { useQuery } from 'react-query';

export interface LichessOpeningPosition {
    readonly white: number;
    readonly draws: number;
    readonly black: number;
    readonly averageRating: number;
    readonly moves: readonly LichessOpeningMove[];
    readonly opening: string | null;
}

export interface LichessOpeningMove {
    readonly uci: string;
    readonly san: string;
    readonly white: number;
    readonly draws: number;
    readonly black: number;
    readonly averageRating: number;
}

export function useLichessOpeningPosition(fen: string) {
    return useQuery<LichessOpeningPosition>(
        ['lichess-opening-position', fen],
        async () => {
            const res = await fetch(
                `https://explorer.lichess.ovh/master?fen=${encodeURIComponent(
                    fen
                )}`
            );
            return await res.json();
        }
    );
}

export function score(move: LichessOpeningMove) {
    return (move.white + move.draws / 2) / games(move);
}

export function games(position: LichessOpeningPosition | LichessOpeningMove) {
    return position.white + position.draws + position.black;
}
