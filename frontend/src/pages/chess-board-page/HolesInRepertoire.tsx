import { Paper, Grid, Button, Typography, Stack } from "@mui/material";
import React from "react";
import { useStore } from "../../store";
import "./Sidebar.css";
import { Repertoire } from "@chess-buddy/database";
import { useRepertoireHoles } from "api/supabase";
import { formatFrequency } from "shared/format";

export interface HolesInRepertoireProps {
  repertoire: Repertoire;
}

export const HolesInRepertoire: React.FC<HolesInRepertoireProps> = ({
  repertoire,
}) => {
  const store = useStore();

  const { data: holesType1 } = useRepertoireHoles(repertoire.id, 1);
  const { data: holesType2 } = useRepertoireHoles(repertoire.id, 2);

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
