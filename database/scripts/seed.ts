import { createClient } from "@supabase/supabase-js";
import { Repertoire, Position, unwrap } from "@chess-buddy/database";
import dotenv from "dotenv";
import retry from "p-retry";

dotenv.config({ path: "../.env.dev" });

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string,
  { shouldThrowOnError: true }
);

const user = await retry(
  async () =>
    await supabase.auth.api
      .createUser({
        email: "user@example.com",
        password: "QPP%&5b2CV&*Vxds",
        email_confirm: true,
      })
      .then(unwrap)
);

const { data: repertoire } = await supabase
  .from<Repertoire>("repertoires")
  .insert({
    name: "London System",
    color: "w",
    lichess_ratings: "1600,1800",
    lichess_speeds: "blitz,rapid,classical,correspondence",
    user_id: user!.id,
  })
  .single();

await supabase.from<Position>("positions").insert({
  repertoire_id: repertoire!.id,
  fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  turn: "w",
  frequency: 1,
  transpositions: 1,
});
