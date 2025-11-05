"use client";

import {FormEvent, useState} from "react";
import {api} from "@/lib/api";
import {Header} from "@/components/Header";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

        try {
            const response = await api("/auth/password-reset/initiate", {
                method: "POST",
                body: JSON.stringify({email})

            });

            if (response?.ok) {
                setMessage("We’ve sent a verification link to your email address. Please check your inbox to continue.");
            } else {
                setError("Unable to process request. Please try again later.");
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "Email not found or invalid request.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full flex-col">
            <Header/>
            <main className="flex flex-1 items-center justify-center py-12 px-6">
                <div className="max-w-md mx-auto mt-20 bg-white dark:bg-gray-900 p-8 rounded-xl shadow">
                    <h1 className="text-2xl font-semibold text-center mb-6">
                        Verify Your Email to Reset Password
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your registered email"
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:ring-primary focus:outline-none"
                            />
                        </div>

                        <div className="mt-8">
                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative flex w-full justify-center rounded-lg bg-primary py-3 px-4 text-base font-semibold text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                            >
                                {loading ? "Sending..." : "Continue"}
                            </button>
                        </div>
                    </form>

                    {message && <p className="mt-4 text-green-600 text-center">{message}</p>}
                    {error && <p className="mt-4 text-red-600 text-center">{error}</p>}
                </div>
            </main>
        </div>
    )
}