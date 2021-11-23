import React, { useState } from "react";
import { navigate, RouteComponentProps } from "@reach/router";
import { useSupabase } from "../../api/supabase";
import { UsernamePasswordForm } from "../../shared/UsernamePasswordForm";

export const RegisterPage: React.FC<RouteComponentProps> = () => {
  const supabase = useSupabase();
  const [message, setMessage] = useState("");

  const handleSubmit = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp(
      {
        email,
        password,
      },
      { redirectTo: "/" }
    );

    if (error !== null) {
      setMessage(error.message);
    } else {
      setMessage("Successfully registered, please wait to be redirected");
      navigate(-1);
    }
  };

  return (
    <UsernamePasswordForm
      title="Register"
      message={message}
      passwordAutocomlete="new-password"
      onSubmit={handleSubmit}
    />
  );
};
