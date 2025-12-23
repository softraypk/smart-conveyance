"use client"

import Sidebar from "@/components/Sidebar";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {api} from "@/lib/api";
import PageLoader from "@/components/PageLoader";

interface User {
    name: string;
    email: string;
    role?: string;
    managedOrgId?: string;
}

interface Broker {
    id: string;
    name: string;
    email: string;
    phone: string;
    branchId?: string;
    branch: {
        id: string;
        name: string;
        address: string;
        phone: string;
        active: boolean;
        createdAt: string;
        updatedAt: string;
    }
    createdAt: string;
    updatedAt: string;
}

export default function BrokersPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [brokers, setBrokers] = useState([]);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);

    // Load user safely from localStorage
    useEffect(() => {
        try {
            const storedUser = localStorage.getItem("user");
            if (storedUser) setUser(JSON.parse(storedUser));
        } catch (err) {
            console.error("Failed to parse user from localStorage:", err);
            localStorage.removeItem("user");
        }
    }, []);

    // ✅ Fetch branches once user is known
    useEffect(() => {
        setLoading(true)
        if (!user?.managedOrgId) return;

        (async () => {
            try {
                const res = await api(`/orgs/${user.managedOrgId}/brokers`, {
                    method: "GET",
                });

                // Ensure safe fallback
                setBrokers(Array.isArray(res?.results?.data) ? res.results?.data : []);
                setLoading(false)
            } catch (err) {
                console.error("Failed to load branches:", err);
            }
        })();
    }, [user]);

    const route = useRouter();

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center text-gray-500">
                <PageLoader/>
            </div>
        );
    }

    return (

        <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
            <Sidebar/>
            <main className="flex-1 p-8">
                <div className="mx-auto max-w-7xl">
                    <header
                        className="bg-white dark:bg-background-dark/50 mb-6 rounded-lg bg-surface-light dark:bg-surface-dark p-6 shadow-sm border border-border-light dark:border-border-dark">
                        <div className="flex items-center justify-between gap-4 mb-4">
                            <div className="flex flex-col gap-1">
                                <h1 className="text-neutral-text-light dark:text-neutral-text-dark text-3xl font-bold leading-tight tracking-tight">Broker
                                    Management</h1>
                                <p className="text-subtle-text-light dark:text-subtle-text-dark text-base font-normal leading-normal">View,
                                    add, and manage broker information across all branches.</p>
                            </div>
                            <button
                                onClick={() => route.push("/brokers/new")}
                                className="flex min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal shadow-sm hover:bg-primary/90 transition-colors">
                                <span className="material-symbols-outlined">add</span>
                                <span className="truncate">Add New Broker</span>
                            </button>
                        </div>
                        <div
                            className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-border-light dark:border-border-dark">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary text-2xl">groups</span>
                                <div>
                                    <p className="text-sm text-subtle-text-light dark:text-subtle-text-dark">Total
                                        Brokers</p>
                                    <p className="text-lg font-semibold text-neutral-text-light dark:text-neutral-text-dark">20</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary text-2xl">apartment</span>
                                <div>
                                    <p className="text-sm text-subtle-text-light dark:text-subtle-text-dark">Active
                                        Branches</p>
                                    <p className="text-lg font-semibold text-neutral-text-light dark:text-neutral-text-dark">5</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary text-2xl">person_add</span>
                                <div>
                                    <p className="text-sm text-subtle-text-light dark:text-subtle-text-dark">New this
                                        Month</p>
                                    <p className="text-lg font-semibold text-neutral-text-light dark:text-neutral-text-dark">3</p>
                                </div>
                            </div>
                        </div>
                    </header>
                    <div className="bg-white dark:bg-subtle-dark/50 rounded-lg p-6 shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                            <div className="relative"><
                                span
                                className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted-light dark:text-muted-dark">search</span>
                                <input
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value)
                                    }}
                                    placeholder="Search by Keyword"
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-subtle-light dark:border-subtle-dark bg-background-light dark:bg-background-dark focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-shadow"
                                    type="text"/>
                            </div>
                            <div className="relative"><span
                                className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted-light dark:text-muted-dark">search</span><input
                                placeholder="Search by Phone"
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-subtle-light dark:border-subtle-dark bg-background-light dark:bg-background-dark focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-shadow"
                                type="text"/></div>
                            <div>
                                <select
                                    className="w-full px-4 py-2 rounded-lg border border-subtle-light dark:border-subtle-dark bg-background-light dark:bg-background-dark focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-shadow">
                                    <option>Status: All</option>
                                    <option>In Progress</option>
                                    <option>Completed</option>
                                    <option>Pending</option>
                                </select>
                            </div>
                            <div>
                                <input
                                    className="w-full px-4 py-2 rounded-lg border border-subtle-light dark:border-subtle-dark bg-background-light dark:bg-background-dark focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-shadow"
                                    type="date"/>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                <tr className="border-b border-subtle-light dark:border-subtle-dark">
                                    <th className="px-4 py-3 text-left font-semibold text-muted-light dark:text-muted-dark">Broker
                                        Name
                                    </th>
                                    <th className="px-4 py-3 text-left font-semibold text-muted-light dark:text-muted-dark">Email</th>
                                    <th className="px-4 py-3 text-left font-semibold text-muted-light dark:text-muted-dark">Phone</th>
                                    <th className="px-4 py-3 text-left font-semibold text-muted-light dark:text-muted-dark">Associated
                                        Branch
                                    </th>
                                    <th className="px-4 py-3 text-left font-semibold text-muted-light dark:text-muted-dark">Created
                                        At
                                    </th>
                                    <th className="px-4 py-3 text-left font-semibold text-muted-light dark:text-muted-dark">Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {brokers.map((broker: Broker) => (
                                    <tr key={broker?.id}
                                        className="border-b border-subtle-light dark:border-subtle-dark hover:bg-background-light dark:hover:bg-background-dark/50 transition-colors">
                                        <td className="px-4 py-4 font-medium">{broker?.name || "-"}</td>
                                        <td className="px-4 py-4 text-muted-light dark:text-muted-dark">{broker?.email || "-"}</td>
                                        <td className="px-4 py-4 text-muted-light dark:text-muted-dark">{broker?.phone || "-"}</td>
                                        <td className="px-4 py-4"><span
                                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">{broker?.branch?.name || "-"}</span>
                                        </td>
                                        <td className="px-4 py-4 text-muted-light dark:text-muted-dark">Oct 31, 2025
                                            05:53
                                            PM
                                        </td>
                                        <td className="px-4 py-4">
                                            <button
                                                onClick={() => route.push(`/brokers/${broker.id}/edit`)}
                                                className="font-semibold text-primary hover:underline mr-3">
                                                <span className="material-symbols-outlined text-base">edit</span>
                                            </button>
                                            <button
                                                onClick={() => route.push(`/brokers/${broker.id}/delete`)}
                                                aria-label="Delete broker"
                                                className="font-semibold text-primary hover:underline">
                                                <span className="material-symbols-outlined text-base">delete</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}