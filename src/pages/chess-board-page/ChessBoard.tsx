import React from 'react';
import Chessground from '@react-chess/chessground';
import { useStore } from '../../store';
import { observer } from 'mobx-react-lite';
import {
    generateLegalMovesForChessboard,
    getLastMoveTuple,
    Square,
} from '../../helpers/chess';
import { DrawShape } from "chessground/draw";

export const ChessBoard: React.FC = observer(() => {
    const store = useStore();

    const position = store.ui.position;
    const legalMoves = generateLegalMovesForChessboard(position);
    const lastMove = getLastMoveTuple(position);

    let highlightedMove: DrawShape | undefined;

    if (store.ui.hoveredMoveUci) {
        const move = store.ui.hoveredMoveUci;
        highlightedMove = { orig: move.slice(0, 2) as Square, dest: move.slice(2, 4) as Square, brush: 'paleBlue' };
    }

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
                },
                drawable: {
                    autoShapes: highlightedMove ? [highlightedMove] : []
                }
            }}
        />
    );
});
