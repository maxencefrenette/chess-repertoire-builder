import { Chess } from 'chess.ts';
import React from 'react';
import Chessground from '@react-chess/chessground';

export interface ChessBoardProps {
    position: Chess;
    setPosition: (newPosition: Chess) => void;
}

export const ChessBoard: React.FC<ChessBoardProps> = ({ position }) => {
    return <Chessground width={1000} height={1000} config={{ fen: position.fen() }} />;
};
