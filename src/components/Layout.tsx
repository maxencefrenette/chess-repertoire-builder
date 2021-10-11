import React from 'react';
import styled from 'styled-components';
import { ChessBoard } from './ChessBoard';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

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

export const Layout = () => {
    return (
        <>
            <TopBar />
            <Container>
                <ChessBoardContainer>
                    <ChessBoard />
                </ChessBoardContainer>
                <SidebarContainer>
                    <Sidebar />
                </SidebarContainer>
            </Container>
        </>
    );
};
