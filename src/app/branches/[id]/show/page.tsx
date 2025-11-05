"use client";

import Sidebar from "@/components/Sidebar";
import {useParams, useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {api} from "@/lib/api";
import toast from "react-hot-toast";

interface User {
    name: string;
    email: string;
    role?: string;
    managedOrgId?: string;
}

export interface Broker {
    id: string;
    name: string | null;
    email: string;
    role: "BROKER" | string;
    phone: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface Branch {
    id: string;
    orgId: string;
    name: string;
    address: string;
    phone: string | null;
    active: boolean;
    createdAt: string;
    updatedAt: string;
    brokers: Broker[];
}

export default function ShowBranchPage() {
    const params = useParams();
    const id = params.id;
    const router = useRouter();

    const [user, setUser] = useState<User | null>(null);
    const [branch, setBranch] = useState<Branch | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    // ✅ Load user from localStorage
    useEffect(() => {
        try {
            const storedUser = localStorage.getItem("user");
            if (storedUser) setUser(JSON.parse(storedUser));
        } catch (err) {
            console.error("Failed to parse user from localStorage:", err);
            localStorage.removeItem("user");
        }
    }, []);

    // ✅ Fetch branch data
    useEffect(() => {
        const listBranch = async () => {
            if (!user?.managedOrgId || !id) return;
            setLoading(true);

            try {
                const response = await api(`/orgs/${user.managedOrgId}/branches/${id}`, {
                    method: "GET",
                });

                if (response.ok) {
                    setBranch(response.results?.data);
                } else {
                    toast.error("Failed to load branch");
                }
            } catch (err) {
                console.error("Failed to load branch:", err);
            } finally {
                setLoading(false);
            }
        };

        listBranch();
    }, [id, user]);

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
                <Sidebar/>
                <main className="flex-1 overflow-auto p-6 md:p-8">
                    <div className="max-w-7xl mx-auto">Loading branch...</div>
                </main>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
            <Sidebar/>

            <main className="flex-1 overflow-auto p-6 md:p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                            {branch?.name ?? "Branch Details"}
                        </h2>
                        <button
                            onClick={() => router.push(`/branches/${id}`)}
                            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
                        >
                            <span className="material-symbols-outlined">edit</span>
                            Edit Branch
                        </button>
                    </div>

                    {/* Branch Info */}
                    <div className="bg-white dark:bg-subtle-dark/50 rounded-lg p-6 shadow-sm mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div>
                                <h4 className="text-sm font-semibold text-muted-light dark:text-muted-dark">
                                    Branch ID
                                </h4>
                                <p className="text-base text-gray-900 dark:text-white">
                                    {branch?.id}
                                </p>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-muted-light dark:text-muted-dark">
                                    Address
                                </h4>
                                <p className="text-base text-gray-900 dark:text-white">
                                    {branch?.address}
                                </p>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-muted-light dark:text-muted-dark">
                                    Status
                                </h4>
                                <p className="text-base text-green-600 font-medium">
                                    {branch?.active ? "Active" : "Inactive"}
                                </p>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-muted-light dark:text-muted-dark">
                                    Phone
                                </h4>
                                <p className="text-base text-gray-900 dark:text-white">
                                    {branch?.phone || ""}
                                </p>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-muted-light dark:text-muted-dark">
                                    Created At
                                </h4>
                                <p className="text-base text-gray-900 dark:text-white">
                                    {new Date(branch?.createdAt || "").toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Brokers */}
                    <div className="bg-white dark:bg-subtle-dark/50 rounded-lg p-6 shadow-sm">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Brokers
                            </h3>
                            <button
                                onClick={() => router.push('/brokers/new')}
                                className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors">
                                <span className="material-symbols-outlined">add</span>
                                Add Broker
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                <tr className="border-b border-subtle-light dark:border-subtle-dark">
                                    <th className="px-4 py-3 text-left font-semibold text-muted-light dark:text-muted-dark">
                                        Broker ID
                                    </th>
                                    <th className="px-4 py-3 text-left font-semibold text-muted-light dark:text-muted-dark">
                                        Name
                                    </th>
                                    <th className="px-4 py-3 text-left font-semibold text-muted-light dark:text-muted-dark">
                                        Email
                                    </th>
                                    <th className="px-4 py-3 text-left font-semibold text-muted-light dark:text-muted-dark">
                                        Phone
                                    </th>
                                    <th className="px-4 py-3 text-left font-semibold text-muted-light dark:text-muted-dark">
                                        Actions
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                {branch?.brokers?.length ? (
                                    branch.brokers.map((broker) => (
                                        <tr
                                            key={broker.id}
                                            className="border-b border-subtle-light dark:border-subtle-dark hover:bg-background-light dark:hover:bg-background-dark/50 transition-colors">
                                            <td className="px-4 py-4 font-medium">{broker.id}</td>
                                            <td className="px-4 py-4 text-gray-900 dark:text-white">
                                                {broker.name ?? "—"}
                                            </td>
                                            <td className="px-4 py-4 text-gray-700 dark:text-gray-300">
                                                {broker.email}
                                            </td>
                                            <td className="px-4 py-4 text-gray-700 dark:text-gray-300">
                                                {broker.phone ?? "—"}
                                            </td>
                                            <td className="px-4 py-4">
                                                <a
                                                    href="#"
                                                    className="font-semibold text-primary hover:underline"
                                                >
                                                    View
                                                </a>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="text-center text-gray-500 py-4 italic"
                                        >
                                            No brokers found
                                        </td>
                                    </tr>
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