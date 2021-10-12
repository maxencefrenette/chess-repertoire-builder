import React from 'react';
import Chessground from '@react-chess/chessground';
import { useStore } from '../../store';
import { observer } from 'mobx-react-lite';
import { generateLegalMovesForChessboard, getLastMoveTuple, Square } from '../../helpers/chess';

export const ChessBoard: React.FC = observer(() => {
    const store = useStore();

    const position = store.ui.position;
    const legalMoves = generateLegalMovesForChessboard(position);
    const lastMove = getLastMoveTuple(position);

    return (
        <Chessground
            width={1000}
            height={1000}
            config={{
                fen: store.ui.position.fen(),
                check: position.inCheck(),
                turnColor: position.turn() === 'w' ? 'white' : 'black',
                lastMove: lastMove,
                movable: { free: false, dests: legalMoves },
                events: {
                    move: (from, to) =>
                        store.ui.makeMoveFromTo(from as Square, to as Square),
                }
            }}
        />
    );
});
