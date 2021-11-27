import { task, desc } from "foy";
import dotenv from "dotenv";

dotenv.config({ path: ".env.dev" });

desc("Start the backend for local development");
task("backend", async (ctx) => {
  if (!(await ctx.fs.isDirectory("supabase"))) {
    await ctx.exec("supabase init", { stdio: "ignore" });

    // Remove the extra gitignore stuff added by supabase
    let gitignore = (await ctx.fs.readFile(".gitignore")).toString();
    gitignore = gitignore.replace("# Supabase\n", "");
    gitignore = gitignore.replace("**/supabase/.temp\n", "");
    gitignore = gitignore.replace("**/supabase/.env\n", "");
    gitignore = gitignore.replace("**/supabase/.globals.sql\n", "");
    gitignore = gitignore.replace(/\n*$/, "\n");

    console.log(gitignore);
    await ctx.fs.writeFile(".gitignore", gitignore);
  } else {
    ctx.log("supabase init skipped");
  }

  ctx.exec("supabase start");
});

desc("Start the frontend for local development");
task("frontend", async (ctx) => {
  ctx
    .env("REACT_APP_SUPABASE_URL", process.env.SUPABASE_URL)
    .env("REACT_APP_SUPABASE_ANON_KEY", process.env.SUPABASE_ANON_KEY)
    .exec("yarn workspace frontend react-scripts start");
});

// TODO: add task to start the lichess study scraper
