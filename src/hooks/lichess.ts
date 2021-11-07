import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then(res => res.json())


export interface LichessOpeningPosition {
    white: number;
    draws: number;
    black: number;
    averageRating: number;
    moves: LichessOpeningMove[];
    opening: string | null;
}

export interface LichessOpeningMove {
    uci: string;
    san: string;
    white: number;
    draws: number;
    black: number;
    averageRating: number;
}

export function useLichessOpeningPosition(fen: string) {
    return useSWR<LichessOpeningPosition, any>(`https://explorer.lichess.ovh/master?fen=${encodeURIComponent(fen)}`, fetcher)
}
