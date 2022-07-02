import { Button, MenuItem, Stack, Typography } from "@mui/material";
import { RouteComponentProps } from "@reach/router";
import { useCreateRepertoire } from "api/supabase";
import { Select, TextField } from "mui-rff";
import React from "react";
import { Form } from "react-final-form";
import { PageContainer } from "shared/PageContainer";

interface FormValues {
  name: string;
  color: "w" | "b";
  lichessSpeeds: readonly string[];
  lichessRatings: readonly string[];
}

export const RepertoireCreatePage: React.FC<RouteComponentProps> = () => {
  const initialValues: FormValues = {
    name: "",
    color: "w",
    lichessSpeeds: [],
    lichessRatings: [],
  };

  const createRepertoireMutation = useCreateRepertoire();

  async function onSubmit(values: FormValues) {
    createRepertoireMutation.mutateAsync({
      name: values.name,
      color: values.color,
      lichessSpeeds: values.lichessSpeeds.join(","),
      lichessRatings: values.lichessRatings.join(","),
    });
  }

  return (
    <PageContainer>
      <Typography variant="h2">Create Repertoire</Typography>
      <br />
      <Form
        onSubmit={onSubmit}
        initialValues={initialValues}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit} noValidate>
            <Stack spacing={3}>
              <TextField label="Name" name="name" required={true} />
              <Select label="Color" name="color" required={true}>
                <MenuItem value="w">White</MenuItem>
                <MenuItem value="b">Black</MenuItem>
              </Select>
              <Select
                label="Time Controls"
                name="lichessSpeeds"
                multiple={true}
                required={true}
              >
                <MenuItem value="ultraBullet">Ultra Bullet</MenuItem>
                <MenuItem value="bullet">Bullet</MenuItem>
                <MenuItem value="blitz">Blitz</MenuItem>
                <MenuItem value="rapid">Rapid</MenuItem>
                <MenuItem value="classical">Classical</MenuItem>
                <MenuItem value="correspondence">Correspondence</MenuItem>
              </Select>
              <Select
                label="Ratings"
                name="lichessRatings"
                multiple={true}
                required={true}
              >
                <MenuItem value="1600">1600-1799</MenuItem>
                <MenuItem value="1800">1800-1999</MenuItem>
                <MenuItem value="2000">2000-2199</MenuItem>
                <MenuItem value="2200">2200-2499</MenuItem>
                <MenuItem value="2500">2500+</MenuItem>
              </Select>
              <Button type="submit" variant="contained">
                Submit
              </Button>
            </Stack>
          </form>
        )}
      />
    </PageContainer>
  );
};
