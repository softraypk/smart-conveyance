"use client"; // must be the very first line

import {Header} from "@/components/Header";
import {useSearchParams, useRouter} from "next/navigation";
import {FormEvent, useState} from "react";
import {api} from "@/lib/api";
import toast from "react-hot-toast";

export default function ReSetPasswordPage() {
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const router = useRouter();

    const handleResetPassword = async (e: FormEvent) => {
        e.preventDefault();

        if (!token) {
            toast.error("Token not found");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords don't match");
            return;
        }

        setLoading(true);

        try {
            const response = await api(
                "/auth/password-reset",
                {
                    method: "PATCH",
                    body: JSON.stringify({ newPassword: password }),
                },
                token
            );

            if (response.ok) {
                toast.success("Password reset successfully.");
                router.push("/");
            } else {
                toast.error(response?.error || response?.results?.message || "Something went wrong");
            }
        } catch (err) {
            console.error("Error:", err);
            toast.error("Unexpected error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header/>
            <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center">
                        <h2 className="mt-6 text-3xl font-extrabold text-slate-900 dark:text-white">
                            Complete Your Account Setup
                        </h2>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                            Welcome! Let's get your account activated.
                        </p>
                    </div>

                    <form
                        onSubmit={handleResetPassword}
                        className="bg-white dark:bg-slate-900/50 p-6 sm:p-8 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 space-y-6"
                    >
                        <div className="space-y-4">
                            {/* Password Field */}
                            <div className="relative">
                                <label className="sr-only" htmlFor="password">Password</label>
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">lock</span>
                                <input
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="form-input block w-full rounded-md border-slate-300 dark:border-slate-700 bg-background-light dark:bg-background-dark py-3 pl-10 pr-12 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                    id="password"
                                    name="password"
                                    placeholder="Password"
                                    type="password"
                                    required
                                />
                            </div>

                            {/* Confirm Password Field */}
                            <div className="relative">
                                <label className="sr-only" htmlFor="confirm-password">Confirm Password</label>
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">lock</span>
                                <input
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="form-input block w-full rounded-md border-slate-300 dark:border-slate-700 bg-background-light dark:bg-background-dark py-3 pl-10 pr-12 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                    id="confirm-password"
                                    name="confirm-password"
                                    placeholder="Confirm Password"
                                    type="password"
                                    required
                                />
                            </div>

                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Password must be at least 8 characters long, contain uppercase,
                                lowercase, numbers, and a special character.
                            </p>
                        </div>

                        <div className="border-t border-slate-200 dark:border-slate-800"></div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-background-dark"
                        >
                            {loading ? "Activating..." : "Activate Account"}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}