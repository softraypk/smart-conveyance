"use client"

import Sidebar from "@/components/Sidebar";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {api} from "@/lib/api";
import toast from "react-hot-toast";

interface User {
    name: string;
    email: string;
    role?: string;
}

export default function MortgagesPage() {
    const router = useRouter();
    const [mortgages, setMortgages] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (err) {
                console.error("Failed to parse user from localStorage:", err);
                localStorage.removeItem("user");
            }
        }
    }, []);

    useEffect(() => {
        setLoading(true);
        const fetchMortgages = async () => {
            try {
                const response = await api("/cases?mortgageStatus=APPLICATION_SUBMITTED", {
                    method: "GET",
                });

                if (response.ok) {
                    setMortgages(response.results?.data?.cases)
                } else {
                    toast.error("Error fetching mortgage");
                }

            } catch (e) {
                toast.error("Error:" + e)
            }
        }
        fetchMortgages();
        setLoading(false);
    }, []);

    const statusColor = (status: string | undefined) => {
        switch (status) {
            case "PENDING":
                return "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300"
            case "APPROVED":
                return "bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300"
            case "DECLINED":
                return "bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300"
            default:
                return "bg-gray-100 dark:bg-gray-900/50 text-gray-800 dark:text-gray-300"
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen">
                loading...
            </div>
        )
    }


    return (
        <div className="flex flex-col min-h-screen">
            <Sidebar/>
            <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    {(user?.role === "BROKER") && (
                        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                            <h1 className="text-3xl font-bold text-black dark:text-white">Mortgage Applications</h1>
                            <button
                                onClick={() => router.push("/mortgages/new")}
                                className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:bg-primary/90">
                                <span className="material-symbols-outlined text-base"> add </span>
                                <span className="truncate">Create Mortgage Application</span>
                            </button>
                        </div>
                    )}
                    <div className="mb-6 flex flex-wrap items-center gap-4">
                        <button
                            className="flex items-center gap-2 rounded-lg border border-primary/20 bg-background-light dark:bg-background-dark px-4 py-2 text-sm font-medium text-black dark:text-white hover:bg-primary/5 dark:hover:bg-primary/10">
                            <span>Status</span>
                            <span className="material-symbols-outlined text-lg"> expand_more </span>
                        </button>
                        <button
                            className="flex items-center gap-2 rounded-lg border border-primary/20 bg-background-light dark:bg-background-dark px-4 py-2 text-sm font-medium text-black dark:text-white hover:bg-primary/5 dark:hover:bg-primary/10">
                            <span>Bank</span>
                            <span className="material-symbols-outlined text-lg"> expand_more </span>
                        </button>
                        <button
                            className="flex items-center gap-2 rounded-lg border border-primary/20 bg-background-light dark:bg-background-dark px-4 py-2 text-sm font-medium text-black dark:text-white hover:bg-primary/5 dark:hover:bg-primary/10">
                            <span>Date</span>
                            <span className="material-symbols-outlined text-lg"> expand_more </span>
                        </button>
                    </div>
                    <div
                        className="overflow-x-auto rounded-lg border border-primary/20 bg-white dark:bg-background-dark/50">
                        <table className="min-w-full divide-y divide-primary/20">
                            <thead className="bg-background-light dark:bg-background-dark/80">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-black/60 dark:text-white/60">Case
                                    ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-black/60 dark:text-white/60">Buyer
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-black/60 dark:text-white/60">Property</th>
                                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-black/60 dark:text-white/60">Bank
                                    Partner
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-black/60 dark:text-white/60">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-black/60 dark:text-white/60">Actions</th>
                            </tr>
                            </thead>

                            <tbody className="divide-y divide-primary/20 bg-white dark:bg-background-dark/50">
                            {mortgages.map((m) => {
                                const buyer = m.parties?.find((p: any) => p.role === "BUYER");
                                return (
                                    <tr key={m.id}>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-black dark:text-white">
                                            {m.id}
                                        </td>

                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-black/80 dark:text-white/80">
                                            {buyer?.members[0]?.name || "-"}
                                        </td>

                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-black/80 dark:text-white/80">
                                            {m.property?.titleDeedNo}
                                        </td>

                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-black/80 dark:text-white/80">
                                            {m.mortgageApp?.bank?.name || "-"}
                                        </td>

                                        <td className="whitespace-nowrap px-6 py-4">
                                          <span
                                              className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${statusColor(m.mortgageApp?.status)}`}>
                                            {m.mortgageApp?.status}
                                          </span>
                                        </td>

                                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                                            <a className="text-primary hover:underline"
                                               href={`/mortgages/${m.id}/show`}>View</a>
                                            <span className="text-black/30 dark:text-white/30 m-3">|</span>
                                            <a className="text-primary hover:underline"
                                               href={`/mortgages/${m.id}/edit`}>Update</a>
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>

                    </div>
                </div>
            </main>
        </div>
    )
}