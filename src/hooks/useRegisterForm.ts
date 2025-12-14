import { useState, type ChangeEvent, type FormEvent } from "react";
import { supabase } from "../lib/supabaseClient";

type RegisterFormState = {
  username: string;
  name: string;
  lastname: string;
  email: string;
  phone: string;
  location: string;
  hobby: string;
  password: string;
  confirmPassword: string;
};

export function useRegisterForm(onSuccess?: () => void) {
  const [formData, setFormData] = useState<RegisterFormState>({
    username: "",
    name: "",
    lastname: "",
    email: "",
    phone: "",
    location: "",
    hobby: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    const {
      username,
      name,
      lastname,
      email,
      phone,
      location,
      hobby,
      password,
      confirmPassword,
    } = formData;

    if (
      !username ||
      !name ||
      !lastname ||
      !email ||
      !location ||
      !hobby ||
      !password ||
      !confirmPassword
    ) {
      setMessage("All fields are required");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setMessage("The passwords do not match");
      setLoading(false);
      return;
    }

    const phoneNumber =
      phone.trim().length > 0 ? Number(phone.trim()) : null;

    if (phoneNumber !== null && Number.isNaN(phoneNumber)) {
      setMessage("Phone must be a valid number");
      setLoading(false);
      return;
    }

    try {
      const { data: existing, error: existingError } = await supabase
        .from("users")
        .select("id, username, email")
        .or(`username.eq.${username},email.eq.${email}`);

      if (existingError) {
        console.error("Error checking existing user:", existingError);
      }

      if (existing && existing.length > 0) {
        setMessage("The username or email address is already registered.");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            name,
            lastname,
            phone: phone.trim(),
            location,
            hobby,
          },
          emailRedirectTo: `${window.location.origin}/emailconfirmation`,
        },
      });

      if (error) throw error;

      if (data?.session?.user) {
        const userId = data.session.user.id;

        const { error: upsertError } = await supabase.from("users").upsert([
          {
            id: userId,
            username,
            email,
            name,
            lastname,
            phone: phoneNumber,
            location,
            hobby,
            is_active: true,
          },
        ]);

        if (upsertError) {
          console.error("Error upserting user in table:", upsertError);
        }
      }

      setMessage(
        "Account created successfully. Please check your email to confirm your account before logging in."
      );

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      console.error("Registration error: ", err);
      setMessage("Error creating account: " + (err.message ?? ""));
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    message,
    loading,
    handleChange,
    handleRegister,
    setMessage,
  };
}