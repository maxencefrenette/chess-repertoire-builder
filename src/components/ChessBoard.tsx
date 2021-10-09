import React from 'react';
import Chessground from '@react-chess/chessground';
import { useStore } from '../store';
import { observer } from 'mobx-react-lite';
import { generateMovesForChessboard, Square } from '../helpers/chess';

export const ChessBoard: React.FC = observer(() => {
    const store = useStore();

    const position = store.ui.position;
    const moves = generateMovesForChessboard(position);

    return (
        <Chessground
            width={1000}
            height={1000}
            config={{
                fen: store.ui.position.fen(),
                movable: { free: false, dests: moves },
                events: {
                    move: (from, to) =>
                        store.ui.makeMoveFromTo(from as Square, to as Square),
                },
            }}
        />
    );
});
