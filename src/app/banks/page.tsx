"use client";

import Sidebar from "@/components/Sidebar";
import {useEffect, useState} from "react";
import {api} from "@/lib/api";
import toast from "react-hot-toast";
import {useRouter} from "next/navigation";

interface Bank {
    id: number;
    name: string;
    address: string;
    code: string;
}

export default function BanksPage() {
    const [search, setSearch] = useState("");
    const [banks, setBanks] = useState<Bank[]>([]);
    const [loading, setLoading] = useState(false);
    const route = useRouter();

    useEffect(() => {
        const listBanks = async () => {
            setLoading(true);
            try {
                const response = await api("/admins/banks", {method: "GET"});

                if (response?.ok || response?.status === 200) {
                    setBanks(response.results || []);
                } else {
                    toast.error("Error: " + (response.results?.message || "Failed to fetch banks"));
                }
            } catch (e) {
                toast.error("Network error while fetching banks");
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        listBanks();
    }, []);

    return (
        <div className="flex h-screen">
            <Sidebar/>

            <main className="flex-1 w-full py-8 px-6 lg:px-12 bg-white dark:bg-gray-900">
                <div className="flex flex-wrap justify-between gap-4 items-center mb-6">
                    <p className="text-text-light dark:text-text-dark text-3xl font-bold leading-tight tracking-tight">
                        All Banks
                    </p>
                    <button onClick={() => route.push("/banks/new")}
                            className="flex min-w-[84px] items-center justify-center rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold gap-2 hover:bg-primary/90 transition-colors"
                    >
                        <span className="material-symbols-outlined">add</span>
                        <span className="truncate">Add New Bank</span>
                    </button>
                </div>

                <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <label className="flex-1 flex-col min-w-40 h-12 w-full">
                        <div className="relative w-full h-full">
                            <div
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-subtext-light dark:text-subtext-dark">
                                <span className="material-symbols-outlined">search</span>
                            </div>
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="form-input flex w-full rounded-lg text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary/50 border-border-light dark:border-border-dark bg-content-light dark:bg-content-dark h-full placeholder:text-subtext-light dark:placeholder:text-subtext-dark pl-12 text-sm"
                                placeholder="Search by bank name or code..."
                            />
                        </div>
                    </label>
                    <div className="flex gap-2 items-center">
                        <button
                            className="flex h-12 items-center justify-center gap-x-2 rounded-lg bg-content-light dark:bg-content-dark border border-border-light dark:border-border-dark px-4 hover:bg-primary/10 transition-colors">
                            <p className="text-text-light dark:text-text-dark text-sm font-medium">Region</p>
                            <span
                                className="material-symbols-outlined text-subtext-light dark:text-subtext-dark text-base">
                expand_more
              </span>
                        </button>
                        <button
                            className="flex h-12 items-center justify-center gap-x-2 rounded-lg bg-content-light dark:bg-content-dark border border-border-light dark:border-border-dark px-4 hover:bg-primary/10 transition-colors">
                            <p className="text-text-light dark:text-text-dark text-sm font-medium">Status</p>
                            <span
                                className="material-symbols-outlined text-subtext-light dark:text-subtext-dark text-base">
                expand_more
              </span>
                        </button>
                    </div>
                </div>

                <div
                    className="bg-content-light dark:bg-content-dark rounded-xl border border-border-light dark:border-border-dark overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead
                                className="bg-background-light dark:bg-background-dark text-xs uppercase text-subtext-light dark:text-subtext-dark">
                            <tr>
                                <th className="p-4 w-12">
                                    <input
                                        className="form-checkbox rounded border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-primary focus:ring-primary/50"
                                        type="checkbox"
                                    />
                                </th>
                                <th className="px-6 py-3 font-semibold">Bank Name</th>
                                <th className="px-6 py-3 font-semibold">Bank Code</th>
                                <th className="px-6 py-3 font-semibold">Address</th>
                                <th className="px-6 py-3 font-semibold">Status</th>
                                <th className="px-6 py-3 font-semibold text-right">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={6}
                                        className="p-4 text-center text-subtext-light dark:text-subtext-dark">
                                        Loading...
                                    </td>
                                </tr>
                            ) : banks.length > 0 ? (
                                banks.map((bank) => (
                                    <tr
                                        key={bank.id}
                                        className="border-b border-border-light dark:border-border-dark hover:bg-background-light dark:hover:bg-background-dark"
                                    >
                                        <td className="p-4">
                                            <input
                                                className="form-checkbox rounded border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-primary focus:ring-primary/50"
                                                type="checkbox"
                                            />
                                        </td>
                                        <th className="px-6 py-4 font-medium whitespace-nowrap text-text-light dark:text-text-dark">
                                            {bank.name}
                                        </th>
                                        <td className="px-6 py-4 text-subtext-light dark:text-subtext-dark">{bank.code}</td>
                                        <td className="px-6 py-4 text-subtext-light dark:text-subtext-dark">{bank.address}</td>
                                        <td className="px-6 py-4">
                        <span
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300">
                          Active
                        </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    className="flex size-8 items-center justify-center rounded-lg hover:bg-primary/10 transition-colors">
                                                    <span
                                                        className="material-symbols-outlined text-base">visibility</span>
                                                </button>
                                                <button
                                                    onClick={() => route.push(`banks/${bank.id}/edit`)}
                                                    className="flex size-8 items-center justify-center rounded-lg hover:bg-primary/10 transition-colors">
                                                    <span className="material-symbols-outlined text-base">edit</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6}
                                        className="p-4 text-center text-subtext-light dark:text-subtext-dark">
                                        No banks found
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
