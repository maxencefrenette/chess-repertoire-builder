import { createClient } from "@supabase/supabase-js";

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

await supabase.auth.api.createUser({
  email: "user@example.com",
  password: "QPP%&5b2CV&*Vxds",
  email_confirm: true,
});
