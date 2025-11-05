"use client";

import Sidebar from "@/components/Sidebar";
import {useParams, useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {api} from "@/lib/api";

interface User {
    id: number;
    name: string;
    email: string;
    initialBranchCheck: string;
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api(`/admins`, {
                    method: "GET"
                }); // ✅ Your endpoint

                console.log(response);

                if (response.ok) {
                    setUsers(response.results || []);
                } else {
                    console.error("Error fetching users:", response.error);
                }
            } catch (error) {
                console.error("Fetch error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div className="flex h-screen">
            <Sidebar/>

            <main className="flex-1 w-full py-8 px-6 lg:px-12 bg-white dark:bg-gray-900">
                <div className="flex flex-col gap-8">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <h1 className="text-3xl font-bold text-black/90 dark:text-white/90">
                            Users
                        </h1>
                        <button
                            onClick={() => router.push("/users/new")}
                            className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
                        >
                            <span className="material-symbols-outlined">add</span>
                            Create New User
                        </button>
                    </div>

                    {/* Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                <span className="material-symbols-outlined text-black/50 dark:text-white/50">
                                    search
                                </span>
                            </div>
                            <input
                                type="text"
                                placeholder="Search by property"
                                className="form-input w-full rounded-lg border border-black/10 dark:border-white/10 bg-background-light dark:bg-background-dark text-black/70 dark:text-white/70 focus:ring-primary focus:border-primary py-3 pl-12 pr-4"
                            />
                        </div>

                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                <span className="material-symbols-outlined text-black/50 dark:text-white/50">
                                    search
                                </span>
                            </div>
                            <input
                                type="text"
                                placeholder="Search by party name"
                                className="form-input w-full rounded-lg border border-black/10 dark:border-white/10 bg-background-light dark:bg-background-dark text-black/70 dark:text-white/70 focus:ring-primary focus:border-primary py-3 pl-12 pr-4"
                            />
                        </div>

                        <div>
                            <select
                                className="form-select w-full rounded-lg border border-black/10 dark:border-white/10 bg-background-light dark:bg-background-dark text-black/70 dark:text-white/70 focus:ring-primary focus:border-primary py-3 px-4">
                                <option>Status: All</option>
                                <option>In Progress</option>
                                <option>Completed</option>
                                <option>Pending</option>
                            </select>
                        </div>

                        <div>
                            <input
                                type="date"
                                className="form-input w-full rounded-lg border border-black/10 dark:border-white/10 bg-background-light dark:bg-background-dark text-black/70 dark:text-white/70 focus:ring-primary focus:border-primary py-3 px-4"
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <div
                        className="bg-white/50 dark:bg-black/20 rounded-lg p-6 border border-black/5 dark:border-white/5 overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                            <tr className="border-b border-black/10 dark:border-white/10">
                                <th className="px-4 py-3 text-left font-semibold text-black/60 dark:text-white/60">User
                                    ID
                                </th>
                                <th className="px-4 py-3 text-left font-semibold text-black/60 dark:text-white/60">Name
                                </th>
                                <th className="px-4 py-3 text-left font-semibold text-black/60 dark:text-white/60"> Email
                                </th>
                                {/*<th className="px-4 py-3 text-left font-semibold text-black/60 dark:text-white/60">Status</th>*/}
                                {/*<th className="px-4 py-3 text-left font-semibold text-black/60 dark:text-white/60">Created*/}
                                {/*    At*/}
                                {/*</th>*/}
                                <th className="px-4 py-3 text-left font-semibold text-black/60 dark:text-white/60">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-6 text-gray-500">
                                        Loading users...
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-6 text-gray-500">
                                        No users found
                                    </td>
                                </tr>
                            ) : (
                                users.map((User) => (
                                    <tr
                                        key={User.id}
                                        className="border-b border-black/10 dark:border-white/10 hover:bg-black/[0.02] dark:hover:bg-white/5 transition-colors"
                                    >
                                        <td className="px-4 py-4 font-medium">{User.id}</td>
                                        <td className="px-4 py-4 text-black/60 dark:text-white/60">{User.name}</td>
                                        <td className="px-4 py-4 text-black/60 dark:text-white/60">{User.email}</td>
                                        {/*<td className="px-4 py-4">*/}
                                        {/*    <span*/}
                                        {/*        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.status}`}>*/}
                                        {/*        {user.status}*/}
                                        {/*    </span>*/}
                                        {/*</td>*/}
                                        {/*<td className="px-4 py-4 text-black/60 dark:text-white/60">{user.createdAt}</td>*/}
                                        <td className="px-4 py-4">
                                            <a onClick={() => router.push(`users/${User.id}`)}
                                               className="font-semibold text-primary hover:underline cursor-pointer">
                                                View
                                            </a>
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}