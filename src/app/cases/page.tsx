"use client"

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

interface SingleCase {
    type: string;
    property: string;
    parties: null;
}

export default function CasesPage() {

    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [singlecase, setSinglecase] = useState<SingleCase[] | null>(null);
    const [cases, setCases] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);


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
        const listCases = async () => {
            try {
                const response = await api("/cases", {method: "GET"});

                // ⚠️ Ensure correct response structure
                if (response.ok) {
                    const data = response.results?.data.cases;
                    setCases(Array.isArray(data) ? data : []);
                } else {
                    toast.error("Failed to load: " + (response?.results.message || "Unknown error"));
                }
            } catch (error) {
                console.error("Failed to connect:", error);
                toast.error("Network error while fetching cases");
            } finally {
                setLoading(false);
            }
        };

        listCases();
    }, []);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center text-gray-500">
                Loading cases...
            </div>
        );
    }

    return user?.role === "ORG_ADMIN" ? (
            <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
                {/* Header */}
                <Sidebar/>

                {/* Main */}
                <main className="flex-1 overflow-auto p-6 md:p-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                            <h2 className="text-3xl font-bold">Cases</h2>
                            <button onClick={() => router.push('/cases/new')}
                                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors">
                                <span className="material-symbols-outlined">add</span>
                                Create New Case
                            </button>
                        </div>

                        <div className="bg-white dark:bg-subtle-dark/50 rounded-lg p-6 shadow-sm">
                            {/* Filters */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                                <div className="relative">
                        <span
                            className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted-light dark:text-muted-dark">
                            search
                        </span>
                                    <input
                                        type="text"
                                        placeholder="Search by property"
                                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-subtle-light dark:border-subtle-dark bg-background-light dark:bg-background-dark focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-shadow"
                                    />
                                </div>
                                <div className="relative">
                        <span
                            className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted-light dark:text-muted-dark">
                            search
                        </span>
                                    <input
                                        type="text"
                                        placeholder="Search by party name"
                                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-subtle-light dark:border-subtle-dark bg-background-light dark:bg-background-dark focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-shadow"
                                    />
                                </div>
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
                                        type="date"
                                        className="w-full px-4 py-2 rounded-lg border border-subtle-light dark:border-subtle-dark bg-background-light dark:bg-background-dark focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-shadow"
                                    />
                                </div>
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                    <tr className="border-b border-subtle-light dark:border-subtle-dark">
                                        {[
                                            "Case ID",
                                            "Property",
                                            "Buyer/Seller",
                                            "Status",
                                            "Created At",
                                            "Actions",
                                        ].map((head) => (
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
                                    {cases.length === 0 ? (
                                        <tr className="border-b border-subtle-light dark:border-subtle-dark hover:bg-background-light dark:hover:bg-background-dark/50 transition-colors">
                                            <td className="px-4 py-4 font-medium" colSpan={6}>No Case Found</td>
                                        </tr>
                                    ) : (
                                        cases.map((singlecase) => (
                                            <tr
                                                key={singlecase.id}
                                                className="border-b border-subtle-light dark:border-subtle-dark hover:bg-background-light dark:hover:bg-background-dark/50 transition-colors"
                                            >
                                                <td className="px-4 py-4 font-medium">{singlecase.id}</td>
                                                <td className="px-4 py-4 text-muted-light dark:text-muted-dark">
                                                    {singlecase?.property?.community || "-"}
                                                </td>
                                                <td className="px-4 py-4 text-muted-light dark:text-muted-dark">
                                                    {singlecase.parties?.role || "-"}
                                                </td>
                                                <td className="px-4 py-4">
                                                    <span
                                                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary">
                                                      {singlecase.status || "In Progress"}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 text-muted-light dark:text-muted-dark">
                                                    {dayjs(singlecase.createdAt).format("MMM DD, YYYY hh:mm A") || "-"}
                                                </td>
                                                <td className="px-4 py-4">
                                                    <button
                                                        onClick={() => router.push(`/cases/${singlecase.id}`)}
                                                        className="font-semibold text-primary hover:underline mr-3"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => router.push(`/cases/${singlecase.id}`)}
                                                        className="font-semibold text-primary hover:underline"
                                                    >
                                                        View
                                                    </button>
                                                </td>
                                            </tr>
                                        )))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        ) :
        (
            <div className="flex min-h-screen">
                {/* Sidebar + Main wrapper */}
                <div className="flex flex-row w-full">
                    {/* Sidebar */}
                    <Sidebar/>

                    {/* Main Content */}
                    <main className="flex-1 p-6 md:p-8 overflow-auto">
                        {/* Main Content */}
                        <div className="flex-1 w-full py-8 px-6 lg:px-12 bg-white dark:bg-gray-900">
                            {/* Header */}
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                                <h2 className="text-3xl font-bold">Cases</h2>
                                {/*<button*/}
                                {/*    className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors">*/}
                                {/*    <span className="material-symbols-outlined">add</span>*/}
                                {/*    Create New Case*/}
                                {/*</button>*/}
                            </div>

                            {/* Search & Filters */}
                            <div className="bg-white dark:bg-subtle-dark/50 rounded-lg p-6 shadow-sm">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                                    <div className="relative">
                  <span
                      className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted-light dark:text-muted-dark">
                    search
                  </span>
                                        <input
                                            type="text"
                                            placeholder="Search by property"
                                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-subtle-light dark:border-subtle-dark bg-background-light dark:bg-background-dark focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-shadow"
                                        />
                                    </div>
                                    <div className="relative">
                  <span
                      className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted-light dark:text-muted-dark">
                    search
                  </span>
                                        <input
                                            type="text"
                                            placeholder="Search by party name"
                                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-subtle-light dark:border-subtle-dark bg-background-light dark:bg-background-dark focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-shadow"
                                        />
                                    </div>
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
                                            type="date"
                                            className="w-full px-4 py-2 rounded-lg border border-subtle-light dark:border-subtle-dark bg-background-light dark:bg-background-dark focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-shadow"
                                        />
                                    </div>
                                </div>

                                {/* Cases Table */}
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                        <tr className="border-b border-subtle-light dark:border-subtle-dark">
                                            {[
                                                "Case ID",
                                                "Property",
                                                "Buyer/Seller",
                                                "Status",
                                                "Created At",
                                                "Actions",
                                            ].map((head) => (
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
                                        {cases.length === 0 ? (
                                            <tr className="border-b border-subtle-light dark:border-subtle-dark hover:bg-background-light dark:hover:bg-background-dark/50 transition-colors">
                                                <td className="px-4 py-4 font-medium" colSpan={6}>No Case Found</td>
                                            </tr>
                                        ) : (
                                            cases.map((singlecase) => (
                                                <tr
                                                    key={singlecase.id}
                                                    className="border-b border-subtle-light dark:border-subtle-dark hover:bg-background-light dark:hover:bg-background-dark/50 transition-colors"
                                                >
                                                    <td className="px-4 py-4 font-medium">{singlecase.id}</td>
                                                    <td className="px-4 py-4 text-muted-light dark:text-muted-dark">
                                                        {singlecase?.property?.community || "-"}
                                                    </td>
                                                    <td className="px-4 py-4 text-muted-light dark:text-muted-dark">
                                                        {singlecase.parties?.role || "-"}
                                                    </td>
                                                    <td className="px-4 py-4">
                                                    <span
                                                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary">
                                                      {singlecase.status || "In Progress"}
                                                    </span>
                                                    </td>
                                                    <td className="px-4 py-4 text-muted-light dark:text-muted-dark">
                                                        {dayjs(singlecase.createdAt).format("MMM DD, YYYY hh:mm A") || "-"}
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <button className="font-semibold text-primary hover:underline">
                                                            View
                                                        </button>
                                                    </td>
                                                </tr>
                                            )))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        )
}
