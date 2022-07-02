import { Router } from "@reach/router";
import { RepertoireCreatePage } from "pages/repertoire-create-page";
import React from "react";
import { ChessBoardPage } from "../pages/chess-board-page";
import { LoginPage } from "../pages/login-page";
import { RegisterPage } from "../pages/register-page";
import { RepertoireListPage } from "../pages/repertoire-list-page";

export const Routing = () => {
  return (
    <Router>
      <ChessBoardPage path="/" default />
      <RepertoireListPage path="/repertoires" />
      <RepertoireCreatePage path="/repertoires/create" />
      <ChessBoardPage path="/repertoires/:repertoireId" />
      <RegisterPage path="/register" />
      <LoginPage path="/login" />
    </Router>
  );
};
