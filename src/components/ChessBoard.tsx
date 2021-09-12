import React from 'react';
import Chessground from 'react-chessground';
import 'react-chessground/dist/styles/chessground.css';
import styled from 'styled-components';

const Container = styled.div`
    width: calc(100vh - 16px);
    height: calc(100vh - 16px);
`;

export const ChessBoard = () => {
    return (
        <Container>
            <Chessground width="100%" height="100%" fen="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1" />
        </Container>
    );
};
