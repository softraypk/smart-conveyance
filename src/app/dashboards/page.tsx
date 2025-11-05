"use client";

import Sidebar from "@/components/Sidebar";
import { useEffect, useState } from "react";

interface User {
    name: string;
    email: string;
    role?: string;
}

export default function DashboardsPage() {
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

    if (!user) {
        return (
            <div className="flex items-center justify-center h-screen text-gray-500">
                Loading user...
            </div>
        );
    }

    return user.role === "ORG_ADMIN" ? (
        // ✅ ORG_ADMIN layout
        <div className="flex flex-col min-h-screen">
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-6 lg:p-8">
                <div className="mx-auto max-w-7xl">
                    {/* Header */}
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                            Dashboard
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">
                            Overview of all cases under your branch/organization
                        </p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {[
                            { label: "Active Cases", value: 120 },
                            { label: "Cases Ready for Trustee Booking", value: 35 },
                            {
                                label: "Overdue Invoices",
                                value: 12,
                                color: "text-red-500 dark:text-red-400",
                            },
                            {
                                label: "Expiring FOLs",
                                value: 5,
                                color: "text-orange-500 dark:text-orange-400",
                            },
                        ].map((item, i) => (
                            <div
                                key={i}
                                className="rounded-lg bg-white dark:bg-slate-800/50 p-6 shadow-sm border border-slate-200 dark:border-slate-800"
                            >
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                    {item.label}
                                </p>
                                <p
                                    className={`mt-2 text-3xl font-bold text-slate-900 dark:text-white ${
                                        item.color || ""
                                    }`}
                                >
                                    {item.value}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Exceptions Table */}
                    <div className="mt-10">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                Exceptions
                            </h3>
                            <button className="flex items-center gap-2 rounded bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90">
                                <span className="material-symbols-outlined text-base">add</span>
                                Create Exception
                            </button>
                        </div>

                        <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/50">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-slate-50 dark:bg-slate-800">
                                    <tr>
                                        {[
                                            "Case ID",
                                            "Case Type",
                                            "Exception Type",
                                            "Exception Details",
                                            "Actions",
                                        ].map((header) => (
                                            <th
                                                key={header}
                                                className="px-6 py-3 text-left font-semibold text-slate-600 dark:text-slate-300"
                                            >
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                    {[
                                        {
                                            id: "#2024-001",
                                            type: "Sale",
                                            exType: "Document Missing",
                                            detail: "Missing Title Deed",
                                        },
                                        {
                                            id: "#2024-002",
                                            type: "Purchase",
                                            exType: "Payment Overdue",
                                            detail: "Buyer Payment Due",
                                        },
                                        {
                                            id: "#2024-003",
                                            type: "Mortgage",
                                            exType: "Approval Pending",
                                            detail: "Bank Approval Required",
                                        },
                                        {
                                            id: "#2024-004",
                                            type: "Sale",
                                            exType: "Document Missing",
                                            detail: "Missing Emirates ID",
                                        },
                                        {
                                            id: "#2024-005",
                                            type: "Purchase",
                                            exType: "Payment Overdue",
                                            detail: "Buyer Payment Due",
                                        },
                                    ].map((row) => (
                                        <tr key={row.id}>
                                            <td className="whitespace-nowrap px-6 py-4 font-medium text-slate-900 dark:text-white">
                                                {row.id}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-slate-500 dark:text-slate-400">
                                                {row.type}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-slate-500 dark:text-slate-400">
                                                {row.exType}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-slate-500 dark:text-slate-400">
                                                {row.detail}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    {["done", "person_add", "gavel"].map((icon) => (
                                                        <button
                                                            key={icon}
                                                            className="rounded-full p-2 text-slate-500 hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20"
                                                        >
                                <span className="material-symbols-outlined text-xl">
                                  {icon}
                                </span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    ) : (
        // ✅ Default layout (non-ORG_ADMIN)
        <div className="flex h-screen">
            <Sidebar />
            <main className="flex-1 w-full py-8 px-6 lg:px-12 bg-white dark:bg-gray-900">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <h1 className="text-3xl font-bold text-black/90 dark:text-white/90">
                            Admin Dashboard
                        </h1>
                        <div className="w-full sm:w-72">
                            <select className="form-select w-full rounded-lg border border-black/10 dark:border-white/10 bg-background-light dark:bg-background-dark text-black/70 dark:text-white/70 focus:ring-primary focus:border-primary py-3 px-4">
                                <option value="">Select Organization</option>
                                <option value="org1">Organization One</option>
                                <option value="org2">Organization Two</option>
                                <option value="org3">Organization Three</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-white/50 dark:bg-black/20 rounded-lg p-6 flex flex-col gap-2 border border-black/5 dark:border-white/5">
                            <p className="text-base font-medium text-black/60 dark:text-white/60">
                                Total Active Cases
                            </p>
                            <p className="text-3xl font-bold text-black/90 dark:text-white/90">
                                1,234
                            </p>
                        </div>

                        <div className="bg-white/50 dark:bg-black/20 rounded-lg p-6 flex flex-col gap-2 border border-black/5 dark:border-white/5">
                            <p className="text-base font-medium text-black/60 dark:text-white/60">
                                Exception Count
                            </p>
                            <p className="text-3xl font-bold text-black/90 dark:text-white/90">
                                56
                            </p>
                        </div>

                        <div className="bg-white/50 dark:bg-black/20 rounded-lg p-6 flex flex-col gap-2 border border-black/5 dark:border-white/5">
                            <p className="text-base font-medium text-black/60 dark:text-white/60">
                                SLA Violations
                            </p>
                            <p className="text-3xl font-bold text-red-500">12</p>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <span className="material-symbols-outlined text-black/50 dark:text-white/50">
                search
              </span>
                        </div>
                        <input
                            type="search"
                            placeholder="Search cases across all organizations..."
                            className="form-input w-full rounded-lg border border-black/10 dark:border-white/10 bg-background-light dark:bg-background-dark text-black/70 dark:text-white/70 focus:ring-primary focus:border-primary py-3 pl-12 pr-4"
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}