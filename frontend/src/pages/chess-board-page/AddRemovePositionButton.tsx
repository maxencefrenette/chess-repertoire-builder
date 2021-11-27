import React from "react";
import { CircularProgress, IconButton, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  useAddPositionToRepertoire,
  useRemovePositionFromRepertoire,
} from "../../api/supabase";
import { Position } from "database/models";
import { LichessOpeningPosition } from "../../api/lichess";
import { Chess } from "chess.ts";

export interface AddRemovePositionButtonProps {
  moveSan: string;
  repertoirePosition: Position;
  lichessOpeningPosition: LichessOpeningPosition;
  currentPositionIsInRepertoire: boolean;
  moveIsInRepertoire: boolean;
}

export const AddRemovePositionButton: React.FC<AddRemovePositionButtonProps> =
  ({
    moveSan,
    repertoirePosition,
    lichessOpeningPosition,
    currentPositionIsInRepertoire,
    moveIsInRepertoire,
  }) => {
    const addPositionToRepertoire = useAddPositionToRepertoire();
    const removePositionFromRepertoire = useRemovePositionFromRepertoire();

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

      removePositionFromRepertoire(repertoirePosition.repertoire_id, childFen);
    };

    if (addPositionToRepertoire.isLoading) {
      return <CircularProgress size={24} />;
    } else if (!moveIsInRepertoire) {
      return (
        <Tooltip title="Add to repertoire">
          <IconButton
            color="primary"
            disabled={!currentPositionIsInRepertoire}
            onClick={handleAddToRepertoire}
          >
            <AddIcon />
          </IconButton>
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
