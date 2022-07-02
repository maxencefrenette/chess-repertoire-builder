import { Button, Stack } from "@mui/material";
import { RouteComponentProps } from "@reach/router";
import React from "react";
import { Link } from "@reach/router";
import { useDeleteRepertoire, useRepertoiresQuery } from "api/supabase";
import { PageContainer } from "shared/PageContainer";
import DeleteIcon from "@mui/icons-material/Delete";

export const RepertoireListPage: React.FC<RouteComponentProps> = () => {
  const { data: repertoires } = useRepertoiresQuery();
  const deleteRepertoireMutation = useDeleteRepertoire();

  if (!repertoires) {
    return null;
  }

  return (
    <PageContainer>
      <Stack spacing={2}>
        {repertoires.map((repertoire) => (
          <Stack key={repertoire.id} direction="row" spacing={1}>
            <Button
              component={Link}
              to={`/repertoires/${repertoire.id}`}
              variant="outlined"
              sx={{ flexGrow: 1 }}
            >
              {repertoire.name}
            </Button>
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => deleteRepertoireMutation.mutate(repertoire.id)}
            >
              Delete
            </Button>
          </Stack>
        ))}
        <Button
          component={Link}
          to="/repertoires/create"
          variant="contained"
          sx={{ width: "200px" }}
        >
          Create Repertoire
        </Button>
      </Stack>
    </PageContainer>
  );
};
