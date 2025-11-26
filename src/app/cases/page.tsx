"use client"

import Sidebar from "@/components/Sidebar";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {api} from "@/lib/api";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import CaseMortgageForm from "@/components/CaseMortgageForm";
import PageLoader from "@/components/PageLoader";
import {TrustHeader} from "@/components/TrustHeader";

interface User {
    name: string;
    email: string;
    role?: string;
    managedOrgId?: string;
}

interface SingleCase {
    id: string;
    property: {
        community?: string;
        [key: string]: any; // in case there are more property fields
    } | null;
    parties?: {
        role?: string;
        [key: string]: any; // other party details
    } | null;
    status?: string;
    createdAt: string; // ISO date string
}


interface Mortgage {
    id: string | null;
    name: string | null;
    phone: string | null;
    email: string | null;
    user: {
        email: string;
        name: string;
        role?: string;
    };
}

export default function CasesPage() {
    const [showModal, setShowModal] = useState(false);
    const [caseId, setCaseId] = useState<string | null>(null);
    const [mortgageToEdit, setMortgageToEdit] = useState<Mortgage | null>(null);
    const [singleCase, setSingleCase] = useState<SingleCase | null>(null);
    const [mortgages, setMortgages] = useState<any>(null);
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
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

    const fetchExistingMortgage = async (singlecase: SingleCase) => {
        setLoading(true);
        try {
            const mortgageParties = singlecase.parties?.filter((p: any) => p.role === "MORTGAGE_BROKER") || [];
            console.log(mortgageParties);
            const formattedMortgages: Mortgage[] = mortgageParties.map((b: any) => ({
                id: b.id,
                name: b.members[0]?.user?.name || b.members[0]?.name || null,
                phone: b.members[0]?.phone || null,
                email: b.members[0]?.user?.email || null,
                user: {
                    email: b.members[0]?.user?.email || "",
                    name: b.members[0]?.user?.name || "",
                    role: b.members[0]?.user?.role,
                },
            }));

            setMortgages(formattedMortgages);
        } finally {
            setLoading(false);
        }
    };


    const handleEdit = (mortgage: Mortgage) => {
        setMortgageToEdit(mortgage);
    };

    const handleFormSuccess = (mortgage: Mortgage) => {
        setMortgageToEdit(null);
        setShowModal(false);
    };

    const handleInvite = async (singleCase: SingleCase) => {
        fetchExistingMortgage(singleCase);
        setCaseId(singleCase.id);
        setShowModal(true);
    }

    if (loading || !cases) {
        return (
            <div className="flex justify-center items-center h-screen text-xl">
                <PageLoader/>
            </div>
        );
    }

    if (user?.role === "ORG_ADMIN") {
        return (
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
                                        cases.map((singleCase: SingleCase) => (
                                            <tr
                                                key={singleCase.id}
                                                className="border-b border-subtle-light dark:border-subtle-dark hover:bg-background-light dark:hover:bg-background-dark/50 transition-colors"
                                            >
                                                <td className="px-4 py-4 font-medium">{singleCase.id}</td>
                                                <td className="px-4 py-4 text-muted-light dark:text-muted-dark">
                                                    {singleCase?.property?.community || "-"}
                                                </td>
                                                <td className="px-4 py-4 text-muted-light dark:text-muted-dark">
                                                    {singleCase.parties?.role || "-"}
                                                </td>
                                                <td className="px-4 py-4">
                                                    <span
                                                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary">
                                                      {singleCase.status || "In Progress"}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 text-muted-light dark:text-muted-dark">
                                                    {dayjs(singleCase.createdAt).format("MMM DD, YYYY hh:mm A") || "-"}
                                                </td>
                                                <td className="px-4 py-4">
                                                    <button
                                                        onClick={() => handleInvite(singleCase)}
                                                        className="font-semibold text-primary hover:underline mr-3">
                                                        Invite Broker
                                                    </button>

                                                    <button
                                                        onClick={() => router.push(`/cases/${singleCase.id}`)}
                                                        className="font-semibold text-primary hover:underline mr-3"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => router.push(`/cases/${singleCase.id}`)}
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
                    {showModal && (
                        <div
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                        >
                            {/* Modal content */}
                            <div
                                className="w-full max-w-2xl mx-auto bg-white dark:bg-background-dark/50 rounded-2xl shadow-2xl p-2 space-y-4 border border-zinc-200 dark:border-zinc-800 relative"
                            >
                                {/* Close button */}
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="absolute top-3 right-3 text-zinc-500 hover:text-zinc-800 dark:hover:text-white text-2xl font-bold"
                                >
                                    ×
                                </button>

                                <div className="space-y-4 text-center">
                                    <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mt-6">
                                        Invite Mortgage Broker
                                    </h1>
                                    <p className="text-zinc-500 dark:text-zinc-400 text-lg">
                                        Enter the details below to send an invitation.
                                    </p>
                                </div>

                                <CaseMortgageForm
                                    caseId={caseId}
                                    mortgageToEdit={mortgageToEdit}
                                    onSuccess={(mortgage: Mortgage) => handleFormSuccess(mortgage)}
                                />

                                {/* 🧩 Buyer Table */}
                                <div
                                    className="mt-6 overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                                    {loading ? (
                                        <p className="p-6 text-sm text-gray-500 dark:text-gray-400">
                                            Loading buyers...
                                        </p>
                                    ) : (
                                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                            <thead className="bg-gray-50 dark:bg-gray-800">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">#</th>
                                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Email</th>
                                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Name</th>
                                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Phone</th>
                                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Actions</th>
                                            </tr>
                                            </thead>
                                            <tbody
                                                className="bg-white dark:bg-slate-800 divide-y divide-gray-100 dark:divide-gray-700">
                                            {mortgages.length > 0 ? (
                                                mortgages.map((mortgage: Mortgage, index: number) => (
                                                    <tr key={mortgage.id}>
                                                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-200">{index + 1}</td>
                                                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-200">
                                                            {mortgage.user.email || "—"}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-200">
                                                            {mortgage.name || "—"}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-200">
                                                            {mortgage.phone || "—"}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-200">
                                                            <button
                                                                onClick={() => handleEdit(mortgage)}
                                                                className="text-blue-600 hover:underline"
                                                            >
                                                                Edit
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={5}
                                                        className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                                        No Mortgage found
                                                    </td>
                                                </tr>
                                            )}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        );
    } else if (user?.role === "MORTGAGE_BROKER" || user?.role === "BROKER") {
        return (
            <div className="relative flex h-auto min-h-screen w-full flex-col">
                <Sidebar/>

                {/* Main */}
                <main className="flex-1 overflow-auto p-6 md:p-8">
                    <div className="max-w-7xl mx-auto">
                        {user?.role === "BROKER" && (
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                                <h2 className="text-3xl font-bold">Cases</h2>
                                <button onClick={() => router.push('/cases/new')}
                                        className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors">
                                    <span className="material-symbols-outlined">add</span>
                                    Create New Case
                                </button>
                            </div>
                        )}
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
                                        cases.map((singleCase: any) => (
                                            <tr
                                                key={singleCase.id}
                                                className="border-b border-subtle-light dark:border-subtle-dark hover:bg-background-light dark:hover:bg-background-dark/50 transition-colors"
                                            >
                                                <td className="px-4 py-4 font-medium">{singleCase.id}</td>
                                                <td className="px-4 py-4 text-muted-light dark:text-muted-dark">
                                                    {singleCase?.property?.community || "-"}
                                                </td>
                                                <td className="px-4 py-4 text-muted-light dark:text-muted-dark">
                                                    {singleCase.parties?.role || "-"}
                                                </td>
                                                <td className="px-4 py-4">
                                                    <span
                                                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary">
                                                      {singleCase.status || "In Progress"}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 text-muted-light dark:text-muted-dark">
                                                    {dayjs(singleCase.createdAt).format("MMM DD, YYYY hh:mm A") || "-"}
                                                </td>
                                                <td className="px-4 py-4">
                                                    {user?.role === "BROKER" && (
                                                        <>
                                                            <button
                                                                onClick={() => handleInvite(singleCase.id)}
                                                                className="font-semibold text-primary hover:underline mr-3">
                                                                Invite Broker
                                                            </button>

                                                            <button
                                                                onClick={() => router.push(`/cases/${singleCase.id}`)}
                                                                className="font-semibold text-primary hover:underline mr-3"
                                                            >
                                                                Edit
                                                            </button>
                                                        </>
                                                    )}
                                                    <button
                                                        onClick={() => router.push(`/cases/${singleCase.id}`)}
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
                    {showModal && (
                        <div
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                        >
                            {/* Modal content */}
                            <div
                                className="w-full max-w-2xl mx-auto bg-white dark:bg-background-dark/50 rounded-2xl shadow-2xl p-12 space-y-10 border border-zinc-200 dark:border-zinc-800 relative"
                            >
                                {/* Close button */}
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="absolute top-3 right-3 text-zinc-500 hover:text-zinc-800 dark:hover:text-white text-2xl font-bold"
                                >
                                    ×
                                </button>

                                <div className="space-y-4 text-center">
                                    <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mt-6">
                                        Invite Broker
                                    </h1>
                                    <p className="text-zinc-500 dark:text-zinc-400 text-lg">
                                        Enter the details below to send an invitation.
                                    </p>
                                </div>

                                <CaseMortgageForm
                                    caseId={caseId}
                                    mortgageToEdit={mortgageToEdit}
                                    onSuccess={(mortgage: Mortgage) => handleFormSuccess(mortgage)}
                                />

                                {/* 🧩 Buyer Table */}
                                <div
                                    className="mt-6 overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                                    {loading ? (
                                        <p className="p-6 text-sm text-gray-500 dark:text-gray-400">
                                            Loading buyers...
                                        </p>
                                    ) : (
                                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                            <thead className="bg-gray-50 dark:bg-gray-800">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">#</th>
                                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Email</th>
                                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Name</th>
                                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Phone</th>
                                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Actions</th>
                                            </tr>
                                            </thead>
                                            <tbody
                                                className="bg-white dark:bg-slate-800 divide-y divide-gray-100 dark:divide-gray-700">
                                            {mortgages.length > 0 ? (
                                                mortgages.map((mortgage: Mortgage, index: number) => (
                                                    <tr key={mortgage.id}>
                                                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-200">{index + 1}</td>
                                                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-200">
                                                            {mortgage.user.email || "—"}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-200">
                                                            {mortgage.name || "—"}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-200">
                                                            {mortgage.phone || "—"}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-200">
                                                            <button
                                                                onClick={() => handleEdit(mortgage)}
                                                                className="text-blue-600 hover:underline"
                                                            >
                                                                Edit
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={5}
                                                        className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                                        No Mortgage found
                                                    </td>
                                                </tr>
                                            )}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        )
    } else if (user?.role === "TRUSTEE") {
        return (

            <div className="flex h-screen w-full">
                {/* Sidebar + Main wrapper */}
                <div className="flex flex-row w-full">
                    {/* Sidebar */}
                    <Sidebar/>

                    {/* Main Content */}
                    <main className="flex-1 flex flex-col">
                        {/* Main Content */}
                        <TrustHeader/>
                        <div className="flex-1 p-8">
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
    } else {
        return (
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
}
