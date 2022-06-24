import { task, desc, setGlobalOptions } from "foy";
import dotenv from "dotenv";

setGlobalOptions({ loading: false });

desc("Start the frontend for local development");
task("frontend", async (ctx) => {
  dotenv.config({ path: ".env.dev" });

  await ctx
    .env("REACT_APP_SUPABASE_URL", process.env.SUPABASE_URL)
    .env("REACT_APP_SUPABASE_ANON_KEY", process.env.SUPABASE_ANON_KEY)
    .exec("yarn workspace @chess-buddy/frontend start");
});

// TODO: add task to start the lichess study scraper
