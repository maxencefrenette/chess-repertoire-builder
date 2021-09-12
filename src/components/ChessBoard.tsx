import React from 'react';
import Chessground from 'react-chessground';
import 'react-chessground/dist/styles/chessground.css';

export interface ChessBoardProps {
    fen: string;
    setFen: (newFen: string) => void;
}

export const ChessBoard: React.FC<ChessBoardProps> = ({ fen }) => {
    return <Chessground width="100%" height="100%" fen={fen} />;
};
