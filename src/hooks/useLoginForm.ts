import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

type LoginFormState = {
  email: string;
  password: string;
};

export function useLoginForm(onSuccess?: () => void) {
  const [formData, setFormData] = useState<LoginFormState>({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    const { email, password } = formData;

    if (!email || !password) {
      setMessage("Please fill in all fields.");
      setLoading(false);
      return;
    }

    try {
      const { data: sessionData, error } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (error) {
        console.error("Login error:", error);
        setMessage("Invalid email or password.");
        setLoading(false);
        return;
      }

      const user = sessionData?.user;
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }

      setMessage("Login successful!");
      setLoading(false);

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error(err);
      setMessage("Error logging in. Please try again.");
      setLoading(false);
    }
  };

  return {
    formData,
    message,
    loading,
    handleChange,
    handleSubmit,
    setMessage,
  };
}