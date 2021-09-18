import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then(res => res.json())


export interface OpeningPosition {
    white: number;
    draws: number;
    black: number;
    averageRating: number;
    moves: OpeningMove[];
    opening: string | null;
}

export interface OpeningMove {
    uci: string;
    san: string;
    white: number;
    draws: number;
    black: number;
    averageRating: number;
}

export function useOpeningPosition(fen: string) {
    return useSWR<OpeningPosition, any>(`https://explorer.lichess.ovh/master?fen=${encodeURIComponent(fen)}`, fetcher)
}
