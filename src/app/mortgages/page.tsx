"use client";

import Sidebar from "@/components/Sidebar";
import {useRouter} from "next/navigation";
import {ChangeEvent, FormEvent, useEffect, useState} from "react";
import {api} from "@/lib/api";
import toast from "react-hot-toast";
import PageLoader from "@/components/PageLoader";
import Pagination from "@/components/Pagination";

interface User {
    name: string;
    email: string;
    role?: string;
}

interface Bank {
    id: string;
    name: string;
}

export default function MortgagesPage() {
    const router = useRouter();
    const [mortgages, setMortgages] = useState<any[]>([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, sePageSize] = useState(10);
    const [totalRecords, setTotalRecords] = useState(1);
    const [loading, setLoading] = useState(false);
    const [isEditable, setIsEditable] = useState(false);
    const [documents, setDocuments] = useState([]);
    const [user, setUser] = useState<User | null>(null);
    const [bankId, setBankId] = useState("");
    const [banks, setBanks] = useState<Bank[]>([]);
    const [requestedBy, setRequestedBy] = useState("");
    const [status, setStatus] = useState("PENDING");
    const [caseId, setCaseId] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [open, setOpen] = useState(false);
    const [fileType, setFileType] = useState("");
    const [file, setFile] = useState<any>(null);

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

    const fetchMortgages = async ({
                                      pageNumber = 1,
                                      pageSize = 10,
                                  }) => {
        setLoading(true);

        try {
            const mortgageStatus = "APPLICATION_SUBMITTED";

            const query =
                `mortgageStatus=${encodeURIComponent(mortgageStatus)}` +
                `&pageNumber=${encodeURIComponent(pageNumber)}` +
                `&pageSize=${encodeURIComponent(pageSize)}`;

            const response = await api(`/cases?${query}`, {
                method: "GET",
            });

            // Support both fetch-style and axios-style responses
            if (response?.ok || response?.status === 200) {
                const data = response?.results?.data;

                setMortgages(Array.isArray(data?.cases) ? data.cases : []);
                setTotalRecords(data?.meta?.total || 1);
            } else {
                toast.error(response?.results?.message || "Error fetching mortgages");
            }
        } catch (error) {
            console.error("Fetch mortgages failed:", error);
            toast.error("Network error while fetching mortgages");
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchMortgages({pageNumber, pageSize});
    }, [pageNumber, pageSize]);

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
        void fetchValuation(caseId); // ✅ explicitly ignore Promise
    }, [caseId]);


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

        console.log(payload);

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

    const handleOpenModel = (caseId: string, documents: any) => {
        setOpen(true);
        const finalDocuments = documents.filter((doc: any) => doc.kind === "FOL" || doc.kind === "VALUATION");
        setDocuments(finalDocuments)
        setCaseId(caseId);
    }

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFile(file);
        }
    };


    const uploadDocument = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (!file) {
            alert("Please select a file first");
            return;
        }

        const formData = new FormData();
        formData.append("document", file);

        try {
            const res = await api(`/cases/${caseId}/documents/${fileType}`, {
                method: "PUT",
                body: formData,
            });

            if (!res.ok) {
                toast.error("Error while uploading case");
            }

            toast.success("Success: " + res.results.message)

        } catch (err) {
            console.error(err);
            toast.error("Error: " + err);
        } finally {
            setLoading(false);
        }
    };

    if (loading || !mortgages) {
        return (
            <div className="flex min-h-screen items-center justify-center text-gray-500">
                <PageLoader/>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Sidebar/>
            <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    {(user?.role === "BROKER" || user?.role === "ORG_ADMIN") && (
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
                                            {m.id.split("-")[0]}
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
                                                onClick={() => void handleModelOpener(m.id)}
                                                className="text-primary hover:underline m-2">
                                                <span className="material-symbols-outlined">analytics</span>
                                            </button>
                                            <button
                                                onClick={() => handleOpenModel(m.id, m.documents)}
                                                className="text-primary hover:underline items-center gap-1 m-2">
                                                <span className="material-symbols-outlined">cloud_upload</span>
                                            </button>
                                            <a className="text-primary hover:underline m-2"
                                               href={`/mortgages/${m.id}/show`}>
                                                <span className="material-symbols-outlined">visibility</span>
                                            </a>
                                            <a className="text-primary hover:underline m-2"
                                               href={`/mortgages/${m.id}/edit`}>
                                                <span className="material-symbols-outlined">edit</span>
                                            </a>
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                        <Pagination
                            pageNumber={pageNumber}
                            pageSize={10}
                            totalRecords={totalRecords}
                            totalPages={Math.ceil(totalRecords / 10)}
                            onPageChange={(page) => setPageNumber(page)}
                        />
                    </div>
                </div>
                {/* MODAL BACKDROP */}
                {open && (
                    <div
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

                        {/* MODAL CARD */}
                        <form
                            onSubmit={uploadDocument}
                            className="bg-white dark:bg-background-dark p-8 rounded-xl shadow-xl w-full max-w-5xl relative"
                        >
                            {/* CLOSE BUTTON */}
                            <button
                                onClick={() => setOpen(false)}
                                className="absolute top-3 right-3 text-gray-600 dark:text-gray-300 hover:text-primary"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>

                            {/* MAIN GRID */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">

                                {/* LEFT SIDE — FORM */}
                                <div className="space-y-8">

                                    <div>
                                        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white text-center md:text-left">
                                            Upload Valuation, FOL & Supporting Documents
                                        </h2>
                                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center md:text-left">
                                            Upload the documents to complete the case.
                                        </p>
                                    </div>

                                    <div
                                        className="bg-white dark:bg-background-dark/50 p-8 rounded-lg shadow-md space-y-6">

                                        {/* FILE TYPE */}
                                        <div>
                                            <label
                                                htmlFor="deed-id"
                                                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                            >
                                                File Type
                                            </label>

                                            <select
                                                value={fileType}
                                                onChange={(e) => setFileType(e.target.value)}
                                                className="mt-1 form-input block w-full pl-3 pr-3 py-3
                                bg-background-light dark:bg-background-dark
                                border border-gray-300 dark:border-gray-700 rounded-md
                                focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                            >
                                                <option value="">Select File Type</option>
                                                <option value="VALUATION">Valuation</option>
                                                <option value="FOL">FOL</option>
                                            </select>
                                        </div>

                                        {/* FILE UPLOAD */}
                                        <div>
                                            <label
                                                htmlFor="file-upload"
                                                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                            >
                                                FOL and Valuation Documents (PDF/ZIP)
                                            </label>

                                            <label
                                                htmlFor="file-upload"
                                                className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300
                            dark:border-gray-600 border-dashed rounded-md cursor-pointer
                            hover:border-primary/70 dark:hover:border-primary/50 transition-colors"
                                            >
                                                <div className="space-y-1 text-center">
                            <span className="material-symbols-outlined text-4xl text-gray-400 dark:text-gray-500">
                                cloud_upload
                            </span>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        Drag & drop or <span className="text-primary font-semibold">click to upload</span>
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        PDF, ZIP up to 50MB
                                                    </p>

                                                    {/* ATTACHED FILE */}
                                                    {file && (
                                                        <div className="text-sm text-green-600 flex items-center gap-2">
                                                            <span
                                                                className="material-symbols-outlined text-base">attach_file</span>
                                                            {file?.name}
                                                        </div>
                                                    )}
                                                </div>
                                            </label>

                                            <input
                                                onChange={handleFileChange}
                                                id="file-upload"
                                                name="file-upload"
                                                type="file"
                                                className="sr-only"
                                            />
                                        </div>

                                        {/* SAVE BUTTON */}
                                        <button
                                            type="submit"
                                            className="w-full flex justify-center py-3 px-4 rounded-md shadow-sm
                        text-sm font-medium text-white bg-primary hover:bg-primary/90
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </div>

                                {/* RIGHT SIDE — DOCUMENT LIST */}
                                <div className="space-y-4">
                                    <div className="text-left">
                                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Uploaded
                                            Documents</h1>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">View or download
                                            previously uploaded files for this case.</p>
                                    </div>
                                    {/* DOCUMENT ITEM */}
                                    {documents.map((document: any) => (
                                        <div key={document.id}
                                             className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                            <div className="flex items-center space-x-4">
                                            <span
                                                className="material-icons-outlined text-gray-400 dark:text-gray-500 text-3xl">description</span>
                                                <div>
                                                    <p className="font-medium text-gray-800 dark:text-gray-100">{document.kind}</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">PDF • 12 Jan
                                                        2024</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-3">
                                                {/*<button className="text-gray-500 dark:text-gray-400 hover:text-primary">*/}
                                                {/*    <span className="material-icons-outlined">visibility</span>*/}
                                                {/*</button>*/}
                                                <button className="text-gray-500 dark:text-gray-400 hover:text-primary">
                                                    <span className="material-icons-outlined">download</span>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                            </div>
                        </form>

                    </div>
                )}

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