/// <reference types="react-scripts" />

declare module 'react-chessground' {
    import React from 'react';
    interface ReactChessGroundProps {
        width: string;
        height: string;
        fen: string;
        onMove?: (from: string, to: string) => void;
        randomMove?: (moves: string[], move: string) => void;
        promotion?: (e: string) => void;
        reset?: () => void;
        undo?: () => void;
    }

    declare class Chessground extends React.Component<ReactChessGroundProps> {}
    export default Chessground;
}
