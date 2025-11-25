import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { Link } from "react-router-dom";
import { GoHome } from './../../utils/gohome';

export default function LoginForm() {
  const path = "/";
  const home = GoHome(path);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
      const { data: sessionData, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
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

      setTimeout(() => home, 3000);

    } catch (err) {
      console.error(err);
      setMessage("Error logging in. Please try again.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-12">
        <div className="border-b border-white/10 pb-12">
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-5">
            <div className="sm:col-span-5">
              <label htmlFor="email" className="block text-sm/6 font-medium text-white">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                />
              </div>
            </div>
            <div className="sm:col-span-5">
              <label htmlFor="password" className="block text-sm/6 font-medium text-white">
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {message && <p className="text-sm text-gray-300 mt-4">{message}</p>}

      <div className="mt-6 flex items-center justify-center gap-x-6">
        <button type="button" onClick={home} className="text-sm/6 font-semibold text-white hover:text-gray-500 cursor-pointer">
          Cancel
        </button>
        <button type="submit" disabled={loading} className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 cursor-pointer disabled:opacity-50">
          {loading ? "Logging in..." : "Log in"}
        </button>
      </div>

      <div className="mt-5">
        <p className="text-sm/8">
          Don't have an account?{" "}
          <Link to="/register" className="text-white hover:text-gray-500 font-bold">
            Register
          </Link>
        </p>
      </div>
    </form>
  );
}