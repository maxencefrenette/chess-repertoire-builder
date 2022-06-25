import { Repertoire } from "@chess-buddy/database";
import { Button, Paper, Stack } from "@mui/material";
import { RouteComponentProps } from "@reach/router";
import React from "react";
import { useQuery } from "react-query";
import { useSupabase } from "src/api/supabase";
import { Link } from "@reach/router";

export const RepertoireListPage: React.FC<RouteComponentProps> = () => {
  const supabase = useSupabase();
  const { data: repertoires } = useQuery("repertoires", async () => {
    const { data, error } = await supabase
      .from<Repertoire>("repertoires")
      .select();

    if (error !== null) {
      throw error;
    }

    return data!;
  });

  if (!repertoires) {
    return null;
  }

  return (
    <Paper sx={{ width: 1000, margin: "16px auto", padding: "16px" }}>
      <Stack sx={{ marginBottom: "16px" }}>
        {repertoires.map((repertoire) => (
          <Button
            key={repertoire.id}
            component={Link}
            to={`/repertoires/${repertoire.id}`}
            variant="outlined"
          >
            {repertoire.name}
          </Button>
        ))}
      </Stack>
      <Button variant="contained" disabled={true}>
        Create Repertoire
      </Button>
    </Paper>
  );
};
