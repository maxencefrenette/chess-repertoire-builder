import { Chess } from 'chess.ts';
import React, { useState } from 'react';
import styled from 'styled-components';
import { ChessBoard } from './components/ChessBoard';
import { Sidebar } from './components/Sidebar';

const Layout = styled.div`
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

function App() {
    const [position, setPosition] = useState(
        new Chess()
    );
    
    return (
        <Layout>
            <ChessBoardContainer>
                <ChessBoard position={position} setPosition={setPosition} />
            </ChessBoardContainer>
            <SidebarContainer>
                <Sidebar position={position} />
            </SidebarContainer>
        </Layout>
    );
}

export default App;
