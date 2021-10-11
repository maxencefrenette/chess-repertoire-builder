import { RouteComponentProps } from '@reach/router';
import React from 'react';
import styled from 'styled-components';
import { ChessBoard } from './ChessBoard';
import { Sidebar } from './Sidebar';

const Container = styled.div`
    display: flex;
`;

const ChessBoardContainer = styled.div`
    width: 1040px;
    padding: 20px;
`;

const SidebarContainer = styled.div`
    flex: 1 0 200px;
    padding: 20px;
`;

export const ChessBoardPage: React.FC<RouteComponentProps> = () => {
    return (
        <Container>
            <ChessBoardContainer>
                <ChessBoard />
            </ChessBoardContainer>
            <SidebarContainer>
                <Sidebar />
            </SidebarContainer>
        </Container>
    );
};
