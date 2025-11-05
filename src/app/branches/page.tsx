"use client";

import Sidebar from "@/components/Sidebar";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {api} from "@/lib/api";
import toast from "react-hot-toast";
import dayjs from "dayjs";

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
    phone: string;
    createdAt: string;
}

export default function BranchesPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [branches, setBranches] = useState<Branch[]>([]);
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

    // ✅ Fetch branches when user is available
    useEffect(() => {
        if (!user?.managedOrgId) return;

        const listBranches = async () => {
            try {
                const response = await api(`/orgs/${user.managedOrgId}/branches`, {
                    method: "GET",
                });

                console.log("Branch response:", response);

                // Check if your api() returns parsed JSON or a Response object
                if (response.ok) {
                    setBranches(response.results?.data || []);
                } else {
                    toast.error("Failed to load: " + response.results.message);
                }
            } catch (error) {
                console.error("Failed to connect:", error);
                toast.error("Network error while fetching branches");
            } finally {
                setLoading(false);
            }
        };

        listBranches();
    }, [user]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center text-gray-500">
                Loading branches...
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
            <Sidebar/>

            <main className="flex-1 overflow-auto p-6 md:p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <h2 className="text-3xl font-bold">Branches</h2>
                        <button onClick={() => router.push("/branches/new")}
                                className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors">
                            <span className="material-symbols-outlined">add</span>
                            Create New Branch
                        </button>
                    </div>

                    <div className="bg-white dark:bg-subtle-dark/50 rounded-lg p-6 shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                            <div className="relative"><span
                                className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted-light dark:text-muted-dark">search</span><input
                                placeholder="Search by property"
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-subtle-light dark:border-subtle-dark bg-background-light dark:bg-background-dark focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-shadow"
                                type="text"/></div>
                            <div className="relative"><span
                                className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted-light dark:text-muted-dark">search</span><input
                                placeholder="Search by party name"
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-subtle-light dark:border-subtle-dark bg-background-light dark:bg-background-dark focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-shadow"
                                type="text"/></div>
                            <div><select
                                className="w-full px-4 py-2 rounded-lg border border-subtle-light dark:border-subtle-dark bg-background-light dark:bg-background-dark focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-shadow">
                                <option>Status: All</option>
                                <option>In Progress</option>
                                <option>Completed</option>
                                <option>Pending</option>
                            </select></div>
                            <div><input
                                className="w-full px-4 py-2 rounded-lg border border-subtle-light dark:border-subtle-dark bg-background-light dark:bg-background-dark focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-shadow"
                                type="date"/></div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                <tr className="border-b border-subtle-light dark:border-subtle-dark">
                                    {["Branch ID", "Name", "Address", "Phone", "Created At", "Actions"].map((head) => (
                                        <th
                                            key={head}
                                            className="px-4 py-3 text-left font-semibold text-muted-light dark:text-muted-dark"
                                        >
                                            {head}
                                        </th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody>
                                {branches.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="text-left py-6 text-muted-light dark:text-muted-dark"
                                        >
                                            No Records Found
                                        </td>
                                    </tr>
                                ) : (
                                    branches.map((branch) => (
                                        <tr
                                            key={branch.id}
                                            className="border-b border-subtle-light dark:border-subtle-dark hover:bg-background-light dark:hover:bg-background-dark/50 transition-colors"
                                        >
                                            <td className="px-4 py-4 font-medium">
                                                {branch.id || "—"}
                                            </td>
                                            <td className="px-4 py-4 text-muted-light dark:text-muted-dark">
                                                {branch.name}
                                            </td>
                                            <td className="px-4 py-4 text-muted-light dark:text-muted-dark">
                                                {branch.address || "—"}
                                            </td>
                                            <td className="px-4 py-4 text-muted-light dark:text-muted-dark">
                                                {branch?.phone || "-"}
                                            </td>
                                            <td className="px-4 py-4 text-muted-light dark:text-muted-dark">
                                                {dayjs(branch.createdAt).format("MMM DD, YYYY hh:mm A") || "-"}
                                            </td>
                                            <td className="px-4 py-4">
                                                <button
                                                    onClick={() => router.push(`branches/${branch.id}/show`)}
                                                    className="font-semibold text-primary hover:underline"
                                                >
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
