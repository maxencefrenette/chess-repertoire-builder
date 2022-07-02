export interface Repertoire {
  readonly id: string;
  readonly user_id: string;
  readonly name: string;
  readonly color: "b" | "w";
  readonly lichess_speeds: string;
  readonly lichess_ratings: string;
}
