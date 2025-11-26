"use client";

import Sidebar from "@/components/Sidebar";
import {useRouter} from "next/navigation";
import {FormEvent, useEffect, useState} from "react";
import {api} from "@/lib/api";
import toast from "react-hot-toast";
import PageLoader from "@/components/PageLoader";

interface User {
    name: string;
    email: string;
    role?: string;
}

interface Bank {
    id: string;
    name: string;
}

interface Valuation {
    id: string;
    requestedBy: string;
    status: string;
    bankId: string;
    bank: {
        id: string;
        name: string;
    }
}

export default function MortgagesPage() {
    const router = useRouter();
    const [mortgages, setMortgages] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [isEditable, setIsEditable] = useState(false);
    const [valuation, setValuation] = useState<Valuation[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [bankId, setBankId] = useState("");
    const [banks, setBanks] = useState<Bank[]>([]);
    const [requestedBy, setRequestedBy] = useState("");
    const [status, setStatus] = useState("PENDING");
    const [caseId, setCaseId] = useState("");
    const [showModal, setShowModal] = useState(false);

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

    const fetchValuation = async (caseId: string) => {
        setLoading(true);
        try {
            const response = await api(`/cases/${caseId}/mortgage/valuation`, {
                method: "GET",
            })

            if (response.ok) {
                setIsEditable(true)
                setBankId(response?.results?.data?.bankId)
                setRequestedBy(response?.results?.data?.requestedBy);
                setStatus(response?.results?.data?.status)
            } else {
                setIsEditable(false)
                //toast.error("Error: " + response?.results?.message);
            }
        } catch (e) {
            toast.error("Error:" + e)
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!caseId) return;
        fetchValuation(caseId);
    }, [caseId])

    const handleModelOpener = async (id: string) => {
        setLoading(true);
        if (!id) return;
        setCaseId(id)
        try {
            const response = await api('/admins/banks', {
                method: "GET",
            });
            if (response.ok) {
                setBanks(response.results)
            }
        } catch (e) {
            toast.error("Error:" + e)
        }
        setShowModal(true)
        setLoading(false);
    }


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

    const handlerSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const payload = {
            bankId,
            requestedBy,
            status
        }
        try {
            const response = await api(`/cases/${caseId}/mortgage/valuation`, {
                method: isEditable ? "PATCH" : "POST",
                body: JSON.stringify(payload)
            })

            if (response.ok) {
                toast.success("Successfully updated mortgage");
            } else {
                toast.error("Error: " + response.results?.message);
            }

        } catch (e) {
            toast.error("Error:" + e);
        }

        setLoading(false);
    }

    if (loading || !mortgages) {
        return (
            <div className="flex justify-center items-center h-screen text-xl">
                <PageLoader/>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Sidebar/>
            <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
                {loading && <PageLoader/>}
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
                                            <button
                                                onClick={() => {
                                                    handleModelOpener(m.id)
                                                }}
                                                className="text-primary hover:underline">Valuation
                                            </button>
                                            <span className="text-black/30 dark:text-white/30 m-3">|</span>
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
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                        <div
                            className="bg-white dark:bg-background-dark/70 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 w-full max-w-2xl mx-4 animate-fadeIn">
                            {loading && <PageLoader/>}
                            <div className="p-6">
                                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                                    Proceed to Valuation
                                </h2>

                                <form className="p-4 space-y-6" onSubmit={handlerSubmit}>
                                    {/* Bank Select */}
                                    <label className="flex flex-col">
                                        <p className="form-label dark:text-gray-300">Bank*</p>
                                        <select
                                            value={bankId}
                                            onChange={(e) => setBankId(e.target.value)}
                                            className="form-input dark:bg-background-dark dark:border-gray-600 dark:text-white">
                                            {banks.map((b: Bank) => (
                                                <option key={b.id} value={b.id}>{b.name}</option>
                                            ))}
                                        </select>
                                    </label>

                                    {/* Date Field */}
                                    <label className="flex flex-col">
                                        <p className="form-label dark:text-gray-300">Date*</p>
                                        <input
                                            value={requestedBy ? requestedBy.split("T")[0] : ""}
                                            onChange={(e) => {
                                                setRequestedBy(new Date(e.target.value).toISOString())
                                            }}
                                            className="form-input dark:bg-background-dark dark:border-gray-600 dark:text-white"
                                            type="date"
                                        />
                                    </label>

                                    {/* Status Select */}
                                    <label className="flex flex-col">
                                        <p className="form-label dark:text-gray-300">Status*</p>
                                        <select
                                            value={status}
                                            onChange={(e) => {
                                                setStatus(e.target.value)
                                            }}
                                            className="form-input dark:bg-background-dark dark:border-gray-600 dark:text-white">
                                            <option value="PENDING">PENDING</option>
                                            <option value="COMPLETED">COMPLETED</option>
                                        </select>
                                    </label>

                                    {/* Buttons */}
                                    <div className="flex justify-between items-center pt-6">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowModal(false)
                                            }}
                                            className="px-6 py-3 rounded-lg text-[#4c809a] dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 font-bold text-sm"
                                        >
                                            Back
                                        </button>

                                        <button
                                            type="submit"
                                            className="px-6 py-3 rounded-lg text-white bg-primary hover:bg-primary/90 font-bold text-sm"
                                        >
                                            Proceed to Valuation
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}