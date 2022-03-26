import { createClient } from "@supabase/supabase-js";
import { Repertoire, Position, unwrap } from "@chess-buddy/database";
import dotenv from "dotenv";

dotenv.config({ path: "../.env.dev" });

// TODO: submit a bug report to supabase to they can fix their typings
declare module "@supabase/supabase-js" {
  interface UserAttributes {
    email_confirm: boolean;
  }
}

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

const user = await supabase.auth.api
  .createUser({
    email: "user@example.com",
    password: "QPP%&5b2CV&*Vxds",
    email_confirm: true,
  })
  .then(unwrap);

const repertoire = await supabase
  .from<Repertoire>("repertoires")
  .insert({
    name: "London System",
    lichess_ratings: "1600,1800",
    lichess_speeds: "blitz,rapid,classical,correspondence",
    user_id: user.id,
  })
  .single()
  .then(unwrap);

await supabase.from<Position>("positions").insert({
  repertoire_id: repertoire.id,
  fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  frequency: 1,
});
