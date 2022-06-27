import { Repertoire } from "@chess-buddy/database";
import { Box } from "@mui/system";
import { RouteComponentProps } from "@reach/router";
import React from "react";
import { useQuery } from "react-query";
import { useSupabase } from "src/api/supabase";
import { ChessBoard } from "./ChessBoard";
import { HolesInRepertoire } from "./HolesInRepertoire";
import { Sidebar } from "./Sidebar";

interface ChessBoardPageProps extends RouteComponentProps {
  repertoireId?: string;
}

export const ChessBoardPage: React.FC<ChessBoardPageProps> = ({
  repertoireId,
}) => {
  const supabase = useSupabase();

  const { data: repertoire } = useQuery("repertoire", async () => {
    const { data, error } = await supabase
      .from<Repertoire>("repertoires")
      .select()
      .eq("id", repertoireId || "")
      .single();

    if (error !== null) {
      throw error;
    }

    return data!;
  });

  // Display nothing while loading
  if (repertoireId && !repertoire) return null;

  return (
    <Box sx={{ display: "flex", padding: "10px" }}>
      <Box sx={{ width: "1000px", margin: "10px" }}>
        <ChessBoard />
      </Box>
      <Box sx={{ flex: "1 0 200px", margin: "10px" }}>
        <Sidebar repertoire={repertoire} />
        {repertoire && <HolesInRepertoire repertoire={repertoire} />}
      </Box>
    </Box>
  );
};
