import { useEffect, useState } from "react";
import { supabase } from "./../lib/supabaseClient";

export default function EmailConfirmation() {
  const [status, setStatus] = useState("Verifying your email...");

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        setStatus("Your email was successfully verified. Redirecting to login...");
        setTimeout(() => {
          window.location.href = "/login";
        }, 3000);
      } else if (event === "USER_UPDATED") {
        setStatus("Your account was successfully confirmed. Redirecting...");
        setTimeout(() => {
          window.location.href = "/login";
        }, 3000);
      } else if (event === "SIGNED_OUT") {
        setStatus("Your email address could not be verified. Please try logging in again.");
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <main className="flex items-center justify-center min-h-screen flex-col text-white">
      <h1 className="text-2xl font-bold mb-3">Email verification</h1>
      <p>{status}</p>
    </main>
  );
}