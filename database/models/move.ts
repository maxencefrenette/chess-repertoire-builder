export interface Move {
  readonly repertoire_id: string;
  readonly parent_fen: string;
  readonly child_fen: string;
  readonly san: string;
  readonly move_frequency: number;
}
