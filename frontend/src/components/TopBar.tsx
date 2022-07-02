import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link as RouterLink } from "@reach/router";
import { UserAuthActions } from "./UserAuthActions";
import { observer } from "mobx-react-lite";
import { useIsLoggedIn } from "api/supabase/auth";

export const TopBar = observer(() => {
  const isLoggedIn = useIsLoggedIn();

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ marginRight: "100px" }}
          >
            Chess Buddy
          </Typography>
          <Button component={RouterLink} to="/" color="inherit">
            Board
          </Button>
          {isLoggedIn && (
            <>
              <Button component={RouterLink} to="/repertoires" color="inherit">
                Repertoires
              </Button>
              <Button component={RouterLink} to="/options" color="inherit">
                Options
              </Button>
            </>
          )}
          <Button component={RouterLink} to="/help" color="inherit">
            Help
          </Button>
          <Box sx={{ flexGrow: 1 }} />
          <UserAuthActions />
        </Toolbar>
      </AppBar>
    </div>
  );
});
