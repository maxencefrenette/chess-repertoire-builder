import React, { useState } from "react";
import { RouteComponentProps } from "@reach/router";
import { useSupabase } from "../../api/supabase";
import { UsernamePasswordForm } from "../../shared/UsernamePasswordForm";
import { navigate } from "@reach/router";

export const LoginPage: React.FC<RouteComponentProps> = () => {
  const supabase = useSupabase();
  const [message, setMessage] = useState("");

  const handleSubmit = async (email: string, password: string) => {
    const { error } = await supabase.auth.signIn(
      {
        email,
        password,
      },
      { redirectTo: "/" }
    );

    if (error !== null) {
      setMessage(error.message);
    } else {
      setMessage("Successfully signed-in, please wait to be redirected");
      navigate(-1);
    }
  };

  return (
    <UsernamePasswordForm
      title="Login"
      message={message}
      passwordAutocomlete="current-password"
      onSubmit={handleSubmit}
    />
  );
};
