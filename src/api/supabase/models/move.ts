export interface Move {
    repertoire_id: string;
    parent_fen: string;
    child_fen: string;
    move: string;
    move_frequency: number;
}
