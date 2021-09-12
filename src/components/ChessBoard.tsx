import React from 'react';
import Chessground from 'react-chessground';
import 'react-chessground/dist/styles/chessground.css';
import styled from 'styled-components';

const Container = styled.div`
    width: 100vh;
    height: 100vh;
    padding: 20px;
`;

export interface ChessBoardProps {
    fen: string;
    setFen: (newFen: string) => void;
}

export const ChessBoard: React.FC<ChessBoardProps> = ({ fen }) => {
    return (
        <Container>
            <Chessground width="100%" height="100%" fen={fen} />
        </Container>
    );
};
