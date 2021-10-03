import React from 'react';
import Chessground from '@react-chess/chessground';
import { useStore } from '../store';
import { observer } from 'mobx-react-lite';

export const ChessBoard: React.FC = observer(() => {
    const store = useStore();
    return (
        <Chessground
            width={1000}
            height={1000}
            config={{ fen: store.ui.position.fen() }}
        />
    );
});
