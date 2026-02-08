"use client";

import Sidebar from "@/components/Sidebar";
import CaseTabs from "@/components/CaseTabs";
import CaseBuyerForm from "@/components/CaseBuyerForm";
import {useParams} from "next/navigation";
import {useEffect, useState} from "react";
import {api} from "@/lib/api";
import toast from "react-hot-toast";

interface Buyer {
    id: string;
    name: string | null;
    party_id: string | null;
    phone: string | null;
    email: string | null;
    user: {
        email: string;
        name: string;
        role?: string;
    };
}

export default function BuyerPage() {
    const params = useParams();
    const caseId = params?.id as string | undefined;
    const [orgId, setOrgId] = useState<number | null>(null);
    const [partyId, setPartyId] = useState<number | null>(null);

    console.log(caseId);

    const [buyers, setBuyers] = useState<Buyer[]>([]);
    const [buyerToEdit, setBuyerToEdit] = useState<Buyer | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // ✅ Load existing buyers when caseId changes
    useEffect(() => {
        if (!caseId) return;
        fetchExistingBuyer();
    }, [caseId]);

    const fetchExistingBuyer = async () => {
        setLoading(true);
        try {
            const response = await api(`/cases/${caseId}`, {method: "GET"});

            const data = response?.results?.data;

            setOrgId(data?.orgId);

            const buyerParties = Array.isArray(data?.parties)
                ? data.parties.filter((p: any) => p.role === "BUYER")
                : [];

            // ✅ assign first seller party id
            if (buyerParties.length > 0) {
                setPartyId(buyerParties[0].id);
            }

            /**
             * Flatten all members from all BUYER parties
             */
            const formattedBuyers: Buyer[] = buyerParties.flatMap((party: any) =>
                (party.members || []).map((member: any) => ({
                    id: member.id,
                    party_id: party.id,
                    name: member.user?.name ?? party.name ?? null,
                    phone: member.phone ?? null,
                    email: member.user?.email ?? null,
                    user: {
                        email: member.user?.email ?? "",
                        name: member.user?.name ?? "",
                        role: member.user?.role ?? null,
                    },
                }))
            );

            console.log(formattedBuyers);

            setBuyers(formattedBuyers);
        } catch (err: any) {
            console.error("❌ Error fetching buyer data:", err);
            setError("Failed to load buyer data.");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (buyer: Buyer) => {
        setBuyerToEdit(buyer);
    };

    const handleReInvite = async (buyer: Buyer) => {
        setLoading(true);
        try {
            const response = await api(`/cases/${caseId}/parties/${partyId}/invite`, {method: "GET"});
            if (response.ok) {
                toast.success("Success: " + response.results?.data?.message)
            } else {
                toast.error("Error: " + response.results?.data?.message)
            }
        } catch (error) {
            toast.error("Error: " + error)
        } finally {
            setLoading(false);
        }
    };

    const handleFormSuccess = () => {
        // after create or update, reload buyer list
        fetchExistingBuyer();
        setBuyerToEdit(null);
    };

    if (!caseId) {
        return <div>Invalid Case ID</div>; // or loader
    }

    return (
        <div className="flex min-h-screen">
            <div className="flex flex-col w-full">
                <Sidebar/>
                <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="px-4 md:px-10 lg:px-40 flex justify-center py-5">
                        <div className="flex flex-col max-w-[960px] flex-1">
                            <div className="flex flex-wrap justify-between gap-3 p-4">
                                <div className="flex flex-col gap-3 min-w-72">
                                    <p className="text-4xl font-black text-[#0d171b] dark:text-white leading-tight tracking-tight">
                                        Create New Case
                                    </p>
                                    <p className="text-base text-[#4c809a] dark:text-gray-400">
                                        Please fill in the general details for the new case.
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-subtle-dark/50 rounded-lg p-6 shadow-sm">
                                <CaseTabs/>

                                {/* ✅ Pass buyerToEdit and callback to form */}
                                <CaseBuyerForm
                                    caseId={caseId}
                                    orgId={orgId}
                                    buyerToEdit={buyerToEdit}
                                    onSuccess={handleFormSuccess}
                                />

                                {/* 🧩 Buyer Table */}
                                <div
                                    className="mt-6 overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                                    {loading ? (
                                        <p className="p-6 text-sm text-gray-500 dark:text-gray-400">
                                            Loading buyers...
                                        </p>
                                    ) : error ? (
                                        <p className="p-6 text-sm text-red-500 dark:text-red-400">
                                            {error}
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
                                            {buyers.length > 0 ? (
                                                buyers.map((buyer: any, index) => (
                                                    <tr key={buyer.id}>
                                                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-200">{index + 1}</td>
                                                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-200">
                                                            {buyer.user.email || "—"}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-200">
                                                            {buyer.name || "—"}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-200">
                                                            {buyer.phone || "—"}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-200">
                                                            <button
                                                                onClick={() => handleEdit(buyer)}
                                                                className="text-blue-600 hover:underline"
                                                            >
                                                                <span
                                                                    className="material-symbols-outlined">edit</span>
                                                            </button>
                                                            <button
                                                                onClick={() => handleReInvite(buyer)}
                                                                className="text-blue-600 hover:underline"
                                                            >
                                                                <span
                                                                    className="material-symbols-outlined">forward_to_inbox</span>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={5}
                                                        className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                                        No buyers found
                                                    </td>
                                                </tr>
                                            )}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}