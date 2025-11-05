"use client";

import {use} from "react"; // ✅ React 19 hook for async params
import {useState} from "react";
import {useRouter} from "next/navigation";
import toast from "react-hot-toast";

import {api} from "@/lib/api";
import Sidebar from "@/components/Sidebar";

interface User {
    id: number;
    name: string;
    email: string;
    password: string;
}

export default function UserProfile({
                                        params,
                                    }: {
    params: Promise<{ id: string }>;
}) {
    // ✅ React 19 `use()` waits for the async params
    const {id} = use(params);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    // ✅ Form submit handler
    const handleSaveForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const payload = {name, email, password};

        try {
            const response = await api("/admins", {
                method: "POST",
                body: JSON.stringify(payload),
            });

            // ✅ Your `api()` helper should return parsed JSON, not raw Response
            if (response?.status === 200 || response?.ok) {
                toast.success("User created successfully!");
                router.push("/users");
            } else {
                throw new Error(response?.results?.message || "Something went wrong");
            }
        } catch (err: any) {
            toast.error(err.message || "Failed to register");
        } finally {
            setLoading(false);
        }
        setLoading(false);
    };

    return (
        <div className="flex h-screen">
            <Sidebar/>
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center">
                <div className="w-full max-w-lg">
                    <div className="bg-white dark:bg-slate-900/50 rounded-xl shadow-lg p-8 space-y-8">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                                Create New User
                            </h2>
                            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                                Add an admin user for your organization.
                            </p>
                        </div>

                        <form className="space-y-6" onSubmit={handleSaveForm}>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Name
                                </label>
                                <input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="form-input w-full rounded-lg border-slate-300 dark:border-slate-700 bg-background-light dark:bg-background-dark focus:border-primary focus:ring-primary text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500"
                                    placeholder="e.g. John Doe"
                                    type="text"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Email
                                </label>
                                <input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="form-input w-full rounded-lg border-slate-300 dark:border-slate-700 bg-background-light dark:bg-background-dark focus:border-primary focus:ring-primary text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500"
                                    placeholder="e.g. user@example.com"
                                    type="email"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Password
                                </label>
                                <input
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="form-input w-full rounded-lg border-slate-300 dark:border-slate-700 bg-background-light dark:bg-background-dark focus:border-primary focus:ring-primary text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500"
                                    placeholder="Enter password"
                                    type="password"
                                    required
                                />
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-background-dark transition-all duration-300 ease-in-out disabled:opacity-70">
                                    {loading ? "Saving..." : "Create User"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}