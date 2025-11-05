"use client";

import Sidebar from "@/components/Sidebar";
import CaseTabs from "@/components/CaseTabs";
import DocumentForm from "@/components/DocumentForm";
import {useParams} from "next/navigation";
import {useEffect, useState} from "react";
import {api} from "@/lib/api";

export default function DocumentsPage() {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const params = useParams();
    const id = params.id;

    useEffect(() => {
        fetchDocuments();
    }, [id]);

    const fetchDocuments = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await api(`/cases/${id}`, {method: "GET"});
            if (response.ok) {
                setDocuments(response.results?.data?.documents || []);
            } else {
                setError("Failed to load documents");
            }
        } catch (err) {
            setError("An error occurred while loading documents");
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="flex min-h-screen">
            <div className="flex flex-col w-full">
                {/* Sidebar */}
                <Sidebar/>

                {/* Main */}
                <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="px-4 md:px-10 lg:px-40 flex justify-center py-5">
                        <div className="flex flex-col max-w-[960px] flex-1">
                            {/* Title */}
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

                            {/* Tabs */}
                            <div className="bg-white dark:bg-subtle-dark/50 rounded-lg p-6 shadow-sm">

                                <CaseTabs/>

                                {/* Form */}
                                <DocumentForm id={id} onUploadSuccess={fetchDocuments}/>

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
                                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Type</th>
                                                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600 dark:text-gray-300">Download</th>
                                            </tr>
                                            </thead>
                                            <tbody
                                                className="bg-white dark:bg-slate-800 divide-y divide-gray-100 dark:divide-gray-700">
                                            {documents.length > 0 ? (
                                                documents.map((document, index) => (
                                                    <tr key={document.id}>
                                                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-200">{index + 1}</td>
                                                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-200">
                                                            {document?.kind || "—"}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-200">
                                                            <a download="" target="_blank" rel="noopener noreferrer"
                                                               className="text-primary hover:text-primary/80 flex items-center justify-end gap-1"
                                                               href={document?.fileUrl}>
                                                                <span>Download</span><span
                                                                className="material-symbols-outlined text-base">download</span>
                                                            </a>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={5}
                                                        className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                                        No File found
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
