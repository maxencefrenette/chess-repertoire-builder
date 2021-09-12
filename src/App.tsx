import React, { useState } from 'react';
import styled from 'styled-components';
import { ChessBoard } from './components/ChessBoard';
import { Sidebar } from './components/Sidebar';

const Layout = styled.div`
    display: flex;
`;

const ChessBoardContainer = styled.div`
    width: 100vh;
    height: 100vh;
    padding: 20px;
`;

const SidebarContainer = styled.div`
    flex: 1 0 200px;
    padding: 20px;
`;

function App() {
    const [fen, setFen] = useState(
        'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
    );

    return (
        <Layout>
            <ChessBoardContainer>
                <ChessBoard fen={fen} setFen={setFen} />
            </ChessBoardContainer>
            <SidebarContainer>
                <Sidebar />
            </SidebarContainer>
        </Layout>
    );
}

export default App;
