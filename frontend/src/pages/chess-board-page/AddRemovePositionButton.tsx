import React from "react";
import { CircularProgress, IconButton, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  useAddMoveToRepertoire,
  useDeleteMoveFromRepertoire,
} from "../../api/supabase";
import { Position } from "@chess-buddy/database";
import { LichessOpeningPosition } from "../../api/lichess";
import { Chess } from "chess.ts";

export interface AddRemovePositionButtonProps {
  moveSan: string;
  repertoirePosition: Position;
  lichessOpeningPosition: LichessOpeningPosition;
  currentPositionIsInRepertoire: boolean;
  moveIsInRepertoire: boolean;
}

export const AddRemovePositionButton: React.FC<
  AddRemovePositionButtonProps
> = ({
  moveSan,
  repertoirePosition,
  lichessOpeningPosition,
  currentPositionIsInRepertoire,
  moveIsInRepertoire,
}) => {
  const addPositionToRepertoire = useAddMoveToRepertoire();
  const removePositionFromRepertoire = useDeleteMoveFromRepertoire();

  const handleAddToRepertoire = (event: React.MouseEvent) => {
    event.stopPropagation();

    addPositionToRepertoire.mutate({
      repertoirePosition,
      lichessOpeningPosition,
      moveSan,
    });
  };

  const handleRemoveFromRepertoire = (event: React.MouseEvent) => {
    event.stopPropagation();

    const position = new Chess(repertoirePosition.fen);
    position.move(moveSan);
    const childFen = position.fen();

    removePositionFromRepertoire.mutate({
      repertoire_id: repertoirePosition.repertoire_id,
      parent_fen: repertoirePosition.fen,
      child_fen: childFen,
    });
  };

  if (addPositionToRepertoire.isLoading) {
    return <CircularProgress size={24} />;
  } else if (!moveIsInRepertoire) {
    return (
      <Tooltip title="Add to repertoire">
        <span>
          <IconButton
            color="primary"
            disabled={!currentPositionIsInRepertoire}
            onClick={handleAddToRepertoire}
          >
            <AddIcon />
          </IconButton>
        </span>
      </Tooltip>
    );
  } else {
    return (
      <Tooltip title="Remove from repertoire">
        <IconButton color="error" onClick={handleRemoveFromRepertoire}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    );
  }
};
