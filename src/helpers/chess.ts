import { Chess } from "chess.ts";
import { OpeningMove } from "../hooks/api";

export const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const;
export type File = typeof files[number];
export const ranks = ['1', '2', '3', '4', '5', '6', '7', '8'] as const;
export type Rank = typeof ranks[number];

function allChessSquares() {
    const squares = new Array(64)
    for (let i = 0; i < 64; i++) {
        squares[i] = `${files[Math.floor(i / 8)]}${ranks[i % 8]}`;
    }

    return squares;
}
export const squares = allChessSquares();
export type Square = `${File}${Rank}`

export function generateMovesForChessboard(position: Chess): Map<Square, Square[]> {
    const moves: Map<Square, Square[]> = new Map();

    position.moves({ verbose: true}).forEach((m) => {
        if (!moves.has(m.from as Square)) {
            moves.set(m.from as Square, [m.to as Square])
        } else {
            moves.get(m.from as Square)?.push(m.to as Square)
        }
    })

    return moves;
}

export function score(move: OpeningMove) {
    const totalGames = move.white + move.draws + move.black;
    return (move.white + move.draws / 2) / totalGames;
}
