import React, { createContext, useContext, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useStore } from "../../store";
import { action, runInAction } from "mobx";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey, {
  shouldThrowOnError: true,
});

const SupabaseContext = createContext(supabase);

export const SupabaseContextProvider: React.FC = ({ children }) => {
  const store = useStore();
  useEffect(() => {
    runInAction(() => {
      store.ui.isLoggedIn = supabase.auth.session() !== null;
    });

    const { data: sub } = supabase.auth.onAuthStateChange(
      action((event, session) => {
        store.ui.isLoggedIn = session !== null;
      })
    );

    return () => {
      sub && sub.unsubscribe();
    };
  });

  return (
    <SupabaseContext.Provider value={supabase}>
      {children}
    </SupabaseContext.Provider>
  );
};

export const useSupabase = () => useContext(SupabaseContext);
