import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

await supabase.auth.api.createUser({
  email: "user@example.com",
  password: "QPP%&5b2CV&*Vxds",
  email_confirm: true,
} as any);
