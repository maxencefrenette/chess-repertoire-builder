import { Router } from "@reach/router";
import React from "react";
import { ChessBoardPage } from "../pages/chess-board-page";
import { LoginPage } from "../pages/login-page";
import { RegisterPage } from "../pages/register-page";
import { RepertoirePage } from "../pages/repertoire-page";

export const Routing = () => {
  return (
    <Router>
      <ChessBoardPage path="/" default />
      <RepertoirePage path="/repertoires" />
      <RegisterPage path="/register" />
      <LoginPage path="/login" />
    </Router>
  );
};
