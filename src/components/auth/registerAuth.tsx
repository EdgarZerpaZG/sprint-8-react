import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { GoHome } from './../../utils/gohome'

export default function RegisterForm() {

    const path = '/';
    const home = GoHome(path);

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");
        setLoading(true);

        if (!username || !email || !password || !confirmPassword) {
        setMessage("All fields are required");
        setLoading(false);
        return;
        }

        if (password !== confirmPassword) {
        setMessage("The passwords do not match");
        setLoading(false);
        return;
        }

        try {
        const { data: existing } = await supabase
            .from("users")
            .select("*")
            .or(`username.eq.${username},email.eq.${email}`);

        if (existing && existing.length > 0) {
            setMessage("The username or email address is already registered.");
            setLoading(false);
            return;
        }

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
            data: { username },
            emailRedirectTo: `${window.location.origin}/emailconfirmation`,
            },
        });

        if (error) throw error;

        if (data?.user) {
            await supabase.from("users").insert([
            {
                id: data.user.id,
                username,
                email,
            },
            ]);
        }

        setMessage(
            "Account created successfully. Please check your email to confirm your account before logging in."
        );
        } catch (err: any) {
        console.error("Registration error: ", err);
        setMessage("Error creating account: " + err.message);
        } finally {
        setLoading(false);
        }
    };

    return (
        <>
            <form onSubmit={handleRegister}>
                <div className="space-y-12">
                    <div className="border-b border-white/10 pb-12">
                        <h2 className="text-base/7 font-semibold text-white">Profile</h2>
                        <p className="mt-1 text-sm/6 text-gray-400">
                        This information will be displayed publicly so be careful what you share.
                        </p>

                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div className="sm:col-span-4">
                                <label htmlFor="username" className="block text-sm/6 font-medium text-white">
                                Username
                                </label>
                                <div className="mt-2">
                                    <div className="flex items-center rounded-md bg-white/5 pl-3 outline-1 -outline-offset-1 outline-white/10 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-500">
                                        <div className="shrink-0 text-base text-gray-400 select-none sm:text-sm/6">
                                        dashboard-master.com/
                                        </div>
                                        <input
                                        id="username"
                                        type="text"
                                        name="username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="Gameking"
                                        className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 outline-white/10 focus:outline-2 focus:outline-indigo-500 sm:text-sm/6"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-b border-white/10 pb-12">
                        <h2 className="text-base/7 font-semibold text-white">Personal Information</h2>
                        <p className="mt-1 text-sm/6 text-gray-400">Use a permanent address where you can receive mail.</p>

                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div className="sm:col-span-7">
                                <label htmlFor="email" className="block text-sm/6 font-medium text-white">
                                    Email address
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        autoComplete="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 outline-white/10 focus:outline-2 focus:outline-indigo-500 sm:text-sm/6"
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="password" className="block text-sm/6 font-medium text-white">
                                    Password
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="password"
                                        type="password"
                                        name="password"
                                        autoComplete="new-password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 outline-white/10 focus:outline-2 focus:outline-indigo-500 sm:text-sm/6"
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="confirm-password" className="block text-sm/6 font-medium text-white">
                                    Confirm password
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="confirm-password"
                                        type="password"
                                        name="confirm-password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 outline-white/10 focus:outline-2 focus:outline-indigo-500 sm:text-sm/6"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-x-6">
                    <button type="button" onClick={home} className="text-sm/6 font-semibold text-white hover:text-gray-500 cursor-pointer">
                        Cancel
                    </button>
                    <button type="submit" disabled={loading} className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-600 cursor-pointer disabled:opacity-50">
                        {loading ? "Registering..." : "Register"}
                    </button>
                </div>

                {message && (
                <p className="mt-5 text-center text-sm text-gray-300">{message}</p>
                )}
            </form>
            </>
    )
}