import React, { useState } from 'react';
import { ChessBoard } from './components/ChessBoard';

function App() {
  const [fen, setFen] = useState("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");

  return (
    <ChessBoard fen={fen} setFen={setFen} />
  );
}

export default App;
