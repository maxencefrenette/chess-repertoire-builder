import { task, desc, setGlobalOptions } from "foy";
import dotenv from "dotenv";

setGlobalOptions({ loading: false });

desc("Start the backend for local development");
task("backend", async (ctx) => {
  dotenv.config({ path: ".env.dev" });

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

  // Cleanup old docker containers
  const { stdout } = await ctx.exec("docker ps -a -q -f name=supabase", {
    stdio: "pipe",
  });

  if (stdout) {
    const containers = stdout.split("\n").join(" ");
    await ctx.exec(`docker stop ${containers}`, { stdio: "ignore" });
    await ctx.exec(`docker rm ${containers}`, { stdio: "ignore" });
  }

  const supabaseStartProcess = ctx.exec("supabase start");

  // Setup database
  await ctx.sleep(1500);
  await ctx.exec(`psql -d '${process.env.DB_URL}' -f database/schema.sql`, {
    stdio: "ignore",
  });
  await ctx
    .env("SUPABASE_URL", process.env.SUPABASE_URL)
    .env("SUPABASE_SERVICE_ROLE_KEY", process.env.SUPABASE_SERVICE_ROLE_KEY)
    .exec("yarn workspace database seed");

  await supabaseStartProcess;
});

desc("Start the frontend for local development");
task("frontend", async (ctx) => {
  dotenv.config({ path: ".env.dev" });

  ctx
    .env("REACT_APP_SUPABASE_URL", process.env.SUPABASE_URL)
    .env("REACT_APP_SUPABASE_ANON_KEY", process.env.SUPABASE_ANON_KEY)
    .exec("yarn workspace frontend react-scripts start");
});

// TODO: add task to start the lichess study scraper
