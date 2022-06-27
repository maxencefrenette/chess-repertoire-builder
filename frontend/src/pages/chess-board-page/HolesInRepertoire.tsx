import { Paper, Grid, Button, Typography, Stack } from "@mui/material";
import React from "react";
import { useStore } from "../../store";
import "./Sidebar.css";
import { Position, Repertoire } from "@chess-buddy/database";
import { useSupabase } from "api/supabase";
import { useQuery } from "react-query";
import { formatFrequency } from "shared/format";

export interface HolesInRepertoireProps {
  repertoire: Repertoire;
}

export const HolesInRepertoire: React.FC<HolesInRepertoireProps> = ({
  repertoire,
}) => {
  const store = useStore();
  const supabase = useSupabase();

  const { data: holesType1 } = useQuery(
    ["holes_in_repertoire_type_1", repertoire.id],
    async () => {
      const { data, error } = await supabase.rpc<Position>(
        "find_repertoire_holes_type_1",
        { repertoire_id: repertoire.id }
      );

      if (error !== null) {
        throw error;
      }

      return data!;
    }
  );

  const { data: holesType2 } = useQuery(
    ["holes_in_repertoire_type_2", repertoire.id],
    async () => {
      const { data, error } = await supabase.rpc<
        Position & { missing_moves_frequency: number }
      >("find_repertoire_holes_type_2", { repertoire_id: repertoire.id });

      if (error !== null) {
        throw error;
      }

      return data!;
    }
  );

  if (holesType1 === undefined || holesType2 === undefined) {
    return null;
  }

  return (
    <Paper sx={{ padding: "16px" }}>
      <Stack spacing={2}>
        <Typography variant="h4">Holes in the Repertoire</Typography>
        <Grid container spacing={0} columns={2}>
          <Grid item md={1}>
            {holesType1.map((p) => (
              <Button
                key={p.fen}
                variant="contained"
                sx={{ marginRight: "8px", marginBottom: "8px" }}
                onClick={() => {
                  store.ui.setPosition(p.fen);
                }}
              >
                {formatFrequency(p.frequency)}
              </Button>
            ))}
          </Grid>
          <Grid item md={1}>
            {holesType2.map((p) => (
              <Button
                key={p.fen}
                variant="contained"
                sx={{ marginRight: "8px", marginBottom: "8px" }}
                onClick={() => {
                  store.ui.setPosition(p.fen);
                }}
              >
                {formatFrequency(p.frequency)}
              </Button>
            ))}
          </Grid>
        </Grid>
      </Stack>
    </Paper>
  );
};
