import { Button, Stack } from "@mui/material";
import { RouteComponentProps } from "@reach/router";
import React from "react";
import { Link } from "@reach/router";
import { useRepertoiresQuery } from "api/supabase";
import { PageContainer } from "shared/PageContainer";

export const RepertoireListPage: React.FC<RouteComponentProps> = () => {
  const { data: repertoires } = useRepertoiresQuery();

  if (!repertoires) {
    return null;
  }

  return (
    <PageContainer>
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
      <Button component={Link} to="/repertoires/create" variant="contained">
        Create Repertoire
      </Button>
    </PageContainer>
  );
};
