"use client"

import Sidebar from "@/components/Sidebar";
import {useRouter} from "next/navigation";
import {FormEvent, useEffect, useState} from "react";
import {api} from "@/lib/api";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import CaseMortgageForm from "@/components/CaseMortgageForm";
import PageLoader from "@/components/PageLoader";
import {TrustHeader} from "@/components/TrustHeader";
import ExceptionModal from "@/components/ExceptionModel";
import CaseUpdateStatusModel from "@/components/CaseUpdateStatusModel";
import Pagination from "@/components/Pagination";
import ProfileBuyerSellerModel from "@/components/ProfileBuyerSellerModel";

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
    const [partyId, setPartyId] = useState<number | null>(null);
    const [mortgageToEdit, setMortgageToEdit] = useState<Mortgage | null>(null);
    const [mortgages, setMortgages] = useState<any>(null);
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [cases, setCases] = useState<any[]>([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, sePageSize] = useState(10);
    const [totalRecords, setTotalRecords] = useState(1);
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [file, setFile] = useState<any>(null);
    const [openException, setOpenException] = useState<boolean>(false);
    const [openUpdateStatus, setOpenUpdateStatus] = useState<boolean>(false);
    const [openUserProfile, setOpenUserProfile] = useState<boolean>(false);
    const [userId, setUserId] = useState<string | null>(null);

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

    const listCases = async ({
                                 pageNumber = 1,
                                 pageSize = 10,
                                 statusFilter = ""
                             }) => {
        setLoading(true);

        try {
            let query = `pageNumber=${pageNumber}&pageSize=${pageSize}`;

            if (statusFilter) {
                query += `&statusFilter=${encodeURIComponent(statusFilter)}`;
            }

            const response = await api(`/cases?${query}`, {
                method: "GET",
            });

            if (response?.ok) {
                setCases(response?.results?.data?.cases || []);
                setTotalRecords(response?.results?.data?.meta?.total || 1);
            } else {
                toast.error(response?.results?.message || "Failed to load cases");
            }
        } catch (error) {
            console.error(error);
            toast.error("Network error");
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        listCases({pageNumber, pageSize, statusFilter});
    }, [pageNumber, pageSize, statusFilter]);


    const fetchExistingMortgage = async (singlecase: SingleCase) => {
        setLoading(true);
        try {
            const mortgageParties =
                singlecase.parties?.filter((p: any) => p.role === "MORTGAGE_BROKER") || [];

            // ✅ assign first seller party id
            if (mortgageParties.length > 0) {
                setPartyId(mortgageParties[0].id);
            }

            const formattedMortgages: Mortgage[] = mortgageParties.flatMap((party: any) =>
                (party.members || []).map((member: any) => ({
                    id: member.id, // ✅ UNIQUE
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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFile(file);
        }
    };

    const handleOpenModel = (caseId: string) => {
        setOpen(true);
        setCaseId(caseId);
    }

    const uploadDocument = async (e: FormEvent) => {
        e.preventDefault();

        if (!file) {
            alert("Please select a file first");
            return;
        }

        const formData = new FormData();
        formData.append("document", file);

        try {
            const res = await api(`/cases/${caseId}/documents/DEED`, {
                method: "PUT",
                body: formData,
            });

            if (!res.ok) {
                toast.error("Error while uploading case");
            }

            toast.success("Success: " + res.results.message)
            setOpen(false)

        } catch (err) {
            console.error(err);
            toast.error("Error: " + err);
        }
    };

    const handleUserProfile = (userid: string) => {
        setOpenUserProfile(true)
        setUserId(userid);
    }

    const handleException = (caseId: string) => {
        setOpenException(true);
        setCaseId(caseId);
    }

    const handleUpdateStatus = (caseId: string) => {
        setOpenUpdateStatus(true);
        setCaseId(caseId);
    }

    const handleReInvite = async (mortgage: Mortgage) => {
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
                                        value={statusFilter}
                                        onChange={(e) => {
                                            setStatusFilter(e.target.value);
                                            setPageNumber(1); // reset pagination
                                        }}
                                        className="w-full px-4 py-2 rounded-lg border"
                                    >
                                        <option value="NA">All STATUS</option>
                                        <option value="DRAFT">DRAFT</option>
                                        <option value="OFFERING">OFFERING</option>
                                        <option value="AGREED">AGREED</option>
                                        <option value="COMPLIANCE_READY">COMPLIANCE READY</option>
                                        <option value="TRUSTEE_BOOKED">TRUSTEE BOOKED</option>
                                        <option value="FINALIZED">FINALIZED</option>
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
                                <Pagination
                                    pageNumber={pageNumber}
                                    pageSize={pageSize}
                                    totalRecords={totalRecords}
                                    totalPages={Math.ceil(totalRecords / pageSize)}
                                    onPageChange={(page) => setPageNumber(page)}
                                />
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
                                            <td className="px-4 py-4 font-medium" colSpan={6}>
                                                No Case Found
                                            </td>
                                        </tr>
                                    ) : (
                                        cases.map((singleCase: SingleCase) => {
                                            const buyerParty = singleCase.parties?.find((p: any) => p.role === "BUYER");
                                            const buyer = buyerParty?.members?.[0] || null;

                                            const sellerParty = singleCase.parties?.find((p: any) => p.role === "SELLER");
                                            const seller = sellerParty?.members?.[0] || null;

                                            return (
                                                <tr
                                                    key={singleCase.id}
                                                    className="border-b border-subtle-light dark:border-subtle-dark hover:bg-background-light dark:hover:bg-background-dark/50 transition-colors"
                                                >
                                                    <td className="px-4 py-4 font-medium">{singleCase.id.split("-")[0]}</td>
                                                    <td className="px-4 py-4 text-muted-light dark:text-muted-dark">
                                                        {singleCase?.property?.community || "-"}
                                                    </td>

                                                    <td className="px-4 py-4 text-muted-light dark:text-muted-dark">
                                                        {buyer?.consent === "ACCEPTED" ? (
                                                            <button
                                                                type="button"
                                                                onClick={() => handleUserProfile(buyer.user?.id)}
                                                            >
                                                                {buyer?.name || "-"}
                                                            </button>
                                                        ) : (
                                                            "Non-consent"
                                                        )}
                                                        /
                                                        {seller?.consent === "ACCEPTED" ? (
                                                            <button
                                                                type="button"
                                                                onClick={() => handleUserProfile(seller.user?.id)}
                                                            >
                                                                {seller?.name || "-"}
                                                            </button>
                                                        ) : (
                                                            "Non-consent"
                                                        )}
                                                    </td>

                                                    <td className="px-4 py-4">
                                                        <span
                                                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary">
                                                            {singleCase.status || "In Progress"}
                                                        </span>
                                                    </td>

                                                    <td className="px-4 py-4 text-muted-light dark:text-muted-dark">
                                                        {dayjs(singleCase.createdAt).format("MMM DD, YYYY hh:mm A")}
                                                    </td>

                                                    <td className="px-4 py-4">

                                                        <button onClick={() => handleOpenModel(singleCase.id)}
                                                                className="font-semibold text-primary hover:underline mr-3">
                                                            <span
                                                                className="material-symbols-outlined">cloud_upload</span>
                                                        </button>


                                                        <button onClick={() => handleUpdateStatus(singleCase.id)}
                                                                className="font-semibold text-primary hover:underline mr-3">
                                                            <span
                                                                className="material-symbols-outlined">published_with_changes</span>
                                                        </button>

                                                        <button onClick={() => handleException(singleCase.id)}
                                                                className="font-semibold text-primary hover:underline mr-3">
                                                            <span className="material-symbols-outlined">warning</span>
                                                        </button>

                                                        <button onClick={() => handleInvite(singleCase)}
                                                                className="font-semibold text-primary hover:underline mr-3">
                                                            <span
                                                                className="material-symbols-outlined">person_add</span>
                                                        </button>

                                                        <button onClick={() => router.push(`/cases/${singleCase.id}`)}
                                                                className="font-semibold text-primary hover:underline mr-3">
                                                            <span className="material-symbols-outlined">edit</span>
                                                        </button>

                                                        <button
                                                            onClick={() => router.push(`/cases/${singleCase.id}/show`)}
                                                            className="font-semibold text-primary hover:underline">
                                                            <span
                                                                className="material-symbols-outlined">visibility</span>
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                    </tbody>
                                </table>
                                <Pagination
                                    pageNumber={pageNumber}
                                    pageSize={pageSize}
                                    totalRecords={totalRecords}
                                    totalPages={Math.ceil(totalRecords / pageSize)}
                                    onPageChange={(page) => setPageNumber(page)}
                                />
                            </div>
                        </div>
                    </div>
                    {/* Modal */}
                    <ExceptionModal caseId={caseId} open={openException} onClose={() => setOpenException(false)}/>
                    <CaseUpdateStatusModel caseId={caseId} open={openUpdateStatus}
                                           onClose={() => setOpenUpdateStatus(false)}/>
                    <ProfileBuyerSellerModel userId={userId} open={openUserProfile}
                                             onClose={() => setOpenUserProfile(false)}/>

                    {/* MODAL BACKDROP */}
                    {open && (
                        <div
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

                            {/* MODAL CARD */}
                            <form onSubmit={uploadDocument}
                                  className="bg-white dark:bg-background-dark p-8 rounded-xl shadow-xl w-full max-w-lg space-y-8 relative">

                                {/* CLOSE BUTTON */}
                                <button
                                    onClick={() => setOpen(false)}
                                    className="absolute top-3 right-3 text-gray-600 dark:text-gray-300 hover:text-primary"
                                >
                                    <span className="material-symbols-outlined">close</span>
                                </button>

                                {/* ---------------- YOUR CONTENT BELOW ---------------- */}

                                <div>
                                    <h2 className="text-3xl font-extrabold text-center text-gray-900 dark:text-white">
                                        Final Deed &amp; Supporting Pack
                                    </h2>
                                    <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                                        Upload the final documents to complete the case.
                                    </p>
                                </div>

                                <div
                                    className="bg-white dark:bg-background-dark/50 p-8 rounded-lg shadow-md space-y-6">

                                    {/* FILE UPLOAD -------------------------- */}
                                    <div>
                                        <label
                                            htmlFor="file-upload"
                                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                        >
                                            Final Deed Pack (PDF/ZIP)
                                        </label>

                                        <label
                                            htmlFor="file-upload"
                                            className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300
                                    dark:border-gray-600 border-dashed rounded-md cursor-pointer
                                    hover:border-primary/70 dark:hover:border-primary/50 transition-colors"
                                        >
                                            <div className="space-y-1 text-center">
                                        <span
                                            className="material-symbols-outlined text-4xl text-gray-400 dark:text-gray-500">
                                            cloud_upload
                                        </span>
                                                <div
                                                    className="flex text-sm text-gray-600 dark:text-gray-400">
                                                    <p className="pl-1">
                                                        Drag and drop or{" "}
                                                        <span
                                                            className="text-primary font-semibold">click to upload</span>
                                                    </p>
                                                </div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    PDF, ZIP up to 50MB
                                                </p>
                                                {/* Show attached file */}
                                                {file && (
                                                    <div
                                                        className="text-sm text-green-600 flex items-center gap-2">
                                                                        <span
                                                                            className="material-symbols-outlined text-base">attach_file</span>
                                                        {file?.name}
                                                    </div>
                                                )}
                                            </div>
                                        </label>

                                        <input
                                            onChange={handleFileChange}
                                            id="file-upload" name="file-upload" type="file"
                                            className="sr-only"/>
                                    </div>

                                    {/* DEED ID -------------------------- */}
                                    <div className="mt-1 relative">
                                        <span
                                            className="absolute inset-y-0 left-0 flex items-center pl-3">
                                            <span
                                                className="material-symbols-outlined text-gray-500 dark:text-gray-400 text-[20px]">
                                                confirmation_number
                                            </span>
                                        </span>

                                        <input
                                            id="deed-id"
                                            name="deed-id"
                                            type="text"
                                            placeholder="Enter Deed ID"
                                            className="block w-full pl-10 pr-3 py-3 rounded-md bg-background-light dark:bg-background-dark border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-primary focus:border-primary sm:text-sm"
                                        />
                                    </div>


                                    {/* DATE ISSUED -------------------------- */}
                                    <div className="mt-1 relative">
                                        <span
                                            className="absolute inset-y-0 left-0 flex items-center pl-3">
                                            <span
                                                className="material-symbols-outlined text-gray-500 dark:text-gray-400 text-[20px]">
                                                event
                                            </span>
                                        </span>
                                        <input
                                            id="date-issued"
                                            name="date-issued"
                                            type="date"
                                            className="block w-full pl-10 pr-3 py-3 rounded-md bg-background-light dark:bg-background-dark border border-gray-300 dark:border-gray-700 focus:ring-primary focus:border-primary sm:text-sm"
                                        />
                                    </div>


                                    {/* SAVE BUTTON -------------------------- */}
                                    <button
                                        type="submit"
                                        className="w-full flex justify-center py-3 px-4 rounded-md shadow-sm
                                text-sm font-medium text-white bg-primary hover:bg-primary/90
                                focus:outline-none focus:ring-2 focus:ring-offset-2
                                focus:ring-primary transition-colors"
                                    >
                                        Save
                                    </button>

                                </div>
                            </form>
                        </div>
                    )}
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
                                                               <span
                                                                   className="material-symbols-outlined">edit</span>
                                                            </button>
                                                            <button
                                                                onClick={() => handleReInvite(mortgage)}
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
            <div className="flex flex-col min-h-screen">
                <TrustHeader/>
                {/* Sidebar + Main wrapper */}
                <div className="flex flex-row w-full">
                    {/* Main Content */}
                    <main className="flex-1 flex flex-col">
                        {/* Main Content */}
                        <div className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                                                        <button
                                                            onClick={() => handleOpenModel(singlecase.id)}
                                                            className="px-4 py-2 bg-primary text-white rounded-lg flex items-center gap-2"
                                                        >
                                                            <span
                                                                className="material-symbols-outlined">file_upload</span>
                                                            Upload Final Deed
                                                        </button>
                                                    </td>
                                                </tr>
                                            )))}
                                        </tbody>
                                    </table>

                                    {/* MODAL BACKDROP */}
                                    {open && (
                                        <div
                                            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

                                            {/* MODAL CARD */}
                                            <form onSubmit={uploadDocument}
                                                  className="bg-white dark:bg-background-dark p-8 rounded-xl shadow-xl w-full max-w-lg space-y-8 relative">

                                                {/* CLOSE BUTTON */}
                                                <button
                                                    onClick={() => setOpen(false)}
                                                    className="absolute top-3 right-3 text-gray-600 dark:text-gray-300 hover:text-primary"
                                                >
                                                    <span className="material-symbols-outlined">close</span>
                                                </button>

                                                {/* ---------------- YOUR CONTENT BELOW ---------------- */}

                                                <div>
                                                    <h2 className="text-3xl font-extrabold text-center text-gray-900 dark:text-white">
                                                        Final Deed &amp; Supporting Pack
                                                    </h2>
                                                    <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                                                        Upload the final documents to complete the case.
                                                    </p>
                                                </div>

                                                <div
                                                    className="bg-white dark:bg-background-dark/50 p-8 rounded-lg shadow-md space-y-6">

                                                    {/* FILE UPLOAD -------------------------- */}
                                                    <div>
                                                        <label
                                                            htmlFor="file-upload"
                                                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                                        >
                                                            Final Deed Pack (PDF/ZIP)
                                                        </label>

                                                        <label
                                                            htmlFor="file-upload"
                                                            className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300
                                    dark:border-gray-600 border-dashed rounded-md cursor-pointer
                                    hover:border-primary/70 dark:hover:border-primary/50 transition-colors"
                                                        >
                                                            <div className="space-y-1 text-center">
                                        <span
                                            className="material-symbols-outlined text-4xl text-gray-400 dark:text-gray-500">
                                            cloud_upload
                                        </span>
                                                                <div
                                                                    className="flex text-sm text-gray-600 dark:text-gray-400">
                                                                    <p className="pl-1">
                                                                        Drag and drop or{" "}
                                                                        <span className="text-primary font-semibold">click to upload</span>
                                                                    </p>
                                                                </div>
                                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                    PDF, ZIP up to 50MB
                                                                </p>
                                                                {/* Show attached file */}
                                                                {file && (
                                                                    <div
                                                                        className="text-sm text-green-600 flex items-center gap-2">
                                                                        <span
                                                                            className="material-symbols-outlined text-base">attach_file</span>
                                                                        {file?.name}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </label>

                                                        <input
                                                            onChange={handleFileChange}
                                                            id="file-upload" name="file-upload" type="file"
                                                            className="sr-only"/>
                                                    </div>

                                                    {/* DEED ID -------------------------- */}
                                                    <div>
                                                        <label
                                                            htmlFor="deed-id"
                                                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                                        >
                                                            Deed ID
                                                        </label>

                                                        <div className="mt-1 relative">
                                    <span
                                        className="material-symbols-outlined absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 dark:text-gray-500">
                                        badge
                                    </span>

                                                            <input
                                                                id="deed-id"
                                                                name="deed-id"
                                                                type="text"
                                                                placeholder="Enter Deed ID"
                                                                className="form-input block w-full pl-10 pr-3 py-3
                                        bg-background-light dark:bg-background-dark
                                        border border-gray-300 dark:border-gray-700 rounded-md
                                        placeholder-gray-500 dark:placeholder-gray-400
                                        focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* DATE ISSUED -------------------------- */}
                                                    <div>
                                                        <label
                                                            htmlFor="date-issued"
                                                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                                        >
                                                            Date Issued
                                                        </label>

                                                        <div className="mt-1 relative">
                                    <span
                                        className="material-symbols-outlined absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 dark:text-gray-500">
                                        calendar_today
                                    </span>

                                                            <input
                                                                id="date-issued"
                                                                name="date-issued"
                                                                type="date"
                                                                placeholder="Select Date"
                                                                className="form-input block w-full pl-10 pr-3 py-3
                                        bg-background-light dark:bg-background-dark
                                        border border-gray-300 dark:border-gray-700 rounded-md
                                        placeholder-gray-500 dark:placeholder-gray-400
                                        focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* SAVE BUTTON -------------------------- */}
                                                    <button
                                                        type="submit"
                                                        className="w-full flex justify-center py-3 px-4 rounded-md shadow-sm
                                text-sm font-medium text-white bg-primary hover:bg-primary/90
                                focus:outline-none focus:ring-2 focus:ring-offset-2
                                focus:ring-primary transition-colors"
                                                    >
                                                        Save
                                                    </button>

                                                </div>
                                            </form>
                                        </div>
                                    )}
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
                                                        <button onClick={() => handleOpenModel(singlecase.id)}
                                                                className="font-semibold text-primary hover:underline mr-3">
                                                            <span
                                                                className="material-symbols-outlined">cloud_upload</span>
                                                        </button>


                                                        {/*<button onClick={() => handleUpdateStatus(singlecase.id)}*/}
                                                        {/*        className="font-semibold text-primary hover:underline mr-3">*/}
                                                        {/*    <span*/}
                                                        {/*        className="material-symbols-outlined">published_with_changes</span>*/}
                                                        {/*</button>*/}

                                                        <button onClick={() => handleException(singlecase.id)}
                                                                className="font-semibold text-primary hover:underline mr-3">
                                                            <span className="material-symbols-outlined">warning</span>
                                                        </button>

                                                        {/*<button onClick={() => handleInvite(singlecase)}*/}
                                                        {/*        className="font-semibold text-primary hover:underline mr-3">*/}
                                                        {/*    <span*/}
                                                        {/*        className="material-symbols-outlined">person_add</span>*/}
                                                        {/*</button>*/}

                                                        {/*<button onClick={() => router.push(`/cases/${singlecase.id}`)}*/}
                                                        {/*        className="font-semibold text-primary hover:underline mr-3">*/}
                                                        {/*    <span className="material-symbols-outlined">edit</span>*/}
                                                        {/*</button>*/}

                                                        <button
                                                            onClick={() => router.push(`/cases/${singlecase.id}/show`)}
                                                            className="font-semibold text-primary hover:underline">
                                                            <span
                                                                className="material-symbols-outlined">visibility</span>
                                                        </button>
                                                    </td>
                                                </tr>
                                            )))}
                                        </tbody>
                                    </table>
                                    <Pagination
                                        pageNumber={pageNumber}
                                        pageSize={pageSize}
                                        totalRecords={totalRecords}
                                        totalPages={Math.ceil(totalRecords / pageSize)}
                                        onPageChange={(page) => setPageNumber(page)}
                                    />
                                </div>
                            </div>
                        </div>
                        {/* Modal */}
                        <ExceptionModal caseId={caseId} open={openException} onClose={() => setOpenException(false)}/>
                        <CaseUpdateStatusModel caseId={caseId} open={openUpdateStatus}
                                               onClose={() => setOpenUpdateStatus(false)}/>/
                        {/* MODAL BACKDROP */}
                        {open && (
                            <div
                                className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

                                {/* MODAL CARD */}
                                <form onSubmit={uploadDocument}
                                      className="bg-white dark:bg-background-dark p-8 rounded-xl shadow-xl w-full max-w-lg space-y-8 relative">

                                    {/* CLOSE BUTTON */}
                                    <button
                                        onClick={() => setOpen(false)}
                                        className="absolute top-3 right-3 text-gray-600 dark:text-gray-300 hover:text-primary"
                                    >
                                        <span className="material-symbols-outlined">close</span>
                                    </button>

                                    {/* ---------------- YOUR CONTENT BELOW ---------------- */}

                                    <div>
                                        <h2 className="text-3xl font-extrabold text-center text-gray-900 dark:text-white">
                                            Final Deed &amp; Supporting Pack
                                        </h2>
                                        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                                            Upload the final documents to complete the case.
                                        </p>
                                    </div>

                                    <div
                                        className="bg-white dark:bg-background-dark/50 p-8 rounded-lg shadow-md space-y-6">

                                        {/* FILE UPLOAD -------------------------- */}
                                        <div>
                                            <label
                                                htmlFor="file-upload"
                                                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                            >
                                                Final Deed Pack (PDF/ZIP)
                                            </label>

                                            <label
                                                htmlFor="file-upload"
                                                className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300
                                    dark:border-gray-600 border-dashed rounded-md cursor-pointer
                                    hover:border-primary/70 dark:hover:border-primary/50 transition-colors"
                                            >
                                                <div className="space-y-1 text-center">
                                        <span
                                            className="material-symbols-outlined text-4xl text-gray-400 dark:text-gray-500">
                                            cloud_upload
                                        </span>
                                                    <div
                                                        className="flex text-sm text-gray-600 dark:text-gray-400">
                                                        <p className="pl-1">
                                                            Drag and drop or{" "}
                                                            <span
                                                                className="text-primary font-semibold">click to upload</span>
                                                        </p>
                                                    </div>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        PDF, ZIP up to 50MB
                                                    </p>
                                                    {/* Show attached file */}
                                                    {file && (
                                                        <div
                                                            className="text-sm text-green-600 flex items-center gap-2">
                                                                        <span
                                                                            className="material-symbols-outlined text-base">attach_file</span>
                                                            {file?.name}
                                                        </div>
                                                    )}
                                                </div>
                                            </label>

                                            <input
                                                onChange={handleFileChange}
                                                id="file-upload" name="file-upload" type="file"
                                                className="sr-only"/>
                                        </div>

                                        {/* DEED ID -------------------------- */}
                                        <div className="mt-1 relative">
                                        <span
                                            className="absolute inset-y-0 left-0 flex items-center pl-3">
                                            <span
                                                className="material-symbols-outlined text-gray-500 dark:text-gray-400 text-[20px]">
                                                confirmation_number
                                            </span>
                                        </span>

                                            <input
                                                id="deed-id"
                                                name="deed-id"
                                                type="text"
                                                placeholder="Enter Deed ID"
                                                className="block w-full pl-10 pr-3 py-3 rounded-md bg-background-light dark:bg-background-dark border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-primary focus:border-primary sm:text-sm"
                                            />
                                        </div>


                                        {/* DATE ISSUED -------------------------- */}
                                        <div className="mt-1 relative">
                                        <span
                                            className="absolute inset-y-0 left-0 flex items-center pl-3">
                                            <span
                                                className="material-symbols-outlined text-gray-500 dark:text-gray-400 text-[20px]">
                                                event
                                            </span>
                                        </span>
                                            <input
                                                id="date-issued"
                                                name="date-issued"
                                                type="date"
                                                className="block w-full pl-10 pr-3 py-3 rounded-md bg-background-light dark:bg-background-dark border border-gray-300 dark:border-gray-700 focus:ring-primary focus:border-primary sm:text-sm"
                                            />
                                        </div>


                                        {/* SAVE BUTTON -------------------------- */}
                                        <button
                                            type="submit"
                                            className="w-full flex justify-center py-3 px-4 rounded-md shadow-sm
                                text-sm font-medium text-white bg-primary hover:bg-primary/90
                                focus:outline-none focus:ring-2 focus:ring-offset-2
                                focus:ring-primary transition-colors"
                                        >
                                            Save
                                        </button>

                                    </div>
                                </form>
                            </div>
                        )}
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
            </div>
        )
    }
}
