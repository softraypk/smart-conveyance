"use client"

import Sidebar from "@/components/Sidebar";
import {useEffect, useState} from "react";
import toast from "react-hot-toast";
import {api} from "@/lib/api";
import Pagination from "@/components/Pagination";

type DocumentItem = {
    id: string;
    name: string;
    caseId: string;
    kind: string;
    size: number;
    mimeType: string;
    createdAt: string;
    file: {
        url: string;
        filename: string;
        mimeType: string;
    }
};

export default function Page() {
    const [keyword, setKeyword] = useState("");
    const [docType, setDocType] = useState("");
    const [sortBy, setSortBy] = useState("");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [pageSize, setPageSize] = useState(10);
    const [pageNumber, setPageNumber] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);

    const [documents, setDocuments] = useState<DocumentItem[]>([]);
    const [allDocuments, setAllDocuments] = useState<DocumentItem[]>([]);

    const listDocuments = async (
        page = 1,
        pageSize = 10,
        docType?: string,
        sortBy: string = "createdAt",
        sortOrder: "asc" | "desc" = "desc"
    ) => {
        const params = new URLSearchParams({
            pageNumber: String(page),
            pageSize: String(pageSize),
            sortBy,
            sortOrder,
        });

        if (docType) {
            params.append("docType", docType);
        }

        const response = await api(`/documents?${params.toString()}`);

        if (response.ok) {
            const docs = response.results?.data?.documents ?? [];

            setDocuments(docs);
            setAllDocuments(docs);
            setTotalRecords(response.results?.data?.meta?.total ?? 0);
        } else {
            toast.error("Error: " + response.results?.message);
        }
    };


    useEffect(() => {
        listDocuments(pageNumber, pageSize, docType, sortBy, sortOrder);
    }, [pageNumber, pageSize, docType, sortBy, sortOrder]);


    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this document?")) return;

        try {
            const res = await api(`/documents/${id}`, {method: "DELETE"});

            if (!res.ok) throw new Error();

            setDocuments((prev) => prev.filter((d) => d.id !== id));
            setAllDocuments((prev) => prev.filter((d) => d.id !== id));

            toast.success("Document deleted");
        } catch {
            toast.error("Failed to delete document");
        }
    };


    return (
        <div className="flex min-h-screen">
            <Sidebar/>
            <main className="flex-1 p-8">
                <div className="max-w-9xl mx-auto">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Documents</h2>
                            <p className="text-slate-500 dark:text-slate-400 mt-1">Manage and access all property
                                transaction documentation across your organization.</p>
                        </div>
                        {/*<button*/}
                        {/*    className="bg-primary text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium hover:bg-slate-800 transition-colors shadow-sm">*/}
                        {/*    <span className="material-symbols-outlined">upload_file</span>*/}
                        {/*    Upload New Document*/}
                        {/*</button>*/}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div
                            className="bg-card-light dark:bg-card-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Documents</p>
                            <h3 className="text-3xl font-bold mt-2">{ totalRecords }</h3>
                        </div>
                        <div
                            className="bg-card-light dark:bg-card-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Pending Review</p>
                            <h3 className="text-3xl font-bold mt-2">24</h3>
                        </div>
                        <div
                            className="bg-card-light dark:bg-card-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Cases Active</p>
                            <h3 className="text-3xl font-bold mt-2 text-blue-600">86</h3>
                        </div>
                    </div>
                    <div
                        className="bg-card-light dark:bg-card-dark p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm mb-6 flex flex-wrap gap-4 items-center">
                        <div className="flex-1 relative min-w-75">
                        <span
                            className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                            <input
                                value={keyword}
                                onChange={(e) => {
                                    const value = e.target.value.toLowerCase();
                                    setKeyword(value);

                                    setDocuments(
                                        allDocuments.filter((doc) => {
                                            const searchable = [
                                                doc.file?.filename,
                                                doc.caseId,
                                                doc.kind,
                                            ]
                                                .filter(Boolean)
                                                .join(" ")
                                                .toLowerCase();

                                            return searchable.includes(value);
                                        })
                                    );
                                }}
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border-none rounded-lg text-sm focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-700 transition-all"
                                placeholder="Search documents by name or keyword..." type="text"/>
                        </div>
                        <div className="flex items-center gap-3">
                            <select
                                className="text-sm border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 focus:ring-slate-500">
                                <option>Case ID: All</option>
                                <option>CS-9921</option>
                                <option>CS-8812</option>
                                <option>CS-7742</option>
                            </select>
                            <select
                                value={docType}
                                onChange={(e) => {
                                    setDocType(e.target.value)
                                }}
                                className="text-sm border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 focus:ring-slate-500">
                                <option>Document Type: All</option>
                                <option value="FORM_F">FORM_F</option>
                                <option value="NOC">NOC</option>
                                <option value="BANK_CLEARENCE_LETTER">BANK_CLEARENCE_LETTER</option>
                                <option value="VALUATION">VALUATION</option>
                                <option value="FOL">FOL</option>
                                <option value="OTHER">OTHER</option>
                                <option value="INCOME_PROOF">INCOME_PROOF</option>
                                <option value="BANK_STATEMENT">BANK_STATEMENT</option>
                                <option value="IDENTIFICATION">IDENTIFICATION</option>
                                <option value="DEED">DEED</option>
                            </select>
                            <select
                                value={sortBy}
                                onChange={(e) => {
                                    setSortBy(e.target.value)
                                }}
                                className="text-sm border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 focus:ring-slate-500">
                                <option value="createdAt">Sort By: createdAt</option>
                                <option value="updatedAt">Sort By: updatedAt</option>
                                <option value="kind">Sort By: kind</option>
                            </select>
                            <button
                                className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                            <span
                                className="material-symbols-outlined text-slate-600 dark:text-slate-400">filter_list</span>
                            </button>
                        </div>
                    </div>
                    <div
                        className="bg-card-light dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                            <tr className="border-b border-slate-100 dark:border-slate-800">
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Document
                                    Name
                                </th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Case
                                    ID
                                </th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Document
                                    Type
                                </th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Upload
                                    Date
                                </th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {documents.map((doc) => (
                                <tr key={doc.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-10 h-10 bg-blue-50 rounded flex items-center justify-center">
                                                <span className="material-symbols-outlined text-blue-600">
                                                    description
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold">{doc.file?.filename}</p>
                                                <p className="text-xs text-slate-500">
                                                    {doc.file?.mimeType}
                                                    {/*{(doc.size / 1024 / 1024).toFixed(2)} MB •*/}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="px-2.5 py-1 text-xs bg-slate-100 rounded-md">
                                            {doc.caseId}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="px-2.5 py-1 text-xs bg-indigo-50 rounded-full">
                                            {doc.kind}
                                        </span>
                                    </td>

                                    <td className="px-6 py-5">
                                        {new Date(doc.createdAt).toLocaleDateString()}
                                    </td>

                                    <td className="px-6 py-5 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => window.open(doc.file?.url, "_blank")}
                                                title="View"
                                            >
                                                <span className="material-symbols-outlined">visibility</span>
                                            </button>

                                            <button
                                                onClick={() => window.open(doc.file?.url)}
                                                title="Download">
                                                <span className="material-symbols-outlined">download</span>
                                            </button>

                                            <button
                                                onClick={() => handleDelete(doc.id)}
                                                title="Delete"
                                                className="hover:text-red-500">
                                                <span className="material-symbols-outlined">delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
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
                    <div
                        className="mt-8 flex items-center gap-2 text-xs text-slate-400 bg-slate-100/50 dark:bg-slate-800/30 px-3 py-2 rounded-full w-fit">
                        <span className="material-symbols-outlined text-[14px]">shield</span>
                        <span>You are currently viewing all organization records (Admin Access)</span>
                    </div>
                </div>
            </main>
        </div>
    )
}