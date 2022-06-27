export interface Position {
  readonly fen: string;
  readonly repertoire_id: string;
  readonly turn: "w" | "b";
  readonly frequency: number;
}
