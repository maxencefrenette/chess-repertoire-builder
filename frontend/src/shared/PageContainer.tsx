import { Paper } from "@mui/material";
import React from "react";

export const PageContainer: React.FC = ({ children }) => {
  return (
    <Paper sx={{ width: 1000, margin: "16px auto", padding: "16px" }}>
      {children}
    </Paper>
  );
};
