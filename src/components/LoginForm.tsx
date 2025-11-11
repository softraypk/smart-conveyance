"use client";

import {SyntheticEvent, useState} from "react";
import {useRouter} from "next/navigation";
import {api} from "@/lib/api";

export function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    const router = useRouter();
    const handlerLoginForm = async (e: SyntheticEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

        const payload = {
            email: email,
            password: password,
        };

        try {
            // Always await the api() call
            const response = await api("/auth/login", {
                method: "POST",
                body: JSON.stringify(payload),
            });

            //console.log("Login result:", response);

            localStorage.removeItem("authToken");
            localStorage.removeItem("user");

            // If the response includes the token and message
            if (response.ok) {
                localStorage.setItem("authToken", response.results.authToken);
                localStorage.setItem("user", JSON.stringify(response.results.user));

                setMessage("Login successful!");
                router.push("/dashboards");
            } else {
                setError(response.error || `Error ${response.status}`);
            }
        } catch (err) {
            console.error("Login error:", err);
            setError("Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <form className="mt-8 space-y-6" onSubmit={handlerLoginForm}>
            <div className="space-y-4 rounded-md shadow-sm">
                <div>
                    <label className="sr-only" htmlFor="email-address">Email address</label>
                    <input autoComplete="email"
                           value={email}
                           onChange={(e) => setEmail(e.target.value)}
                           className="relative block w-full appearance-none rounded-md border border-gray-300 dark:border-gray-600 px-3 py-3 bg-background-light dark:bg-background-dark placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:z-10 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                           id="email-address" name="email" placeholder="Email address" type="email"/>
                </div>
                <div>
                    <label className="sr-only" htmlFor="password">Password</label>
                    <input autoComplete="current-password"
                           value={password}
                           onChange={(e) => setPassword(e.target.value)}
                           className="relative block w-full appearance-none rounded-md border border-gray-300 dark:border-gray-600 px-3 py-3 bg-background-light dark:bg-background-dark placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:z-10 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                           id="password" name="password" placeholder="Password" type="password"/>
                </div>
            </div>
            <div className="flex items-center justify-end">
                <div className="text-sm">
                    <button onClick={() => router.push('/users/forgetpassword')} className="font-medium text-primary hover:text-primary/80">Forgot your password?</button>
                </div>
            </div>
            <div>
                <button
                    className="group relative flex w-full justify-center rounded-md border border-transparent bg-primary py-3 px-4 text-sm font-semibold text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background-dark"
                    type="submit">
                    Login
                </button>
            </div>
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="bg-white dark:bg-background-dark/50 px-2 text-gray-500 dark:text-gray-400">Or continue with</span>
                </div>
            </div>
            <div>
                <button
                    className="group relative flex w-full justify-center rounded-md border border-gray-300 dark:border-gray-600 bg-background-light dark:bg-background-dark py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-background-dark/70 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background-dark"
                    type="button">
                    UAE PASS Login
                </button>
            </div>
        </form>
    )
}