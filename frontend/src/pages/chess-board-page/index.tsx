import { Stack, Box } from "@mui/material";
import { RouteComponentProps } from "@reach/router";
import React from "react";
import { useRepertoireQuery } from "api/supabase";
import { ChessBoard } from "./ChessBoard";
import { HolesInRepertoire } from "./HolesInRepertoire";
import { Sidebar } from "./Sidebar";

interface ChessBoardPageProps extends RouteComponentProps {
  repertoireId?: string;
}

export const ChessBoardPage: React.FC<ChessBoardPageProps> = ({
  repertoireId,
}) => {
  const { data: repertoire } = useRepertoireQuery(repertoireId);

  // Display nothing while loading
  if (repertoireId && !repertoire) return null;

  return (
    <Box sx={{ display: "flex", padding: "10px" }}>
      <Box sx={{ width: "1000px", margin: "10px" }}>
        <ChessBoard />
      </Box>
      <Stack sx={{ flex: "1 0 200px", margin: "10px" }}>
        <Sidebar repertoire={repertoire} />
        {repertoire && <HolesInRepertoire repertoire={repertoire} />}
      </Stack>
    </Box>
  );
};
