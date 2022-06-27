import React from "react";
import Chessground from "@react-chess/chessground";
import { useStore } from "store";
import { observer } from "mobx-react-lite";
import {
  generateLegalMovesForChessboard,
  getLastMoveTuple,
  Square,
} from "shared/chess";
import { DrawShape } from "chessground/draw";
import { Paper } from "@mui/material";

export const ChessBoard: React.FC = observer(() => {
  const store = useStore();

  const position = store.ui.position;
  const legalMoves = generateLegalMovesForChessboard(position);
  const lastMove = getLastMoveTuple(position);

  let highlightedMove: DrawShape | undefined;

  if (store.ui.hoveredMove) {
    const moveSan = store.ui.hoveredMove;

    const position = store.ui.position.clone();
    const move = position.move(moveSan);

    if (move === null) {
      console.error("Could not display hovered move", {
        moveSan,
        position,
        move,
      });
      throw new Error("Could not display hovered move");
    } else {
      highlightedMove = {
        orig: move.from as Square,
        dest: move.to as Square,
        brush: "paleBlue",
      };
    }
  }

  return (
    <Paper sx={{ overflow: "hidden" }}>
      <Chessground
        width={1000}
        height={1000}
        config={{
          fen: store.ui.position.fen(),
          check: position.inCheck(),
          turnColor: position.turn() === "w" ? "white" : "black",
          lastMove: lastMove,
          movable: { free: false, dests: legalMoves },
          events: {
            move: (from, to) =>
              store.ui.makeMoveFromTo(from as Square, to as Square),
          },
          drawable: {
            autoShapes: highlightedMove ? [highlightedMove] : [],
          },
        }}
      />
    </Paper>
  );
});
