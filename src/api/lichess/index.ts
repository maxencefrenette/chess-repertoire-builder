import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then(res => res.json())


export interface LichessOpeningPosition {
    readonly white: number;
    readonly draws: number;
    readonly black: number;
    readonly averageRating: number;
    readonly moves: readonly LichessOpeningMove[];
    readonly opening: string | null;
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
    return useSWR<LichessOpeningPosition, any>(`https://explorer.lichess.ovh/master?fen=${encodeURIComponent(fen)}`, fetcher)
}

export function score(move: LichessOpeningMove) {
    return (move.white + move.draws / 2) / games(move);
}

export function games(position: LichessOpeningPosition | LichessOpeningMove) {
    return position.white + position.draws + position.black;
}
