"use client";

import Sidebar from "@/components/Sidebar";
import {useRouter} from "next/navigation";
import {FormEvent, useEffect, useState} from "react";
import {api} from "@/lib/api";
import toast from "react-hot-toast";

interface User {
    name: string;
    email: string;
    role?: string;
    managedOrgId?: string;
}

interface Branch {
    id?: string;
    name: string;
    address?: string;
}

export default function NewBranchPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [user, setUser] = useState<User | null>(null);
    const [branch, setBranch] = useState<Branch | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    // ✅ Load user from localStorage
    useEffect(() => {
        try {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } catch (err) {
            console.error("Failed to parse user from localStorage:", err);
            localStorage.removeItem("user");
        }
    }, []);

    const handleCreateBranch = async (event: FormEvent) => {
        event.preventDefault();
        setLoading(true);
        const payload = {
            name,
            address
        }

        try {
            const response = await api(`/orgs/${user?.managedOrgId}/branches`, {
                method: "POST",
                body: JSON.stringify(payload)
            })
            if (response.ok) {
                toast.success("Branch created");
                router.push("/branches");
            } else {
                toast.error("error", response.results.message);
            }
        } catch (e) {
            console.error("Fetch error:", e);
        }
    }


    return (
        <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
            <Sidebar/>
            <main
                className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center py-10">
                <div className="w-full max-w-lg">
                    <div className="bg-white dark:bg-slate-900/50 rounded-xl shadow-lg p-8 space-y-8">
                        {/* Header */}
                        <div className="text-center">
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                                Create Your First Branch
                            </h2>
                            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                                Set up the main office for your firm.
                            </p>
                        </div>

                        {/* Form */}
                        <form className="space-y-6" onSubmit={handleCreateBranch}>
                            {/* Branch Name */}
                            <div>
                                <label
                                    htmlFor="branchName"
                                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                                >
                                    Branch Name
                                </label>
                                <input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    type="text"
                                    id="branchName"
                                    placeholder="e.g. Dubai Main Office"
                                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-background-light dark:bg-background-dark focus:border-primary focus:ring-primary text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500"
                                />
                            </div>

                            {/* Address */}
                            <div>
                                <label
                                    htmlFor="address"
                                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                                >
                                    Address
                                </label>
                                <textarea
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    id="address"
                                    rows={4}
                                    placeholder="Enter the full address of the branch"
                                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-background-light dark:bg-background-dark focus:border-primary focus:ring-primary text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500"
                                />
                            </div>

                            {/* Timezone */}
                            {/*<div>*/}
                            {/*    <label*/}
                            {/*        htmlFor="timezone"*/}
                            {/*        className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"*/}
                            {/*    >*/}
                            {/*        Timezone*/}
                            {/*    </label>*/}
                            {/*    <select*/}
                            {/*        id="timezone"*/}
                            {/*        name="timezone"*/}
                            {/*        defaultValue=""*/}
                            {/*        className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-background-light dark:bg-background-dark focus:border-primary focus:ring-primary text-slate-800 dark:text-slate-200"*/}
                            {/*    >*/}
                            {/*        <option value="" disabled>*/}
                            {/*            Select a timezone*/}
                            {/*        </option>*/}
                            {/*        <option value="Asia/Dubai">(GMT+4) Dubai</option>*/}
                            {/*        <option value="Asia/Riyadh">(GMT+3) Riyadh</option>*/}
                            {/*        <option value="Asia/Qatar">(GMT+3) Qatar</option>*/}
                            {/*    </select>*/}
                            {/*</div>*/}

                            {/* Submit */}
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-background-dark transition-all duration-300 ease-in-out"
                                >
                                    Create Branch
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}
