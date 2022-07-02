export interface Repertoire {
  readonly id: string;
  readonly user_id: string;
  readonly name: string;
  color: "b" | "w";
  readonly lichess_speeds: string;
  readonly lichess_ratings: string;
}
