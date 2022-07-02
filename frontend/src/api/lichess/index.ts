import { useQuery } from "react-query";

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

export async function fetchLichessOpeningPosition(
  fen: string,
  speeds: string | undefined,
  ratings: string | undefined
) {
  if (speeds === undefined) {
    speeds = "ultraBullet,bullet,blitz,rapid,classical,correspondence";
  }

  if (ratings === undefined) {
    ratings = "1600,1800,2000,2200,2500";
  }

  const res = await fetch(
    `https://explorer.lichess.ovh/lichess?variant=standard&speeds=${speeds}&ratings=${ratings}&fen=${encodeURIComponent(
      fen
    )}`
  );
  return await res.json();
}

export function useLichessOpeningPosition(
  fen: string,
  speeds: string | undefined,
  ratings: string | undefined
) {
  return useQuery<LichessOpeningPosition>(
    ["lichess-opening-position", speeds, ratings, fen],
    () => fetchLichessOpeningPosition(fen, speeds, ratings)
  );
}

export function score(move: LichessOpeningPosition | LichessOpeningMove) {
  return (move.white + move.draws / 2) / games(move);
}

export function games(position: LichessOpeningPosition | LichessOpeningMove) {
  return position.white + position.draws + position.black;
}
