import { useEffect, useState } from "react";
import { useSupabase } from ".";

export function useIsLoggedIn() {
  const supabase = useSupabase();
  const [isLoggedIn, setIsLoggedIn] = useState(
    supabase.auth.session() !== null
  );

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_, session) => {
      setIsLoggedIn(session !== null);
    });

    return () => {
      sub && sub.unsubscribe();
    };
  });

  return isLoggedIn;
}
